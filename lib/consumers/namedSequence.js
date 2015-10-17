'use strict';

// core modules
var assert = require('assert');

// local modules
var nameValueTransform = require('./nameValueTransform.js');
var sequence = require('./sequence.js');
var transform = require('./transform.js');

module.exports = function(/* consumers... */) {
  var consumers = Array.prototype.slice.apply(arguments);

  return transform(
    sequence.apply(undefined, consumers.map(nameValueTransform)),
    function(values) {
      var result = {};

      values.forEach(function(value) {
        if (value.name) {
          assert(!(value.name in result));
          result[value.name] = value.value;
        }
      });

      return result;
    }
  );
};
