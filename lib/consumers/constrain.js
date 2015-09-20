'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    var type = res.type;

    if (type === 'acceptValid' && !test(res.value)) {
      type = 'acceptInvalid';
    }

    return api[type](res.value);
  });
};
