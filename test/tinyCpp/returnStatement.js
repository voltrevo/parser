'use strict';

var testTemplate = require('./testTemplate.js');
var returnStatement = require('../../examples/tinyCpp/cppParse/returnStatement.js');

testTemplate(returnStatement, {
  valid: [
    ['return 0;', {
      label: 'value',
      value: 0
    }]
  ],
  invalid: [
    '',
    ';',
    '0;',
    'return;' // TODO: make this valid
  ]
});
