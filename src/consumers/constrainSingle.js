'use strict';

var Consumer = require('./consumer.js');

module.exports = function(constraint) {
  return Consumer(function(stream, acceptValid, acceptInvalid, reject) {
    if (!stream.hasNext()) {
      return reject();
    }

    var streamDatum = stream.next();

    if (constraint(streamDatum)) {
      return acceptValid(streamDatum);
    }

    return reject(streamDatum);
  });
};
