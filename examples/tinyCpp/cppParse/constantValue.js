'use strict';

var parser = require('../../../lib/index.js').flat;

var integer = require('./integer.js');

module.exports = parser.name('constantValue', parser.or(
  integer
));
