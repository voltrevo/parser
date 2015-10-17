'use strict';

/* global describe it */

var assert = require('assert');

var describeStream = require('../describers/Stream.js');
var LineStream = require('../../lib/streams/lineStream.js');

describe('LineStream', function() {
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

    assert.deepEqual(
      [[begin, secondLine], [midSecondLine, thirdLine], [last, end]].map(function(pair) {
        return ls.describeMarkRange(pair[0], pair[1]);
      }),
      ['test:1-2:1', 'test:2-3:3-1', 'test:3-4:6-1']
    );
  });

  describeStream(function(data) {
    return LineStream('test', data);
  });
});
