'use strict';

var any = require('./any.js');
var constrainAcceptance = require('./constrainAcceptance.js');
var name = require('./name.js');

module.exports = function(datum) {
  return name((typeof datum === 'string' ? JSON.stringify(datum) : 'single'), constrainAcceptance(
    any,
    function(streamDatum) {
      return streamDatum === datum;
    }
  ));
};
