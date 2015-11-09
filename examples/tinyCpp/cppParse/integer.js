'use strict';

var parser = require('../../../lib/index.js').flat;

module.exports = parser.name('integer', parser.transform(
  parser.sequence(
    parser.optional(parser.single('-')),
    parser.oneOrMore(parser.digit)
  ),
  function(value) {
    var minusSign = value[0];
    var digits = value[1];

    return (minusSign.set ? -1 : 1) * Number(digits.join(''));
  }
));
