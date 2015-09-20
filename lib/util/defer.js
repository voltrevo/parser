'use strict';

var once = require('../util/once.js').memoize;

module.exports = function(fn) {
  var get = once(fn);

  return function() {
    return get().apply(this, arguments);
  };
};
