'use strict';

var parser = require('../../../lib/index.js').flat;

module.exports = parser.name('identifier', parser.transform(
  parser.constrainAcceptance(
    parser.oneOrMore(
      parser.constrainAcceptance(parser.any, function(value) {
        return /^[a-zA-Z0-9_]$/.test(value);
      })
    ),
    function(value) {
      return !/^[0-9]$/.test(value[0]);
    }
  ),
  function(value) {
    return value.join('');
  }
));
