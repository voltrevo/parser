'use strict';

module.exports = function(name, consumer) {
  var newConsumer = {};

  newConsumer.name = name;
  newConsumer.consume = consumer.consume;

  return newConsumer;
};
