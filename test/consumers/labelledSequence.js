'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var LineStream = require('../../lib/streams/lineStream.js');
var name = require('../../lib/consumers/name.js');
var labelledSequence = require('../../lib/consumers/labelledSequence.js');
var single = require('../../lib/consumers/single.js');

describe('labelledSequence', function() {
  it('no labelled elements produces an empty object', function() {
    var stream = LineStream('test', 'abc');

    var consumer = labelledSequence(
      single('a'),
      single('b'),
      single('c')
    );

    var parseResult = consumer.consume(stream);

    assert.deepEqual(parseResult.value, {});
  });

  it('labelled elements show up as fields in the result', function() {
    var stream = LineStream('test', 'abc');

    var consumer = labelledSequence(
      ['first', single('a')],
      single('b'),
      ['last', single('c')]
    );

    var parseResult = consumer.consume(stream);

    assert.deepEqual(
      parseResult.value,
      { first: 'a', last: 'c' }
    );
  });
});
