'use strict';

var parser = require('../../../lib/index.js').flat;

var condition = require('./condition.js');
var codeBlock = require('./codeBlock.js');

var if_ = parser.name('cppIf', parser.labelledSequence(
  parser.string('if'),
  parser.many(parser.whitespace),
  ['condition', condition],
  parser.many(parser.whitespace),
  ['body', codeBlock],
  ['continuation', parser.optional(
    parser.labelledSequence(
      parser.many(parser.whitespace),
      parser.string('else'),
      parser.many(parser.whitespace),
      ['elseBody', parser.labelledOr(
        ['codeBlock', codeBlock],
        ['if', parser.defer('cppIf', function() { return if_; })]
      )]
    )
  )]
));

module.exports = if_;
