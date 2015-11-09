'use strict';

var parser = require('../../../lib/index.js').flat;

var constantValue = require('./constantValue.js');
var typename = require('./typename.js');
var identifier = require('./identifier.js');

module.exports = parser.name('globalVariableDeclaration', parser.labelledSequence(
  ['type', typename],
  parser.whitespace,
  ['name', identifier],
  parser.many(parser.whitespace),
  parser.single('='),
  parser.many(parser.whitespace),
  ['value', constantValue],
  parser.single(';')
));
