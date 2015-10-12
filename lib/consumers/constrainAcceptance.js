'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (res.accepted && !test(res.value)) {
      return api.reject('constrainAcceptance test failed', res);
    }

    return api.forward(res.value, res);
  });
};
