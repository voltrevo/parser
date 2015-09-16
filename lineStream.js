'use strict';

var Stream = require('./stream.js');

module.exports = function(name, data) {
  var lineStream = {};

  var stream = Stream(data);

  var pos = {
    line: 0,
    char: 0
  };

  var privateTags = { in: {}, out: {} };

  lineStream.hasNext = function() {
    return stream.hasNext();
  };

  lineStream.next = function() {
    var char = stream.next();

    if (char === '\n') {
      pos.line++;
      pos.char = 0;
    } else {
      pos.char++;
    }

    return char;
  };

  lineStream.mark = function() {
    var markPos = {
      line: pos.line,
      char: pos.char
    };

    return {
      _unwrap: function(tag) {
        assert(tag === privateTags.in);

        return {
          pos: markPos,
          streamMark: stream.mark(),
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

  lineStream.restore = function(wrappedMark) {
    var mark = unwrapMark(wrappedMark);

    stream.restore(pos.streamMark);
    pos.line = mark.pos.line;
    pos.char = mark.pos.char;
  };

  lineStream.describeMark = function(wrappedMark) {
    var mark = unwrapMark(wrappedMark);
    return [name, mark.pos.line, mark.pos.char].join(':');
  };

  lineStream.describeMarkRange = function(wrappedStartMark, wrappedEndMark) {
    var startMark = unwrapMark(wrappedStartMark);
    var endMark = unwrapMark(wrappedEndMark);

    var rng = function(x) {
      assert(x.length === 2);
      return (x[0] === x[1] ? x[0] : x[0] + '-' + x[1]);
    };

    return [
      [name, name],
      [startMark.pos.line, endMark.pos.line],
      [startMark.pos.char, endMark.pos.char]
    ].map(rng).join(':');
  };

  return lineStream;
};
