'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var invalid = require('../../lib/consumers/invalid.js');
var LineStream = require('../../lib/streams/lineStream.js');
var sequence = require('../../lib/consumers/sequence.js');
var single = require('../../lib/consumers/single.js');

describe('sequence', function() {
  it('sequence(a, b, c) accepts abc', function() {
    var stream = LineStream('test', 'abc');
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

  it('sequence(a, invalid(b), c, invalid(d))(abcd) is invalidated by b and d', function() {
    var stream = LineStream('test', 'abcd');

    var consumer = sequence(
      single('a'),
      invalid(single('b')),
      single('c'),
      invalid(single('d'))
    );

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);

    assert.deepEqual(parseResult.value, ['a', 'b', 'c', 'd']);

    assert.deepEqual(
      parseResult.invalidations.map(function(invalidation) {
        return [invalidation.reason, invalidation.ref.value];
      }),
      [
        ['Element invalid.', 'b'],
        ['Element invalid.', 'd']
      ]
    );
  });

  it('rejects when an element rejects', function() {
    var stream = LineStream('test', 'a');
    var consumer = sequence(single('x'));
    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, false);
  });
});
