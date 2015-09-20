'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(stream, acceptValid, acceptInvalid, reject) {
    var results = [];
    var invalids = [];
    var returnType = acceptValid;

    for (var i = 0; i !== args.length; i++) {
      var currResult = args[i](stream);
      results.push(currResult);

      if (currResult.type === 'acceptInvalid') {
        invalids.push(i);
        returnType = acceptInvalid;
      } else if (currResult.type === 'reject') {
        return reject(results);
      }
    }

    return returnType(results);
  });
};
