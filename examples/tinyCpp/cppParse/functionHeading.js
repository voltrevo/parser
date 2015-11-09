'use strict';

var parser = require('../../../lib/index.js').flat;

var argumentList = require('./argumentList.js');
var identifier = require('./identifier.js');
var typename = require('./typename.js');

module.exports = parser.name('functionHeading', parser.labelledSequence(
  ['returnType', typename],
  parser.whitespace,
  ['name', identifier],
  parser.many(parser.whitespace),
  parser.single('('),
  ['arguments', parser.wrapOptionalWhitespace(
    argumentList
  )],
  parser.single(')')
));
