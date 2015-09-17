'use strict';

var constrainSingle = require('./constrainSingle.js');

module.exports = function(datum) {
  return constrainSingle(function(streamDatum) {
    return streamDatum === datum;
  });
};
