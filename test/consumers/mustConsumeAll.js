'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var digit = require('../../lib/consumers/digit.js');
var many = require('../../lib/consumers/many.js');
var mustConsumeAll = require('../../lib/consumers/mustConsumeAll.js');
var Stream = require('../../lib/streams/stream.js');

describe('mustConsumeAll', function() {
  it('works as normal when wrapped consumer consumes the whole stream', function() {
    var stream = Stream('12345');

    var consumer = mustConsumeAll(
      many(digit)
    );

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, '12345'.split(''));
  });

  it('invalidates when the whole stream is not consumed', function() {
    var stream = Stream('12345abcdef');

    var consumer = mustConsumeAll(
      many(digit)
    );

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, false);

    assert.equal(parseResult.invalidations.length, 1);

    assert.deepEqual(
      parseResult.invalidations[0].reason,
      'Wrapped consumer didn\'t consume all of the stream.'
    );
  });
});
