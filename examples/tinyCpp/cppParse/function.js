'use strict';

var parser = require('../../../lib/index.js').flat;

var functionHeading = require('./functionHeading.js');
var codeBlock = require('./codeBlock.js');

module.exports = parser.name('function', parser.labelledSequence(
  ['heading', functionHeading],
  parser.many(parser.whitespace),
  ['body', codeBlock]
));
