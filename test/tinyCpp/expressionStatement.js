'use strict';

var testTemplate = require('./testTemplate.js');
var expressionStatement = require('../../examples/tinyCpp/cppParse/expressionStatement.js');

testTemplate(expressionStatement, {
  valid: [
    ['1 + 1;', {
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
    }]
  ],
  invalid: [
    '1 + 1'
  ]
});
