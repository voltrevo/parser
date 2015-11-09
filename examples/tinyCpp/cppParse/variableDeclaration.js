'use strict';

var parser = require('../../../lib/index.js').flat;

var typename = require('./typename.js');
var identifier = require('./identifier.js');
var expressionStatement = require('./expressionStatement.js');

module.exports = parser.name('variableDeclaration', parser.labelledSequence(
  ['type', typename],
  parser.whitespace,
  ['name', identifier],
  parser.whitespace,
  parser.single('='),
  parser.many(parser.whitespace),
  ['expression', expressionStatement]
));
