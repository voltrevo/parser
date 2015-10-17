'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var andNot = require('../../lib/consumers/andNot.js');
var block = require('../../lib/consumers/block.js');
var LineStream = require('../../lib/streams/lineStream.js');
var single = require('../../lib/consumers/single.js');

describe('block', function() {
  it('accepts an empty block', function() {
    var stream = LineStream('test', '{}');

    var consumer = block(single('{'), single('}'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, []);
  });

  it('accepts nested blocks', function() {
    var stream = LineStream('test', '{{{{{}}{}{}}}}');

    var consumer = block(single('{'), single('}'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, '{{{{}}{}{}}}'.split(''));
  });
});
