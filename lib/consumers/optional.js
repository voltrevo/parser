'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(api) {
    var res = consumer(api);

    if (!res.accepted) {
      return api.accept({
        set: false,
        value: res.value
      });
    }

    if (!res.valid) {
      api.invalidate('Optional consumer invalid.', res);
    }

    return api.accept({
      set: true,
      value: res.value
    });
  });
};
