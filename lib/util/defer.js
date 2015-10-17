'use strict';

var once = require('../util/once.js').memoize;

module.exports = function(name, fn) {
  var get = once(fn);

  return {
    name: name,
    consume: function() {
      return get().consume.apply(this, arguments);
    }
  };
};
