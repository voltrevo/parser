'use strict';

var Consumer = require('./consumer.js');

module.exports = Consumer('any', function(api) {
  if (!api.stream.hasNext()) {
    return api.reject('Couldn\'t get next stream item.');
  }

  return api.accept(api.stream.next());
});
