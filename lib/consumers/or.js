'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(api) {
    var candidates = [];

    for (var i = 0; i !== args.length; i++) {
      var candidate = args[i](api.stream);

      if (!candidate.accepted) {
        candidates.push(candidate);
        continue;
      }

      return api.accept(candidate.value);
    }

    candidates.forEach(function(candidate) {
      api.invalidate('Candidate failed.', candidate);
    });

    return api.reject('All candidates failed.');
  });
};
