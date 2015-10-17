'use strict';

var many = require('./many.js');
var sequence = require('./sequence.js');
var transform = require('./transform.js');
var whitespace = require('./whitespace.js');

module.exports = function(consumer) {
  return transform(
    sequence(
      many(whitespace),
      consumer,
      many(whitespace)
    ),
    function(value) {
      return value[1];
    }
  );
};
