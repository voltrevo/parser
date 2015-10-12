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
      },
      forward: function(value_, ref) {
        if (!ref.valid) {
          api.invalidate('Wrapped consumer invalid.', ref);
        }

        if (!ref.accepted) {
          return api.reject('Wrapped consumer rejected.', ref, value_);
        }

        return api.accept(value_);
      }
    };

    var shouldBeToken = impl(api);
    assert(shouldBeToken === token);

    var valid = (invalidations.length === 0);

    if (!accepted) {
      stream.restore(startMark);
    }

    var endMark = stream.mark();

    return {
      value: value,
      accepted: accepted,
      valid: valid,
      invalidations: invalidations,
      location: [startMark, endMark]
    };
  };
};
