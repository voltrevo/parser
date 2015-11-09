'use strict';

var parser = require('../../../lib/index.js').flat;

var expressionOperatorExtractor = require('./expressionOperatorExtractor.js');
var expressionParenthesisExtractor = require('./expressionParenthesisExtractor.js');

module.exports = parser.name('tokenExpression', parser.pipe(
  expressionParenthesisExtractor,
  expressionOperatorExtractor(0)
));
