'use strict';

// local modules
var any = require('../consumers/any.js');
var constrainAcceptance = require('../consumers/constrainAcceptance.js');
var constrainValidity = require('../consumers/constrainValidity.js');
var consumerFilter = require('./consumerFilter.js');
var many = require('../consumers/many.js');
var optional = require('../consumers/optional.js');
var or = require('../consumers/or.js');
var sequence = require('../consumers/sequence.js');
var single = require('../consumers/single.js');
var string = require('../consumers/string.js');
var transform = require('../consumers/transform.js');

module.exports = function(inputStream) {
  return consumerFilter(
    or(
      transform(
        sequence(
          string('//'),
          many(
            constrainAcceptance(any, function(value) { return value !== '\n'; })
          ),
          constrainValidity(
            optional(single('\n')),
            function(value) {
              return value.set;
            }
          )
        ),
        function() {
          return '\n';
        }
      ),
      any
    ),
    inputStream
  );
};
