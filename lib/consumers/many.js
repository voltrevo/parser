'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(api) {
    var results = [];
    var returnType = api.acceptValid;

    while (true) {
      var curr = consumer(api.stream);

      if (curr.type === 'reject') {
        return returnType(results);
      }

      if (curr.type === 'acceptInvalid') {
        returnType = api.acceptInvalid;
      }

      results.push(curr);
    }
  });
};
