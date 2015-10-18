'use strict';

var parser = require('../../lib/index.js').flat;

var deferField = function(obj, field) {
  return parser.defer(field, function() {
    return obj[field];
  });
};

var cpp = {};

cpp.identifier = parser.name('identifier', parser.transform(
  parser.constrainAcceptance(
    parser.oneOrMore(
      parser.constrainAcceptance(parser.any, function(value) {
        return /^[a-zA-Z0-9_]$/.test(value);
      })
    ),
    function(value) {
      return !/^[0-9]$/.test(value[0]);
    }
  ),
  function(value) {
    return value.join('');
  }
));

cpp.typename = parser.name('typename', parser.or(
  // parser.string('void'), TODO
  parser.string('int')
));

cpp.integer = parser.name('integer', parser.transform(
  parser.sequence(
    parser.optional(parser.single('-')),
    parser.oneOrMore(parser.digit)
  ),
  function(value) {
    var minusSign = value[0];
    var digits = value[1];

    return (minusSign.set ? -1 : 1) * Number(digits.join(''));
  }
));

parser.constantValue = parser.name('constantValue', parser.or(
  cpp.integer
));

cpp.globalVariableDeclaration = parser.name('globalVariableDeclaration', parser.labelledSequence(
  ['type', cpp.typename],
  parser.whitespace,
  ['name', cpp.identifier],
  parser.many(parser.whitespace),
  parser.single('='),
  parser.many(parser.whitespace),
  ['value', parser.constantValue],
  parser.single(';')
));

cpp.argumentList = parser.name('argumentList', parser.list(
  parser.labelledSequence(
    ['type', cpp.typename],
    parser.whitespace,
    ['name', cpp.identifier]
  ),
  parser.wrapOptionalWhitespace(
    parser.single(',')
  )
));

cpp.functionHeading = parser.name('functionHeading', parser.labelledSequence(
  ['returnType', cpp.typename],
  parser.whitespace,
  ['name', cpp.identifier],
  parser.many(parser.whitespace),
  parser.single('('),
  ['arguments', parser.wrapOptionalWhitespace(
    cpp.argumentList
  )],
  parser.single(')')
));

cpp.functionForwardDeclaration = parser.name('functionForwardDeclaration', parser.transform(
  parser.sequence(
    cpp.functionHeading,
    parser.many(parser.whitespace),
    parser.single(';')
  ),
  function(value) {
    return value[0];
  }
));

cpp.block = parser.block(
  parser.single('{'),
  parser.single('}')
);

cpp.operator = parser.name('operator', parser.or(
  parser.single('+'),
  parser.single('-'),
  parser.single('*'),
  parser.single('/'),
  parser.single('=')
));

cpp.parenthesis = parser.name('parenthesis', parser.or(
  parser.single('('),
  parser.single(')')
));

cpp.operatorSets = [
  ['='],
  ['+', '-'],
  ['*', '/']
];

cpp.tokenize = parser.name('tokenize', parser.transform(
  parser.many(
    parser.wrapOptionalWhitespace(
      parser.labelledOr(
        ['value', cpp.integer],
        ['operator', cpp.operator],
        ['comma', parser.single(',')],
        ['parenthesis', cpp.parenthesis],
        ['variable', cpp.identifier]
      )
    )
  ),
  function(value) {
    return parser.Stream(value);
  }
));

cpp.functionCall = parser.name('functionCall', parser.transform(
  parser.sequence(
    parser.if(function(token) {
      return token.label === 'variable';
    }),
    parser.pipe(
      parser.block(
        parser.if(function(token) {
          return token.value === '(';
        }),
        parser.if(function(token) {
          return token.value === ')';
        })
      ),
      parser.list(
        parser.pipe(
          parser.substream(
            parser.many(parser.andNot(
              parser.or(
                parser.block(
                  parser.if(function(token) { return token.value === '('; }),
                  parser.if(function(token) { return token.value === ')'; })
                ),
                parser.any
              ),
              parser.if(function(token) { return token.label === 'comma'; })
            ))
          ),
          deferField(cpp, 'tokenExpression')
        ),
        parser.if(function(token) {
          return token.label === 'comma';
        })
      )
    )
  ),
  function(value) {
    return {
      label: 'functionCall',
      value: {
        name: value[0].value,
        arguments: value[1]
      }
    };
  }
));

cpp.expressionInParenthesis = parser.name('expressionInParenthesis', parser.pipe(
  parser.block(
    parser.if(function(token) {
      return token.value === '(';
    }),
    parser.if(function(token) {
      return token.value === ')';
    })
  ),
  deferField(cpp, 'tokenExpression')
));

cpp.expressionParenthesisExtractor = parser.name('expressionParenthesisExtractor', parser.transform(
  parser.many(
    parser.or(
      cpp.functionCall,
      cpp.expressionInParenthesis,
      parser.any
    )
  ),
  function(value) {
    return parser.Stream(value);
  }
));

cpp.expressionOperatorExtractor = function(index) {
  var operatorSet = cpp.operatorSets[index];

  if (!operatorSet) {
    return parser.if(function(token) {
      return ['value', 'variable', 'expressionTree', 'functionCall'].indexOf(token.label) !== -1;
    });
  }

  var currExtractor = parser.transform(
    parser.labelledSequence(
      ['lhs', parser.pipe(
        parser.substream(
          parser.oneOrMore(
            parser.if(function(token) {
              return operatorSet.indexOf(token.value) === -1;
            })
          )
        ),
        cpp.expressionOperatorExtractor(index + 1)
      )],
      ['operatorAndRhs', parser.optional(
        parser.labelledSequence(
          ['operator', parser.if(function(token) {
            return operatorSet.indexOf(token.value) !== -1;
          })],
          ['rhs', parser.defer('currExtractor', function() { return currExtractor; })]
        )
      )]
    ),
    function(value) {
      if (!value.operatorAndRhs.set) {
        return value.lhs;
      }

      return {
        label: 'expressionTree',
        value: {
          lhs: value.lhs,
          operator: value.operatorAndRhs.value.operator.value,
          rhs: value.operatorAndRhs.value.rhs
        }
      };
    }
  );

  return parser.name('expressionOperatorExtractor(' + index + ')', currExtractor);
};

cpp.tokenExpression = parser.name('tokenExpression', parser.pipe(
  cpp.expressionParenthesisExtractor,
  cpp.expressionOperatorExtractor(0)
));

cpp.expression = parser.name('expression', parser.pipe(
  cpp.tokenize,
  cpp.tokenExpression
));

cpp.expressionStatement = parser.name('expressionStatement', parser.transform(
  parser.sequence(
    parser.pipe(
      parser.substream(
        parser.many(parser.andNot(parser.any, parser.single(';')))
      ),
      cpp.expression
    ),
    parser.single(';')
  ),
  function(value) {
    return value[0];
  }
));

cpp.variableDeclaration = parser.name('variableDeclaration', parser.labelledSequence(
  ['type', cpp.typename],
  parser.whitespace,
  ['name', cpp.identifier],
  parser.whitespace,
  parser.single('='),
  parser.many(parser.whitespace),
  ['expression', cpp.expressionStatement]
));

cpp.returnStatement = parser.name('returnStatement', parser.transform(
  parser.sequence(
    parser.string('return'),
    parser.whitespace,
    cpp.expressionStatement
  ),
  function(value) {
    return value[2];
  }
));

cpp.codeBlock = parser.name('codeBlock', parser.pipe(
  cpp.block,
  parser.wrapOptionalWhitespace(
    parser.many(
      parser.wrapOptionalWhitespace(
        deferField(cpp, 'statement')
      )
    )
  )
));

cpp.condition = parser.name('condition', parser.pipe(
  parser.block(
    parser.single('('),
    parser.single(')')
  ),
  cpp.expression
));

cpp.if = parser.name('cppIf', parser.labelledSequence(
  parser.string('if'),
  parser.many(parser.whitespace),
  ['condition', cpp.condition],
  parser.many(parser.whitespace),
  ['body', cpp.codeBlock],
  ['continuation', parser.optional(
    parser.labelledSequence(
      parser.many(parser.whitespace),
      parser.string('else'),
      parser.many(parser.whitespace),
      ['elseBody', parser.labelledOr(
        ['codeBlock', cpp.codeBlock],
        ['if', deferField(cpp, 'if')]
      )]
    )
  )]
));

cpp.while = parser.name('cppWhile', parser.labelledSequence(
  parser.string('while'),
  parser.many(parser.whitespace),
  ['condition', cpp.condition],
  parser.many(parser.whitespace),
  ['body', cpp.codeBlock]
));

cpp.statement = parser.name('statement', parser.labelledOr(
  ['variableDeclaration', cpp.variableDeclaration],
  ['return', cpp.returnStatement],
  ['expression', cpp.expressionStatement],
  ['controlStructure', parser.labelledOr(
    ['codeBlock', cpp.codeBlock],
    ['if', cpp.if],
    ['while', cpp.while]
  )]
));

cpp.function = parser.name('function', parser.labelledSequence(
  ['heading', cpp.functionHeading],
  parser.many(parser.whitespace),
  ['body', cpp.codeBlock]
));

cpp.topLevelElement = parser.name('topLevelElement', parser.labelledOr(
  ['function', cpp.function],
  ['functionForwardDeclaration', cpp.functionForwardDeclaration],
  ['globalVariableDeclaration', cpp.globalVariableDeclaration]
));

cpp.program = parser.name('program', parser.transform(
  parser.sequence(
    parser.many(
      parser.sequence(
        parser.many(parser.whitespace),
        cpp.topLevelElement
      )
    ),
    parser.many(parser.whitespace)
  ),
  function(value) {
    return value[0].map(function(pair) {
      return pair[1];
    });
  }
));

cpp.program.impl = cpp;

module.exports = cpp.program;
