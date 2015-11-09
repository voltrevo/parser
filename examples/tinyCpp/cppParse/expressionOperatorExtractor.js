'use strict';

var parser = require('../../../lib/index.js').flat;

var operatorSets = require('./operatorSets.js');

var expressionOperatorExtractor = function(index) {
  var operatorSet = operatorSets[index];

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
        expressionOperatorExtractor(index + 1)
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

module.exports = expressionOperatorExtractor;
