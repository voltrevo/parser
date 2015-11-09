'use strict';

var assert = require('assert');

var name = require('../consumers/name.js');
var once = require('./once.js').memoize;

module.exports = function(newName, createConsumer) {
  var get = once(function() {
    var consumer = createConsumer();
    assert('consume' in consumer);
    return name(newName, consumer);
  });

  return {
    name: newName,
    consume: function() {
      return get().consume.apply(this, arguments);
    }
  };
};
