'use strict';

var constrainSingle = require('./constrainSingle.js');

module.exports = constrainSingle(function(single) {
  return (
    typeof single === 'string' &&
    /^\s$/.test(single)
  );
});
