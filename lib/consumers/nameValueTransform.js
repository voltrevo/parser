'use strict';

module.exports = function(consumer) {
  return function(stream) {
    var parseResult = consumer(stream);

    parseResult.value = {
      name: parseResult.name,
      value: parseResult.value
    };

    return parseResult;
  };
};
