'use strict';

var parser = require('../../../lib/index.js').flat;

var tokenExpression = parser.defer('tokenExpression', function() {
  return require('./tokenExpression.js');
});

module.exports = parser.name('expressionInParenthesis', parser.pipe(
  parser.block(
    parser.if(function(token) {
      return token.value === '(';
    }),
    parser.if(function(token) {
      return token.value === ')';
    })
  ),
  tokenExpression
));
