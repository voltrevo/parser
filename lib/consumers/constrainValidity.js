'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (!res.accepted) {
      return api.reject('wrapped consumer rejected', res);
    }

    if (!test(res.value)) {
      api.invalidate('constrainValidity test failed', res);
    }

    // TODO: Propagate invalidity.

    return api.accept(res.value);
  });
};
