'use strict';

var constrain = require('./constrain.js');
var many = require('./many.js');

module.exports = function(consumer) {
  return constrain(many(consumer), function(value) {
    return value.length >= 1;
  });
};
