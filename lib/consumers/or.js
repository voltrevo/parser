'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(
    'or(' + args.map(function(consumer) { return consumer.name; }).join(', ') + ')',
    function(api) {
      var candidates = [];

      for (var i = 0; i !== args.length; i++) {
        var candidate = args[i].consume(api.stream);

        if (!candidate.accepted) {
          candidates.push(candidate);
          continue;
        }

        return api.forward(candidate.value, candidate);
      }

      candidates.forEach(function(candidate) {
        api.invalidate('Candidate rejected.', candidate);
      });

      return api.reject('All candidates rejected.');
    }
  );
};
