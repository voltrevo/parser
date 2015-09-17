'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer(function(stream, acceptValid, acceptInvalid) {
    var values = [];
    var invalids = [];

    var result = function() {
      if (invalids.length > 0) {
        return acceptInvalid({
          values: values,
          invalids: invalids
        });
      }

      return acceptValid(values);
    };

    while (true) {
      var curr = consumer(stream);

      if (curr.type === 'reject') {
        return result();
      }

      if (curr.type === 'acceptInvalid') {
        invalids.push(values.length);
      }

      values.push(curr.value);
    }
  });
};
