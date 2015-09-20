'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(stream, acceptValid, acceptInvalid) {
    var results = [];
    var returnType = acceptValid;

    while (true) {
      var curr = consumer(stream);

      if (curr.type === 'reject') {
        return returnType(results);
      }

      if (curr.type === 'acceptInvalid') {
        returnType = acceptInvalid;
      }

      results.push(curr);
    }
  });
};
