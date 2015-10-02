'use strict';

var Consumer = require('./consumer.js');

module.exports = function(constraint) {
  return Consumer(function(api) {
    if (!api.stream.hasNext()) {
      return api.reject('Couldn\'t get next stream item.');
    }

    var streamDatum = api.stream.next();

    if (constraint(streamDatum)) {
      return api.accept(streamDatum);
    }

    return api.reject(streamDatum);
  });
};
