'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(api) {
    var results = [];

    var i = 0;

    while (true) {
      var curr = consumer(api.stream);

      if (!curr.accepted) {
        return api.accept(results);
      }

      if (!curr.valid) {
        api.invalidate('many: element ' + i + ' is invalid', curr);
      }

      results.push(curr.value);
      i++;
    }
  });
};
