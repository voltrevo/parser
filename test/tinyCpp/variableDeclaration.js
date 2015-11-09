'use strict';

var testTemplate = require('./testTemplate.js');
var variableDeclaration = require('../../examples/tinyCpp/cppParse/variableDeclaration.js');

testTemplate(variableDeclaration, {
  valid: [
    ['int x = 3;', {
      type: 'int',
      name: 'x',
      expression: {
        label: 'value',
        value: 3
      }
    }],
    ['int x = 1 + 1;', {
      type: 'int',
      name: 'x',
      expression: {
        label: 'expressionTree',
        value: {
          lhs: {
            label: 'value',
            value: 1
          },
          operator: '+',
          rhs: {
            label: 'value',
            value: 1
          }
        }
      }
    }]
  ],
  invalid: [
    'int x = 3',
    'x = 3;',
    '3;'
  ]
});
