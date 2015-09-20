'use strict';

var Consumer = require('./consumer.js');

module.exports = function(constraint) {
  return Consumer(function(api) {
    if (!api.stream.hasNext()) {
      return api.reject();
    }

    var streamDatum = api.stream.next();

    if (constraint(streamDatum)) {
      return api.acceptValid(streamDatum);
    }

    return api.reject(streamDatum);
  });
};
