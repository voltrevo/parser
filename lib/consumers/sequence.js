'use strict';

// TODO: remove
var assert = require('assert');

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  args.forEach(function(consumer) {
    assert(typeof consumer.name === 'string');
    assert(typeof consumer.consume === 'function');
  });

  return Consumer(
    'sequence(' + args.map(function(consumer) { return consumer.name; }).join(', ') + ')',
    function(api) {
      var results = [];

      for (var i = 0; i !== args.length; i++) {
        var currResult = args[i].consume(api.stream);
        results.push(currResult.value);

        if (!currResult.accepted) {
          return api.reject('Element rejected', currResult, results);
        }

        if (!currResult.valid) {
          api.invalidate('Element invalid', currResult);
        }
      }

      return api.accept(results);
    }
  );
};
