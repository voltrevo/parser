'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var invalid = require('../../lib/consumers/invalid.js');
var list = require('../../lib/consumers/list.js');
var LineStream = require('../../lib/streams/lineStream.js');
var single = require('../../lib/consumers/single.js');

describe('list', function() {
  it('accepts an empty input', function() {
    var stream = LineStream('test', '');

    var consumer = list(single('z'), single(','));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, []);
  });

  it('accepts z,z,z', function() {
    var stream = LineStream('test', 'z,z,z');

    var consumer = list(single('z'), single(','));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, ['z', 'z', 'z']);
  });

  it('is invalidated by delimiters', function() {
    var stream = LineStream('test', 'z,z,z');

    var consumer = list(
      single('z'),
      invalid(single(','))
    );

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);
    assert.deepEqual(parseResult.value, ['z', 'z', 'z']);

    // The tail is invalid.
    assert.deepEqual(
      parseResult.invalidations.map(function(invalidation) {
        return invalidation.reason;
      }),
      ['Wrapped consumer invalid.']
    );

    // Within that tail, there are two delimiters that are invalid.
    assert.deepEqual(
      (
        parseResult.
        invalidations[0].ref.
        invalidations[0].ref.
        invalidations[0].ref.
        invalidations.
        map(function(invalidation) {
          return invalidation.reason;
        })
      ),
      [
        'Element 0 is invalid.',
        'Element 1 is invalid.'
      ]
    );
  });
});
