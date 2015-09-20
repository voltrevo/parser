'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, transform) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (res.type === 'acceptValid') {
      return api.acceptValid(transform(res.value));
    }

    return api[res.type](res.value);
  });
};
