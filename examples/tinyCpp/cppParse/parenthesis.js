'use strict';

var parser = require('../../../lib/index.js').flat;

module.exports = parser.name('parenthesis', parser.or(
  parser.single('('),
  parser.single(')')
));
