'use strict';

var assert = require('assert');

var Privacy = require('voltrevo-privacy');
var Stream = require('./stream.js');

module.exports = function(name, data) {
  var lineStream = {};

  var stream = Stream(data);

  var pos = {
    line: 0,
    char: 0
  };

  var privacy = Privacy();

  lineStream.hasNext = function() {
    return stream.hasNext();
  };

  lineStream.peek = stream.peek;

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

  return lineStream;
};
