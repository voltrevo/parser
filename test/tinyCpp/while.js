'use strict';

var testTemplate = require('./testTemplate.js');
var while_ = require('../../examples/tinyCpp/cppParse/while.js');

testTemplate(while_, {
  valid: [
    ['while (1) {}', {
      condition: {
        label: 'value',
        value: 1
      },
      body: []
    }]
  ]
});
