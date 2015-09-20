'use strict';

var assert = require('assert');

var Privacy = require('../privacy.js');

module.exports = function(data) {
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

  return stream;
};
