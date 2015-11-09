'use strict';

var parser = require('../../../lib/index.js').flat;

module.exports = parser.name('operator', parser.or(
  parser.single('+'),
  parser.single('-'),
  parser.single('*'),
  parser.single('/'),
  parser.single('=')
));
