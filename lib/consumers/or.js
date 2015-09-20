'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(stream, acceptValid, acceptInvalid, reject) {
    var rejectValues = [];

    for (var i = 0; i !== args.length; i++) {
      var candidate = args[i](stream);

      if (candidate.type === 'acceptValid') {
        return acceptValid(candidate.value);
      } else if (candidate.type === 'acceptInvalid') {
        return acceptInvalid(candidate.value);
      }

      rejectValues.push(candidate.value);
    }

    return reject(rejectValues);
  });
};
