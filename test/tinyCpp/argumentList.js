'use strict';

var testTemplate = require('./testTemplate.js');
var argumentList = require('../../examples/tinyCpp/cppParse/argumentList.js');

testTemplate(argumentList, {
  valid: [
    ['', []],
    ['int x', [
      {type: 'int', name: 'x'}
    ]],
    ['int x, int y', [
      {type: 'int', name: 'x'},
      {type: 'int', name: 'y'}
    ]],
    ['int x , int y', [
      {type: 'int', name: 'x'},
      {type: 'int', name: 'y'}
    ]],
    ['int x ,int y', [
      {type: 'int', name: 'x'},
      {type: 'int', name: 'y'}
    ]],
    ['int x, int y, int z', [
      {type: 'int', name: 'x'},
      {type: 'int', name: 'y'},
      {type: 'int', name: 'z'}
    ]]
  ],
  invalid: [
    ' ',
    ' int x',
    'void x',
    'x',
    'int x,,int y',
    'int x,'
  ]
});
