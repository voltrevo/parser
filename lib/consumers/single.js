'use strict';

var any = require('./any.js');
var constrainAcceptance = require('./constrainAcceptance.js');

module.exports = function(datum) {
  return constrainAcceptance(
    any,
    function(streamDatum) {
      return streamDatum === datum;
    }
  );
};
