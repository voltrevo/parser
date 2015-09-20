'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(api) {
    var rejectValues = [];

    for (var i = 0; i !== args.length; i++) {
      var candidate = args[i](api.stream);

      if (candidate.type === 'reject') {
        rejectValues.push(candidate.value);
        continue;
      }

      return api[candidate.type](candidate.value);
    }

    return api.reject(rejectValues);
  });
};
