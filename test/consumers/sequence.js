'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var linestream = require('../../lib/streams/linestream.js');
var sequence = require('../../lib/consumers/sequence.js');
var single = require('../../lib/consumers/single.js');

describe('sequence', function() {
  it('sequence(a, b, c) accepts abc', function() {
    var stream = linestream('test', 'abc');
    var consumer = sequence(
      single('a'),
      single('b'),
      single('c')
    );

    var parseResult = consumer(stream);

    assert.deepEqual(
      parseResult.value,
      ['a', 'b', 'c']
    );
  });

  // TODO: Invalidity propagates
});
