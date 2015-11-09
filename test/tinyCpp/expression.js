'use strict';

var testTemplate = require('./testTemplate.js');
var expression = require('../../examples/tinyCpp/cppParse/expression.js');

testTemplate(expression, {
  valid: [
    ['0', {
      label: 'value',
      value: 0
    }],
    ['x', {
      label: 'variable',
      value: 'x'
    }],
    ['1 + 1', {
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
    }],
    ['1+1', {
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
    }],
    ['1 + -1', {
      label: 'expressionTree',
      value: {
        lhs: {
          label: 'value',
          value: 1
        },
        operator: '+',
        rhs: {
          label: 'value',
          value: -1
        }
      }
    }],
    ['1 + 2 * 3', {
      label: 'expressionTree',
      value: {
        lhs: {
          label: 'value',
          value: 1
        },
        operator: '+',
        rhs: {
          label: 'expressionTree',
          value: {
            lhs: {
              label: 'value',
              value: 2
            },
            operator: '*',
            rhs: {
              label: 'value',
              value: 3
            }
          }
        }
      }
    }],
    ['x = 1 + 1', {
      label: 'expressionTree',
      value: {
        lhs: {
          label: 'variable',
          value: 'x'
        },
        operator: '=',
        rhs: {
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
      }
    }],
    ['(1 + 1)', {
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
    }],
    ['sum(1, 2)', {
      label: 'functionCall',
      value: {
        name: 'sum',
        arguments: [
          {
            label: 'value',
            value: 1
          },
          {
            label: 'value',
            value: 2
          }
        ]
      }
    }],
    ['sum(1, sum(2, 3))', {
      label: 'functionCall',
      value: {
        name: 'sum',
        arguments: [
          {
            label: 'value',
            value: 1
          },
          {
            label: 'functionCall',
            value: {
              name: 'sum',
              arguments: [
                {
                  label: 'value',
                  value: 2
                },
                {
                  label: 'value',
                  value: 3
                }
              ]
            }
          }
        ]
      }
    }]
  ],
  invalid: [
    '',
    ' ',
    '+',
    'x+',
    '1 + 1;'
  ]
});
