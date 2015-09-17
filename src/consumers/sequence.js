'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(stream, acceptValid, acceptInvalid, reject) {
    var values = [];
    var invalids = [];
    var validSoFar = true;

    for (var i = 0; i !== args.length; i++) {
      var currResult = args[i](stream);
      values.push(currResult.value);

      if (currResult.type === 'acceptInvalid') {
        invalids.push(i);
        validSoFar = false;
      } else if (currResult.type === 'reject') {
        return reject(values);
      }
    }

    if (!validSoFar) {
      return acceptInvalid({
        values: values,
        invalids: invalids
      });
    }

    return acceptValid(values);
  });
};
