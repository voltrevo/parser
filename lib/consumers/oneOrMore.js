'use strict';

var constrainAcceptance = require('./constrainAcceptance.js');
var many = require('./many.js');
var name = require('./name.js');

module.exports = function(consumer) {
  return name('oneOrMore(' + consumer.name + ')',
    constrainAcceptance(many(consumer), function(value) {
      return value.length >= 1;
    })
  );
};
