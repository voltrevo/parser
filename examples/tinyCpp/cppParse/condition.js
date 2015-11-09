'use strict';

var parser = require('../../../lib/index.js').flat;

var expression = require('./expression.js');

module.exports = parser.name('condition', parser.pipe(
  parser.block(
    parser.single('('),
    parser.single(')')
  ),
  expression
));
