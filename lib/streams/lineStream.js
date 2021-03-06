'use strict';

var assert = require('assert');

var Privacy = require('voltrevo-privacy');
var Stream = require('./stream.js');

var LineStreamImpl = function(name, stream, startPos) {
  var lineStream = {};

  var pos = startPos;

  var privacy = Privacy();

  lineStream.hasNext = function() {
    return stream.hasNext();
  };

  lineStream.peek = stream.peek;

  lineStream.next = function() {
    var char = stream.next();

    if (char === '\n') {
      pos.line++;
      pos.char = 1;
    } else {
      pos.char++;
    }

    return char;
  };

  lineStream.mark = function() {
    return privacy.wrap({
      streamMark: stream.mark(),
      pos: {
        line: pos.line,
        char: pos.char
      }
    });
  };

  lineStream.restore = function(wrappedMark) {
    var mark = privacy.unwrap(wrappedMark);

    stream.restore(mark.streamMark);
    pos.line = mark.pos.line;
    pos.char = mark.pos.char;
  };

  lineStream.describeMark = function(wrappedMark) {
    var mark = privacy.unwrap(wrappedMark);
    return [name, mark.pos.line, mark.pos.char].join(':');
  };

  lineStream.describeMarkRange = function(wrappedStartMark, wrappedEndMark) {
    var startMark = privacy.unwrap(wrappedStartMark);
    var endMark = privacy.unwrap(wrappedEndMark);

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

  lineStream.substream = function(wrappedStartMark, wrappedEndMark) {
    var startMark = privacy.unwrap(wrappedStartMark);
    var endMark = privacy.unwrap(wrappedEndMark);

    return LineStreamImpl(
      name,
      stream.substream(
        startMark.streamMark,
        endMark.streamMark
      ),
      startMark.pos
    );
  };

  return lineStream;
};

module.exports = function(name, data) {
  return LineStreamImpl(
    name,
    Stream(data),
    {line: 1, char: 1}
  );
};
