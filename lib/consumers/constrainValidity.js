'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer('constrainValidity(' + consumer.name + ')', function(api) {
    var res = consumer.consume(api.stream);

    if (res.accepted && !test(res.value)) {
      api.invalidate('Test failed', res);
    }

    return api.forward(res.value, res);
  });
};
