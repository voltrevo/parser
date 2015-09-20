'use strict';

var assert = require('assert');

var once = require('../util/once.js').assert;

module.exports = function(impl) {
  return function(stream) {
    var startMark = stream.mark();

    var accepted = undefined;
    var value = undefined;
    var invalidations = [];

    var token = {};

    var done = false;
    var lock = once(function() { done = true; });

    var api = {
      stream: stream,
      accept: function(value_) {
        lock();
        value = value_;

        accepted = true;

        return token;
      },
      reject: function(reason, ref, value_) {
        api.invalidate(reason, ref);
        lock();
        value = value_;

        accepted = false;

        return token;
      },
      invalidate: function(reason, ref) {
        assert(!done);
        assert(!ref || 'location' in ref);

        invalidations.push({
          reason: reason,
          ref: ref
        });
      }
    };

    var shouldBeToken = impl(api);
    assert(shouldBeToken === token);

    var rejected = !accepted;
    var valid = invalidations.length > 0;
    var invalid = !valid;

    if (rejected) {
      stream.restore(startMark);
    }

    var endMark = stream.mark();

    return {
      value: value,
      accepted: accepted,
      rejected: rejected,
      valid: valid,
      invalid: invalid,
      invalidations: invalidations,
      location: [startMark, endMark]
    };
  };
};
