'use strict';

var testTemplate = require('./testTemplate.js');
var function_ = require('../../examples/tinyCpp/cppParse/function.js');

testTemplate(function_, {
  valid: [
    ['int foo() {}'],
    ['int foo() { }'],
    ['int sum(int x, int y) { return x + y; }', {
      heading: {
        returnType: 'int',
        name: 'sum',
        arguments: [
          {
            type: 'int',
            name: 'x'
          },
          {
            type: 'int',
            name: 'y'
          }
        ]
      },
      body: [
        {
          label: 'return',
          value: {
            label: 'expressionTree',
            value: {
              lhs: {
                label: 'variable',
                value: 'x'
              },
              operator: '+',
              rhs: {
                label: 'variable',
                value: 'y'
              }
            }
          }
        }
      ]
    }]
  ],
  invalid: [
    '',
    'intfoo(){}',
    'int foo() { int bar() {} }', // TODO: make this valid
    'int foo(int) {}', // TODO: make this valid
    'int(int){}',
    'int foo() { { x } }'
  ]
});
