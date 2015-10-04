'use strict';

/* global describe it */

var assert = require('assert');

var LineStream = require('../../lib/streams/LineStream.js');
var single = require('../../lib/consumers/single.js');

describe('single', function() {
  it('matches a', function() {
    var stream = LineStream('test', 'abc');
    var a = single('a');

    assert.equal(a(stream).value, 'a');
  });
});
