'use strict';

var assert = require('assert');

var once = {};

once.memoize = function(fn) {
  var result = undefined;

  return function() {
    if (result) {
      return result.value;
    }

    result = {value: fn.apply(this, arguments)};

    return result.value;
  };
};

once.assert = function(fn) {
  var called = false;

  return function() {
    assert(!called);
    called = true;

    return fn.apply(this, arguments);
  };
};

module.exports = once;
