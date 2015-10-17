'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var andNot = require('../../lib/consumers/andNot.js');
var any = require('../../lib/consumers/any.js');
var many = require('../../lib/consumers/many.js');
var LineStream = require('../../lib/streams/lineStream.js');
var sequence = require('../../lib/consumers/sequence.js');
var single = require('../../lib/consumers/single.js');

describe('andNot', function() {
  it('accepts the first consumer but not the second at the same location', function() {
    var stream = LineStream('test', 'abc123;');

    var consumer = sequence(
      many(andNot(any, single(';'))),
      single(';')
    );

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, ['abc123'.split(''), ';']);
  });

  it('rejects when the first consumer rejects', function() {
    var stream = LineStream('test', 'a;');
    var consumer = andNot(single('b'), single('x'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, false);
  });
});
