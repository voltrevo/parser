'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, transform) {
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
