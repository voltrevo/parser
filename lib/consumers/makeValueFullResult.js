'use strict';

// local modules
var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer('makeValueFullResult(' + consumer.name + ')', function(api) {
    var consumerResult = consumer.consume(api.stream);
    return api.forward(consumerResult, consumerResult);
  });
};
