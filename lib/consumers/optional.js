'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (!res.accepted) {
      return api.accept({
        set: false,
        value: res.value
      });
    }

    return api.forward(
      {
        set: true,
        value: res.value
      },
      res
    );
  });
};
