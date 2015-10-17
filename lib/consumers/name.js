'use strict';

module.exports = function(name, consumer) {
  return function(stream) {
    var parseResult = consumer(stream);
    parseResult.name = name;

    return parseResult;
  };
};
