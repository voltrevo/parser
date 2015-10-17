'use strict';

/* global describe it */

var assert = require('assert');

var LineStream = require('../../lib/streams/lineStream.js');
var single = require('../../lib/consumers/single.js');

describe('single(a) on \'abc\'', function() {
  it('accepts a with value a', function() {
    var stream = LineStream('test', 'abc');
    var a = single('a');

    var parseResult = a.consume(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.equal(parseResult.value, 'a');
  });

  it('does not accept b', function() {
    var stream = LineStream('test', 'abc');
    var b = single('b');

    var parseResult = b.consume(stream);

    assert.equal(parseResult.accepted, false);
    assert.equal(parseResult.valid, false);
  });
});
