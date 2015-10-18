'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer('substream(' + consumer.name + ')', function(api) {
    var consumerResult = consumer.consume(api.stream);

    if (!consumerResult.valid) {
      return api.forward(undefined, consumerResult);
    }

    return api.accept(api.stream.substream.apply(undefined, consumerResult.location));
  });
};
