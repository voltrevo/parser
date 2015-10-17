'use strict';

var any = require('./any.js');
var constrainAcceptance = require('./constrainAcceptance.js');
var name = require('./name.js');

module.exports = name('whitespace', constrainAcceptance(
  any,
  function(single) {
    return (
      typeof single === 'string' &&
      /^\s$/.test(single)
    );
  }
));
