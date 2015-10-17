'use strict';

module.exports = function(name, consumer) {
  var newConsumer = {};

  newConsumer.name = name;

  newConsumer.consume = function(stream) {
    var res = consumer.consume(stream);
    res.name = name;

    return res;
  };

  return newConsumer;
};
