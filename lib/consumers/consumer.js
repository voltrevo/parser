'use strict';

var Privacy = require('voltrevo-privacy');

module.exports = function(impl) {
  return function(stream) {
    var startMark = stream.mark();

    var privacy = Privacy();

    var generator = function(type) {
      return function(value) {
        return privacy.wrap({
          type: type,
          value: value
        });
      };
    };

    var result = privacy.unwrap(impl({
      stream: stream,
      acceptValid: generator('acceptValid'),
      acceptInvalid: generator('acceptInvalid'),
      reject: generator('reject')
    }));

    if (result.type === 'reject') {
      stream.restore(startMark);
    }

    var endMark = stream.mark();

    result.location = [startMark, endMark];

    return result;
  };
};
