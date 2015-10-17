'use strict';

/* global describe it */

var fs = require('fs');

var expect = require('chai').expect;
var LineStream = require('../../../lib/streams/lineStream.js');
var json = require('../json.js'); // TODO: can this be 'parser/json'?
var parser = require('../../../lib/index.js');

var parse = function(str) {
  return parser.mustConsumeAll(json)(LineStream('test', str));
};

describe('jsonValue', function() {
  it('parses numbers correctly', function() {
    var testCases = [
      ['1', 1],
      ['123', 123],
      ['1.1', 1.1],
      ['.1', 0.1],
      ['1e3', 1000],
      ['-3.74e-1', -0.374],
      ['-61.794783', -61.794783]
    ].map(function(pair) {
      return {
        input: pair[0],
        output: pair[1]
      };
    });

    testCases.forEach(function(testCase) {
      var ret = parse(testCase.input);

      expect(ret.success).to.equal(true);
      expect(ret.value).to.equal(testCase.output);
    });
  });

  it('parses strings correctly', function() {
    var testCases = [
      ['""', ''],
      ['"abc"', 'abc'],
      ['"abc 123"', 'abc 123'],
      ['" abc 123 "', ' abc 123 '],
      ['"\\""', '\"'], [
        ['"', '\\', '\\', '\\', '\\', '"'].join(''),
        ['\\', '\\'].join('')
      ], ['"\\n"', '\n'],
      ['"\\t"', '\t'],
      ['"\\r"', '\r']
    ].map(function(pair) {
      return {
        input: pair[0],
        output: pair[1]
      };
    });

    testCases.forEach(function(testCase) {
      var ret = parse(testCase.input);

      expect(ret.success).to.equal(true);
      expect(ret.value).to.equal(testCase.output);
    });
  });

  it('parses true/false/null', function() {
    var testCases = [
      ['true', true],
      ['false', false],
      ['null', null]
    ].map(function(pair) {
      return {
        input: pair[0],
        output: pair[1]
      };
    });

    testCases.forEach(function(testCase) {
      var ret = parse(testCase.input);

      expect(ret.success).to.equal(true);
      expect(ret.value).to.equal(testCase.output);
    });
  });

  it('parses arrays', function() {
    var testCases = [
      ['[]', []],
      ['[ ]', []],
      ['[1]', [1]],
      ['[ 1]', [1]],
      ['[1 ]', [1]],
      ['[ 1 ]', [1]],
      ['[1,2]', [1, 2]],
      ['[1 ,2]', [1, 2]],
      ['[1, 2]', [1, 2]],
      ['[[]]', [[]]],
      ['[[], 1]', [[], 1]],
      ['[[], \'\', 1.1, true, null]', [[], '', 1.1, true, null]],
      ['[[[[[]]]]]', [[[[[]]]]]]
    ].map(function(pair) {
      return {
        input: pair[0],
        output: pair[1]
      };
    });

    testCases.forEach(function(testCase) {
      var ret = parse(testCase.input);

      expect(ret.success).to.equal(true);
      expect(ret.value).to.deep.equal(testCase.output);
    });
  });

  it('parses objects', function() {
    var testCases = [
      ['{}', {}],
      ['{ }', {}],
      ['{"a": true}', { a: true }],
      ['{"a": {}}', { a: {} }], [
        '{"string": "", "number": 1.1, "bool": true, "null": null, "array": [], "object": {}}',
        { string: '', number: 1.1, bool: true, null: null, array: [], object: {} }
      ]
    ].map(function(pair) {
      return {
        input: pair[0],
        output: pair[1]
      };
    });

    testCases.forEach(function(testCase) {
      var ret = parse(testCase.input);

      expect(ret.success).to.equal(true);
      expect(ret.value).to.deep.equal(testCase.output);
    });
  });

  it('parses big.json', function(done) {
    fs.readFile('json/test/big.json', function(err, data) {
      if (err) {
        done(err);
        return;
      }

      var bigJsonString = '' + data;
      var parseResult = parse(bigJsonString);

      expect(parseResult.success).to.equal(true);
      expect(parseResult.value).to.deep.equal(JSON.parse(bigJsonString));

      done();
    });
  });
});
