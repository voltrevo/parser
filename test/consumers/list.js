'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var list = require('../../lib/consumers/list.js');
var LineStream = require('../../lib/streams/lineStream.js');
var single = require('../../lib/consumers/single.js');

describe('list', function() {
  it('accepts z,z,z', function() {
    var stream = LineStream('test', 'z,z,z');

    var consumer = list(single('z'), single(','));

    var parseResult = consumer(stream);

    assert.equal(parseResult.accepted, true);
    assert.equal(parseResult.valid, true);
    assert.deepEqual(parseResult.value, ['z', 'z', 'z']);
  });
});
