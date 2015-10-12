'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (res.accepted && !test(res.value)) {
      api.invalidate('constrainValidity test failed', res);
    }

    return api.forward(res.value, res);
  });
};
