'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(api) {
    var results = [];

    for (var i = 0; i !== args.length; i++) {
      var currResult = args[i](api.stream);
      results.push(currResult.value);

      if (!currResult.valid) {
        api.invalidate('Element invalid.', currResult);
      } else if (!currResult.accepted) {
        return api.reject('Element rejected.', currResult, results);
      }
    }

    return api.accept(results);
  });
};
