'use strict';

/* global describe it */

var assert = require('assert');
var parser = require('../lib').tree;

describe('parser', function() {
  describe('.streams', function() {
    describe('.stream', function() {
      var Stream = parser.streams.stream;

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
    });
  });
});
