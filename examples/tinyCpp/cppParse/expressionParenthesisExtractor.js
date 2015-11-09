'use strict';

var parser = require('../../../lib/index.js').flat;

var functionCall = require('./functionCall.js');
var expressionInParenthesis = require('./expressionInParenthesis.js');

module.exports = parser.name('expressionParenthesisExtractor', parser.transform(
  parser.many(
    parser.or(
      functionCall,
      expressionInParenthesis,
      parser.any
    )
  ),
  function(value) {
    return parser.Stream(value);
  }
));
