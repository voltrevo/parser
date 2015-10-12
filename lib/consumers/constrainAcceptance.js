'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (!res.accepted) {
      return api.reject('Wrapped consumer rejected.', res);
    }

    if (!test(res.value)) {
      return api.reject('constrainAcceptance test failed', res);
    }

    if (res.invalid) {
      api.invalidate('Wrapped consumer invalid.', res);
    }

    return api.accept(res.value);
  });
};
