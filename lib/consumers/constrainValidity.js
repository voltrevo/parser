'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    var type = res.type;

    if (res.accepted && !test(res.value)) {
      api.invalidate('constrainValidity test failed', res);
    }

    return api[type](res.value);
  });
};
