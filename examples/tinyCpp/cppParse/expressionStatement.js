'use strict';

var parser = require('../../../lib/index.js').flat;

var expression = require('./expression.js');

module.exports = parser.name('expressionStatement', parser.transform(
  parser.sequence(
    parser.pipe(
      parser.substream(
        parser.many(parser.andNot(parser.any, parser.single(';')))
      ),
      expression
    ),
    parser.single(';')
  ),
  function(value) {
    return value[0];
  }
));
