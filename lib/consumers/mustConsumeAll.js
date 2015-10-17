'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer('mustConsumeAll(' + consumer.name + ')', function(api) {
    var res = consumer.consume(api.stream);

    if (api.stream.hasNext()) {
      api.invalidate('Wrapped consumer didn\'t consume all of the stream', res);
    }

    return api.forward(res.value, res);
  });
};
