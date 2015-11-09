'use strict';

var testTemplate = require('./testTemplate.js');

var globalVariableDeclaration = require(
  '../../examples/tinyCpp/cppParse/globalVariableDeclaration.js'
);

testTemplate(globalVariableDeclaration, {
  valid: [
    ['int x = 0;', {
      type: 'int',
      name: 'x',
      value: 0
    }],
    ['int x=0;', {
      type: 'int',
      name: 'x',
      value: 0
    }],
    ['int foo = -123;', {
      type: 'int',
      name: 'foo',
      value: -123
    }]
  ],
  invalid: [
    '',
    'int x;',
    'int',
    ' int x = 0;',
    'intx=0;',
    'int foo = bar;',
    'int x = 0'
  ]
});
