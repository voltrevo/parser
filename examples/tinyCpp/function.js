'use strict';

var assert = require('assert');

module.exports = function(overloadMap) {
  return function(lhs, rhs) {
    var overload = overloadMap[lhs.type + ',' + rhs.type];
    assert(overload);
    return overload(lhs, rhs);
  };
};
