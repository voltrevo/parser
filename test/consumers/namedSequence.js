'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var LineStream = require('../../lib/streams/LineStream.js');
var name = require('../../lib/consumers/name.js');
var namedSequence = require('../../lib/consumers/namedSequence.js');
var single = require('../../lib/consumers/single.js');

describe('namedSequence', function() {
  it('no named elements produces an empty object', function() {
    var stream = LineStream('test', 'abc');

    var consumer = namedSequence(
      single('a'),
      single('b'),
      single('c')
    );

    var parseResult = consumer(stream);

    assert.deepEqual(parseResult.value, {});
  });

  it('named elements show up as fields in the result', function() {
    var stream = LineStream('test', 'abc');

    var consumer = namedSequence(
      name('first', single('a')),
      single('b'),
      name('last', single('c'))
    );

    var parseResult = consumer(stream);

    assert.deepEqual(
      parseResult.value,
      { first: 'a', last: 'c' }
    );
  });
});
