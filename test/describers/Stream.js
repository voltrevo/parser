'use strict';

/* global describe it */

// core modules
var assert = require('assert');

module.exports = function(Stream) {
  describe('is a Stream', function() {
    it('starts without next when empty', function() {
      var stream = Stream('');
      assert.equal(stream.hasNext(), false);
    });

    it('contains values it was constructed with', function() {
      var stream = Stream('abc');

      assert.equal(stream.next(), 'a');
      assert.equal(stream.next(), 'b');
      assert.equal(stream.next(), 'c');
    });

    it('peek doesn\'t move the stream forward', function() {
      var stream = Stream('abc');

      assert.equal(stream.peek(), 'a');
      assert.equal(stream.peek(), 'a');
      assert.equal(stream.next(), 'a');
    });

    it('can mark and restore', function() {
      var stream = Stream('abc');

      assert.equal(stream.next(), 'a');

      var mark = stream.mark();

      assert.equal(stream.next(), 'b');
      assert.equal(stream.next(), 'c');

      stream.restore(mark);

      assert.equal(stream.next(), 'b');
      assert.equal(stream.next(), 'c');
    });

    it('has a describeMark which doesn\'t throw when called with a mark', function() {
      var stream = Stream('abc');
      stream.describeMark(stream.mark());
    });

    it('has a describeMarkRange which doesn\'t throw when called with marks', function() {
      var stream = Stream('abc');
      stream.describeMarkRange(stream.mark(), stream.mark());
    });

    it('can create a substream', function() {
      var stream = Stream('abc');

      stream.next();
      var start = stream.mark(); // b
      stream.next();
      var end = stream.mark(); // c

      var substream = stream.substream(start, end); // just b

      assert.equal(stream.next(), 'c');
      assert.equal(stream.hasNext(), false);

      assert.equal(substream.next(), 'b');
      assert.equal(substream.hasNext(), false);
    });
  });
};
