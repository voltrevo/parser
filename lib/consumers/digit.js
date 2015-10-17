'use strict';

var constrainSingle = require('./constrainSingle.js');

module.exports = constrainSingle(function(single) {
  return (
    typeof single === 'string' &&
    single.length === 1 &&
    ('0' <= single && single <= '9')
  );
});
