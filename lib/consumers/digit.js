'use strict';

var any = require('./any.js');
var constrainAcceptance = require('./constrainAcceptance.js');

module.exports = constrainAcceptance(
  any,
  function(single) {
    return (
      typeof single === 'string' &&
      single.length === 1 &&
      ('0' <= single && single <= '9')
    );
  }
);
