'use strict';

var parser = require('../../../lib/index.js').flat;

var block = require('./block.js');
var statement = require('./statement.js');

module.exports = parser.name('codeBlock', parser.pipe(
  block,
  parser.wrapOptionalWhitespace(
    parser.many(
      parser.wrapOptionalWhitespace(statement)
    )
  )
));
