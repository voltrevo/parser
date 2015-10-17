'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer('constrainAcceptance(' + consumer.name + ')', function(api) {
    var res = consumer.consume(api.stream);

    if (res.accepted && !test(res.value)) {
      return api.reject('Test failed', res);
    }

    return api.forward(res.value, res);
  });
};
