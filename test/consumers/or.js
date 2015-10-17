'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var invalid = require('../../lib/consumers/invalid.js');
var LineStream = require('../../lib/streams/lineStream.js');
var or = require('../../lib/consumers/or.js');
var single = require('../../lib/consumers/single.js');

describe('or', function() {
  it('or(a, b) accepts a and b and rejects c in abc', function() {
    var stream = LineStream('test', 'abc');
    var consumer = or(single('a'), single('b'));

    var results = [stream, stream, stream].map(consumer);

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

    assert.equal(results[0].value, 'a');
    assert.equal(results[1].value, 'b');
  });

  it('or(invalid(a)) is invalid for a', function() {
    var stream = LineStream('test', 'a');
    var consumer = or(invalid(single('a')));

    var parseResult = consumer(stream);

    assert.deepEqual(parseResult.valid, false);
  });

  it('or(a, invalid(b), c, invalid(d)) is invalid when consuming b and d', function() {
    var stream = LineStream('test', 'abcd');

    var consumer = or(
      single('a'),
      invalid(single('b')),
      single('c'),
      invalid(single('d'))
    );

    var results = [stream, stream, stream, stream].map(consumer);

    assert.deepEqual(
      results.map(function(result) {
        return [result.accepted, result.valid, result.value];
      }),
      [
        [true, true, 'a'],
        [true, false, 'b'],
        [true, true, 'c'],
        [true, false, 'd']
      ]
    );
  });

  it('or(a, b, c) rejects d and reports invalidations for a, b, and c', function() {
    var stream = LineStream('test', 'd');

    var consumer = or(
      single('a'),
      single('b'),
      single('c')
    );

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, false);
    assert.equal(parseResult.valid, false);

    assert.deepEqual(
      parseResult.invalidations.map(function(invalidation) {
        return invalidation.reason;
      }),
      [
        'Candidate rejected.',
        'Candidate rejected.',
        'Candidate rejected.',
        'All candidates rejected.'
      ]
    );
  });
});
