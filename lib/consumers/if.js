'use strict';

var any = require('./any.js');
var constrainAcceptance = require('./constrainAcceptance.js');

module.exports = function(test) {
  return constrainAcceptance(any, test);
};
