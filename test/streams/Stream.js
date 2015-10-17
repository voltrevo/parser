'use strict';

/* global describe */

var Stream = require('../../lib/streams/stream.js');
var describeStream = require('../describers/Stream.js');

describe('Stream', function() {
  describeStream(Stream);
});
