'use strict';

var parser = require('../../../lib/index.js').flat;

var functionHeading = require('./functionHeading.js');

module.exports = parser.name('functionForwardDeclaration', parser.transform(
  parser.sequence(
    functionHeading,
    parser.many(parser.whitespace),
    parser.single(';')
  ),
  function(value) {
    return value[0];
  }
));
