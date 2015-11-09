'use strict';

var parser = require('../../../lib/index.js').flat;

var identifier = require('./identifier.js');
var typename = require('./typename.js');

module.exports = parser.name('argumentList', parser.list(
  parser.labelledSequence(
    ['type', typename],
    parser.whitespace,
    ['name', identifier]
  ),
  parser.wrapOptionalWhitespace(
    parser.single(',')
  )
));
