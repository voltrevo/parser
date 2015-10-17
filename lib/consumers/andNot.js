'use strict';

var Consumer = require('./Consumer.js');

module.exports = function(consumer, notConsumer) {
  return Consumer('andNot(' + consumer.name + ', ' + notConsumer.name + ')', function(api) {
    var start = api.stream.mark();

    var consumerResult = consumer.consume(api.stream);

    if (!consumerResult.accepted) {
      return api.forward(consumerResult.value, consumerResult);
    }

    var end = api.stream.mark();

    api.stream.restore(start);

    var notConsumerResult = notConsumer.consume(api.stream);

    if (notConsumerResult.accepted) {
      return api.reject('notConsumer accepted', notConsumerResult, notConsumerResult.value);
    }

    api.stream.restore(end);

    return api.forward(consumerResult.value, consumerResult);
  });
};
