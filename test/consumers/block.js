'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var any = require('../../lib/consumers/any.js');
var block = require('../../lib/consumers/block.js');
var LineStream = require('../../lib/streams/lineStream.js');
var many = require('../../lib/consumers/many.js');
var single = require('../../lib/consumers/single.js');
var string = require('../../lib/consumers/string.js');

var getStreamContent = function(stream) {
  return many(any).consume(stream).value;
};

describe('block', function() {
  it('accepts an empty block', function() {
    var stream = LineStream('test', '{}');

    var consumer = block(single('{'), single('}'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(getStreamContent(parseResult.value), []);
  });

  it('accepts arbitrary internal data', function() {
    var stream = LineStream('test', '{jkl; we20nv23 hello!}');

    var consumer = block(single('{'), single('}'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(getStreamContent(parseResult.value), 'jkl; we20nv23 hello!'.split(''));
  });

  it('accepts nested blocks', function() {
    var stream = LineStream('test', '{{{{{}}{}{}}}}');

    var consumer = block(single('{'), single('}'));

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(getStreamContent(parseResult.value), '{{{{}}{}{}}}'.split(''));
  });

  it('can skip over the skipper instead of seeing an end of a block', function() {
    var stream = LineStream('test', '{foo "}" bar}');

    var consumer = block(
      single('{'),
      string('"}"'),
      single('}')
    );

    var parseResult = consumer.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(getStreamContent(parseResult.value), 'foo "}" bar'.split(''));
  });
});
