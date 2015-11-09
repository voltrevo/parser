'use strict';

var parser = require('../../../lib/index.js').flat;

module.exports = parser.name('typename', parser.or(
  // parser.string('void'), TODO
  parser.string('int')
));
