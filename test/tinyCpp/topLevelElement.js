'use strict';

var testTemplate = require('./testTemplate.js');
var topLevelElement = require('../../examples/tinyCpp/cppParse/topLevelElement.js');

testTemplate(topLevelElement, {
  valid: [
    ['int foo() {}'],
    ['int foo();'],
    ['int x = 3;']
  ],
  invalid: [
    '',
    'int x = 1 + 1;', // TODO: make this valid
    'int foo()'
  ]
});
