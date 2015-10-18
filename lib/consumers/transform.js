'use strict';

// core modules
var assert = require('assert');

// local modules
var Consumer = require('./consumer.js');

module.exports = function(consumer, transform) {
  assert('consume' in consumer);

  return Consumer('transform(' + consumer.name + ')', function(api) {
    var res = consumer.consume(api.stream);

    if (!res.accepted) {
      return api.reject('Wrapped consumer rejected', res, undefined);
    }

    if (!res.valid) {
      api.invalidate('Wrapped consumer invalid', res);
    }

    return api.accept(transform(res.value));
  });
};
