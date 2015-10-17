'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(api) {
    var res = consumer(api.stream);

    if (api.stream.hasNext()) {
      api.invalidate('Wrapped consumer didn\'t consume all of the stream.', res);
    }

    return api.forward(res.value, res);
  });
};
