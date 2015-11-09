'use strict';

var parser = require('../../../lib/index.js').flat;

var tokenize = require('./tokenize.js');
var tokenExpression = require('./tokenExpression.js');

module.exports = parser.name('expression', parser.pipe(
  tokenize,
  tokenExpression
));
