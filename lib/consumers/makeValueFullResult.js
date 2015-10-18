'use strict';

// TODO: It would probably be more useful to have fullTransform which would be like transform but
// provide the full result and the stream instead of just result.value.

// local modules
var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer('makeValueFullResult(' + consumer.name + ')', function(api) {
    var consumerResult = consumer.consume(api.stream);
    return api.forward(consumerResult, consumerResult);
  });
};
