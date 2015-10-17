'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var invalid = require('../../lib/consumers/invalid.js');
var oneOrMore = require('../../lib/consumers/oneOrMore.js');
var or = require('../../lib/consumers/or.js');
var LineStream = require('../../lib/streams/lineStream.js');
var single = require('../../lib/consumers/single.js');

describe('oneOrMore', function() {
  it('rejects an empty input', function() {
    var stream = LineStream('test', '');

    var consumer = oneOrMore(single('z'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, false);
    assert.equal(parseResult.valid, false);
  });

  it('accepts a single match', function() {
    var stream = LineStream('test', 'z');

    var consumer = oneOrMore(single('z'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, ['z']);
  });

  it('is invalidated by elements', function() {
    var stream = LineStream('test', 'vvviviivviv');

    var consumer = oneOrMore(or(
      single('v'),
      invalid(single('i'))
    ));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);
    assert.deepEqual(parseResult.value, 'vvviviivviv'.split(''));

    // Within that tail, there are two delimiters that are invalid.
    assert.deepEqual(
      parseResult.invalidations[0].ref.invalidations.map(function(invalidation) {
        return invalidation.reason;
      }),
      [
        'Element 3 is invalid.',
        'Element 5 is invalid.',
        'Element 6 is invalid.',
        'Element 9 is invalid.'
      ]
    );
  });
});
