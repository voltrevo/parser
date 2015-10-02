'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    var type = res.type;

    if (res.accepted && !test(res.value)) {
      return api.reject('constrainAcceptance test failed', res, undefined);
    }

    return api[type](res.value);
  });
};
