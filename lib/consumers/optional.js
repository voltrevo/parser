'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(api) {
    var res = consumer(api);

    if (res.type === 'reject') {
      return api.acceptValid({
        accepted: false,
        value: res.value
      });
    }

    return api[res.type]({
      accepted: true,
      value: res.value
    });
  });
};
