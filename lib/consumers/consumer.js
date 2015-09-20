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

    var result = privacy.unwrap(impl(
      stream,
      generator('acceptValid'),
      generator('acceptInvalid'),
      generator('reject')
    ));

    if (result.type === 'reject') {
      stream.restore(startMark);
    }

    var endMark = stream.mark();

    result.location = [startMark, endMark];

    return result;
  };
};
