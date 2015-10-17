'use strict';

var any = require('./any.js');
var constrainAcceptance = require('./constrainAcceptance.js');
var transform = require('./transform.js');

module.exports = transform(
  constrainAcceptance(
    any,
    function(single) {
      return (
        typeof single === 'string' &&
        single.length === 1 &&
        ('0' <= single && single <= '9')
      );
    }
  ),
  Number
);
