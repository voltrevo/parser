'use strict';

var testTemplate = require('./testTemplate.js');
var statement = require('../../examples/tinyCpp/cppParse/statement.js');

testTemplate(statement, {
  valid: [
    ['int x = 3;'],
    ['return 0;'],
    ['0;'],
    ['{}'],
    ['if (1) {}'],
    ['while (1) {}']
  ],
  invalid: [
    '',
    ';' // TODO: make this valid
  ]
});
