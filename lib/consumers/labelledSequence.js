'use strict';

// core modules
var assert = require('assert');

// local modules
var name = require('./name.js');
var sequence = require('./sequence.js');
var transform = require('./transform.js');

module.exports = function(/* labelConsumerPairs... */) {
  var pairs = Array.prototype.slice.apply(arguments);

  return name(
    (
      'labelledSequence({' +
      pairs.map(function(pair) {
        if (Array.isArray(pair)) {
          return JSON.stringify(pair[0]) + ': ' + pair[1].name;
        }

        return pair.name;
      }).join(', ') +
      '})'
    ),
    transform(
      sequence.apply(undefined, pairs.map(function(pair) {
        if (Array.isArray(pair)) {
          return transform(
            pair[1],
            function(value) {
              return {
                label: pair[0],
                value: value
              };
            }
          );
        }

        return pair;
      })),
      function(values) {
        var result = {};

        values.forEach(function(value) {
          if (value.label) {
            assert(!(value.label in result));
            result[value.label] = value.value;
          }
        });

        return result;
      }
    )
  );
};
