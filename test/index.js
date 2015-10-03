'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var describeStream = require('./describers/Stream.js');
var parser = require('../lib').tree;

describe('parser', function() {
  describe('.streams', function() {
    describe('.Stream', function() {
      describeStream(parser.streams.Stream);
    });

    describe('.LineStream', function() {
      var LineStream = parser.streams.LineStream;

      it('can describe marks and mark ranges', function() {
        var ls = LineStream('test', 'one\ntwo\nthree\n');

        var begin = ls.mark();

        ls.next();
        ls.next();
        ls.next();
        ls.next();

        var secondLine = ls.mark();

        ls.next();
        ls.next();

        var midSecondLine = ls.mark();

        ls.next();
        ls.next();

        var thirdLine = ls.mark();

        ls.next();
        ls.next();
        ls.next();
        ls.next();
        ls.next();

        var last = ls.mark();

        ls.next();

        var end = ls.mark();

        assert.equal(ls.hasNext(), false);

        assert.deepEqual(
          [begin, secondLine, midSecondLine, thirdLine, last, end].map(ls.describeMark),
          ['test:1:1', 'test:2:1', 'test:2:3', 'test:3:1', 'test:3:6', 'test:4:1']
        );
      });

      describeStream(function(data) {
        return parser.streams.LineStream('test', data);
      });
    });

    describe('.commentFilter', function() {
      it('filters out comments', function() {
        var stream = parser.streams.commentFilter(
          parser.streams.LineStream('test', [
            '// this should be ignored',
            'a// more ignored // stuff',
            'b'
          ].join('\n'))
        );

        assert.equal(stream.next(), '\n');
        assert.equal(stream.next(), 'a');
        assert.equal(stream.next(), '\n');
        assert.equal(stream.next(), 'b');
      });

      describeStream(function(data) {
        return parser.streams.commentFilter(
          parser.streams.LineStream('test', data)
        );
      });
    });
  });
});
