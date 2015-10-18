'use strict';

// local modules
var name = require('./name.js');
var or = require('./or.js');
var transform = require('./transform.js');

module.exports = function(/* labelConsumerPairs... */) {
  var pairs = Array.prototype.slice.apply(arguments);

  return name(
    (
      'labelledOr({' +
      pairs.map(function(pair) {
        return JSON.stringify(pair[0]) + ': ' + pair[1].name;
      }).join(', ') +
      '})'
    ),
    or.apply(undefined, pairs.map(function(pair) {
      return name(pair[0], transform(
        pair[1],
        function(value) {
          return {
            label: pair[0],
            value: value
          };
        }
      ));
    }))
  );
};
