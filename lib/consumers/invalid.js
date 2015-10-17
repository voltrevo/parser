'use strict';

var constrainValidity = require('./constrainValidity.js');
var name = require('./name.js');

module.exports = function(consumer) {
  return name('invalid(' + consumer.name + ')', constrainValidity(
    consumer,
    function() { return false; }
  ));
};
