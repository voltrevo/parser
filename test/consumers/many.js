'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var LineStream = require('../../lib/streams/LineStream.js');
var many = require('../../lib/consumers/many.js');
var single = require('../../lib/consumers/single.js');

describe('many', function() {
  it('accepts three a\'s in aaabbbccc', function() {
    var stream = LineStream('test', 'aaabbbccc');
    var parser = many(single('a'));

    var parseResult = parser(stream);

    assert(parseResult.accepted);
    assert(parseResult.valid);

    assert.deepEqual(
      parseResult.value.map(function(el) {
        return el.value;
      }),
      ['a', 'a', 'a']
    );
  });
});
