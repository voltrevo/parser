'use strict';

var Consumer = require('./consumer.js');

module.exports = function(/* args... */) {
  var args = Array.prototype.slice.apply(arguments);

  return Consumer(function(api) {
    var results = [];
    var invalids = [];
    var returnType = api.acceptValid;

    for (var i = 0; i !== args.length; i++) {
      var currResult = args[i](api.stream);
      results.push(currResult);

      if (currResult.type === 'acceptInvalid') {
        invalids.push(i);
        returnType = api.acceptInvalid;
      } else if (currResult.type === 'reject') {
        return api.reject(results);
      }
    }

    return returnType(results);
  });
};
