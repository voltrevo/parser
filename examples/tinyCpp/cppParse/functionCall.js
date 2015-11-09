'use strict';

var parser = require('../../../lib/index.js').flat;

var tokenExpression = parser.defer('tokenExpression', function() {
  return require('./tokenExpression.js');
});

module.exports = parser.name('functionCall', parser.transform(
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
          tokenExpression
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
