'use strict';

/* global describe it */

// core modules
var assert = require('assert');

// local modules
var describeStream = require('./describers/Stream.js');
var parser = require('../lib').tree;

describe('parser', function() {
  describe('.streams', function() {
    describe('.Stream', function() {
      describeStream(parser.streams.Stream);
    });

    describe('.LineStream', function() {
      describeStream(function(data) {
        return parser.streams.LineStream('test', data);
      });
    });
  });
});
