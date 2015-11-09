'use strict';

var parser = require('../../../lib/index.js').flat;

module.exports = parser.block(
  parser.single('{'),
  parser.single('}')
);
