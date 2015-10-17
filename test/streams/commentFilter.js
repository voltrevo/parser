'use strict';

/* global describe it */

var assert = require('assert');

var commentFilter = require('../../lib/streams/commentFilter.js');
var describeStream = require('../describers/Stream.js');
var LineStream = require('../../lib/streams/lineStream.js');

describe('commentFilter', function() {
  it('filters out comments', function() {
    var stream = commentFilter(
      LineStream('test', [
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

  it('hasNext when starting on a comment and there is a newline', function() {
    var stream = commentFilter(
      LineStream('test', '// foobar\n')
    );

    assert.equal(stream.hasNext(), true);
  });

  describeStream(function(data) {
    return commentFilter(LineStream('test', data));
  });
});
