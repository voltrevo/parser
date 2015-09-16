'use strict';

var assert = require('assert');

module.exports = function(data) {
  var stream = {};

  var pos = 0;
  var privateTags = { in: {}, out: {} };

  stream.hasNext = function() {
    return pos < data.length;
  };

  stream.next = function() {
    assert(stream.hasNext());
    return data[pos++];
  };

  stream.mark = function() {
    var markPos = pos;

    return {
      _unwrap: function(tag) {
        assert(tag === privateTags.in);

        return {
          pos: markPos,
          tag: privateTags.out
        };
      };
    };
  };

  var unwrapMark = function(mark) {
    var unwrapped = mark._unwrap(privateTag.in);
    assert(unwrapped.tag === privateTag.out);

    return unwrapped;
  };

  stream.restore = function(wrappedMark) {
    var mark = unwrapMark(wrappedMark);
    pos = mark.pos;
  };

  stream.describeMark = function(mark) {
    unwrapMark(mark);
    return undefined;
  };

  stream.describeMarkRange = function(wrappedStartMark, wrappedEndMark) {
    unwrapMark(wrappedStartMark);
    unwrapMark(wrappedEndMark);
    return undefined;
  }

  return stream;
};
