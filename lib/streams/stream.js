'use strict';

var assert = require('assert');

var Privacy = require('voltrevo-privacy');

var Stream = function(data) {
  var stream = {};

  var pos = 0;
  var privacy = Privacy();

  stream.hasNext = function() {
    return pos < data.length;
  };

  stream.peek = function() {
    assert(stream.hasNext());
    return data[pos];
  };

  stream.next = function() {
    assert(stream.hasNext());
    return data[pos++];
  };

  stream.mark = function() {
    return privacy.wrap(pos);
  };

  stream.restore = function(mark) {
    pos = privacy.unwrap(mark);
  };

  stream.describeMark = function(mark) {
    privacy.unwrap(mark);
    return undefined;
  };

  stream.describeMarkRange = function(startMark, endMark) {
    privacy.unwrap(startMark);
    privacy.unwrap(endMark);
    return undefined;
  };

  stream.substream = function(startMark, endMark) {
    var startPos = privacy.unwrap(startMark);
    var endPos = privacy.unwrap(endMark);

    assert(endPos >= startPos);

    return Stream(data.slice(startPos, endPos));
  };

  return stream;
};

module.exports = Stream;
