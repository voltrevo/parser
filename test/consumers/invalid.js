'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var LineStream = require('../../lib/streams/lineStream.js');
var invalid = require('../../lib/consumers/invalid.js');
var single = require('../../lib/consumers/single.js');

describe('invalid', function() {
  it('can make the single(a) in abc invalid', function() {
    var stream = LineStream('test', 'abc');

    var consumer = invalid(single('a'));

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);
    assert.equal(parseResult.value, 'a');
  });
});
