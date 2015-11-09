'use strict';

var parser = require('../../../lib/index.js').flat;

var topLevelElement = require('./topLevelElement.js');

module.exports = parser.name('program', parser.transform(
  parser.sequence(
    parser.many(
      parser.sequence(
        parser.many(parser.whitespace),
        topLevelElement
      )
    ),
    parser.many(parser.whitespace)
  ),
  function(value) {
    return value[0].map(function(pair) {
      return pair[1];
    });
  }
));
