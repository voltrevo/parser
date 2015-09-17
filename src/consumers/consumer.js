'use strict';

var Privacy = require('../privacy.js');

module.exports = function(impl) {
  return function(stream) {
    var mark = stream.mark();

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
      stream.restore(mark);
    }

    return result;
  };
};
