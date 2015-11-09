'use strict';

var assert = require('assert');

module.exports = function(m) {
  assert.equal(typeof m.consume, 'function');
  return m;
};
