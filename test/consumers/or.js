'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var linestream = require('../../lib/streams/linestream.js');
var or = require('../../lib/consumers/or.js');
var single = require('../../lib/consumers/single.js');

describe('or', function() {
  it('or(a, b) accepts a and b and rejects c in abc', function() {
    var stream = linestream('test', 'abc');
    var parser = or(single('a'), single('b'));

    var results = [stream, stream, stream].map(parser);

    assert.deepEqual(
      results.map(function(result) {
        return [result.accepted, result.valid];
      }),
      [
        [true, true],  // a accepted and valid
        [true, true],  // b accepted and valid
        [false, false] // c not accepted nor valid
      ]
    );

    assert.equal(results[0].value.value, 'a');
    assert.equal(results[1].value.value, 'b');
  });

  // TODO: Invalidity propagates
});
