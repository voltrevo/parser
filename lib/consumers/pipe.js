'use strict';

// core modules
var assert = require('assert');

// local modules
var Consumer = require('./consumer.js');
var mustConsumeAll = require('./mustConsumeAll.js');

module.exports = function(consumer, innerConsumer) {
  assert('consume' in consumer);

  return Consumer('pipe(' + consumer.name + ', ' + innerConsumer.name + ')', function(api) {
    var consumerResult = consumer.consume(api.stream);

    if (!consumerResult.valid) {
      return api.forward(undefined, consumerResult);
    }

    var innerConsumerResult = mustConsumeAll(innerConsumer).consume(consumerResult.value);

    if (!innerConsumerResult.accepted) {
      // If the innerConsumer rejects, it's still just an invalidation because this is just a
      // substream and the main consumer accepted the main stream. For example, if the content of a
      // block is rejected, the block is still accepted. The rejection of the content invalidates
      // the block, but does not reject it.
      api.invalidate('innerConsumer did not accept the substream', innerConsumerResult);
    } else if (!innerConsumerResult.valid) {
      api.invalidate('innerConsumer not valid', innerConsumerResult);
    }

    return api.accept(innerConsumerResult.value);
  });
};
