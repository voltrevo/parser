'use strict';

var parser = require('../../../lib/index.js').flat;

var condition = require('./condition.js');

var codeBlock = parser.defer('codeBlock', function() {
  return require('./codeBlock.js');
});

module.exports = parser.name('cppWhile', parser.labelledSequence(
  parser.string('while'),
  parser.many(parser.whitespace),
  ['condition', condition],
  parser.many(parser.whitespace),
  ['body', codeBlock]
));
