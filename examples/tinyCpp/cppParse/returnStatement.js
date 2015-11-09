'use strict';

var parser = require('../../../lib/index.js').flat;

var expressionStatement = require('./expressionStatement.js');

module.exports = parser.name('returnStatement', parser.transform(
  parser.sequence(
    parser.string('return'),
    parser.whitespace,
    expressionStatement
  ),
  function(value) {
    return value[2];
  }
));
