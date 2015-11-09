'use strict';

var parser = require('../../../lib/index.js').flat;

var integer = require('./integer.js');
var operator = require('./operator.js');
var parenthesis = require('./parenthesis.js');
var identifier = require('./identifier.js');

module.exports = parser.name('tokenize', parser.transform(
  parser.many(
    parser.wrapOptionalWhitespace(
      parser.labelledOr(
        ['value', integer],
        ['operator', operator],
        ['comma', parser.single(',')],
        ['parenthesis', parenthesis],
        ['variable', identifier]
      )
    )
  ),
  function(value) {
    return parser.Stream(value);
  }
));
