'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer('many(' + consumer.name + ')', function(api) {
    var results = [];

    var i = 0;

    while (true) {
      var curr = consumer.consume(api.stream);

      if (!curr.accepted) {
        return api.accept(results);
      }

      if (!curr.valid) {
        api.invalidate('Element ' + i + ' is invalid.', curr);
      }

      results.push(curr.value);
      i++;
    }
  });
};
