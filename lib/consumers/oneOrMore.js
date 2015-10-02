'use strict';

var constrainAcceptance = require('./constrainAcceptance.js');
var many = require('./many.js');

module.exports = function(consumer) {
  return constrainAcceptance(many(consumer), function(value) {
    return value.length >= 1;
  });
};
