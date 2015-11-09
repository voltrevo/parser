'use strict';

// community modules
var expect = require('chai').expect;

// local modules
var parser = require('../../lib/index.js').flat;
var Stream = require('../../lib/streams/stream.js');

module.exports = function(consumerParam, opts) {
  var consumer = parser.mustConsumeAll(consumerParam);

  describe(consumer.name, function() {
    if (opts.valid) {
      describe('succeeds for valid inputs', function() {
        opts.valid.map(function(inputOutput) {
          return {
            input: inputOutput[0],
            expectedOutput: {
              exists: inputOutput.length >= 2,
              value: inputOutput[1]
            },
            actualOutput: consumer.consume(Stream(inputOutput[0]))
          };
        }).forEach(function(testCase) {
          it(JSON.stringify(testCase.input), function() {
            expect(testCase.actualOutput.accepted).to.equal(true);
            expect(testCase.actualOutput.valid).to.equal(true);

            if (testCase.expectedOutput.exists) {
              expect(testCase.actualOutput.value).to.deep.equal(testCase.expectedOutput.value);
            }
          });
        });
      });
    }

    if (opts.invalid) {
      describe('fails for invalid inputs', function() {
        opts.invalid.map(function(str) {
          return {
            input: str,
            output: consumer.consume(Stream(str))
          };
        }).forEach(function(testCase) {
          it(JSON.stringify(testCase.input), function() {
            expect(testCase.output.valid).to.equal(false);
          });
        });
      });
    }
  });
};
