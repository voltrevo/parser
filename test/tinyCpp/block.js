'use strict';

var testTemplate = require('./testTemplate.js');
var block = require('../../examples/tinyCpp/cppParse/block.js');

testTemplate(block, {
  valid: [
    ['{}'],
    ['{ }'],
    ['{ int x = 3; }']
  ],
  invalid: [
    '',
    '{',
    '{}}',
    '{{}'
  ]
});
