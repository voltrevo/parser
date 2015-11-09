'use strict';

var testTemplate = require('./testTemplate.js');
var codeBlock = require('../../examples/tinyCpp/cppParse/codeBlock.js');

testTemplate(codeBlock, {
  valid: [
    ['{}', []],
    ['{ }', []],
    ['{ 3; }', [
      {
        label: 'expression',
        value: {
          label: 'value',
          value: 3
        }
      }
    ]],
    ['{ x = 3; y = 4; }', [
      {
        label: 'expression',
        value: {
          label: 'expressionTree',
          value: {
            lhs: {
              label: 'variable',
              value: 'x'
            },
            operator: '=',
            rhs: {
              label: 'value',
              value: 3
            }
          }
        }
      },
      {
        label: 'expression',
        value: {
          label: 'expressionTree',
          value: {
            lhs: {
              label: 'variable',
              value: 'y'
            },
            operator: '=',
            rhs: {
              label: 'value',
              value: 4
            }
          }
        }
      }
    ]],
    ['{{}}', [
      {
        label: 'controlStructure',
        value: {
          label: 'codeBlock',
          value: []
        }
      }
    ]]
  ],
  invalid: [
    '',
    '{',
    '{{}',
    '{;}', // TODO: make this valid
    '{ 3 }',
    '{ x = 3; y = 4 }'
  ]
});
