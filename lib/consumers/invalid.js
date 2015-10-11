'use strict';

var constrainValidity = require('./constrainValidity.js');

module.exports = function(consumer) {
  return constrainValidity(
    consumer,
    function() { return false; }
  );
};
