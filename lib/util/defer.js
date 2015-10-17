'use strict';

var name = require('../consumers/name.js');
var once = require('./once.js').memoize;

module.exports = function(newName, createConsumer) {
  var get = once(function() {
    return name(newName, createConsumer());
  });

  return {
    name: newName,
    consume: function() {
      return get().consume.apply(this, arguments);
    }
  };
};
