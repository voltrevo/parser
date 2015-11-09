'use strict';

var testTemplate = require('./testTemplate.js');
var if_ = require('../../examples/tinyCpp/cppParse/if.js');

testTemplate(if_, {
  valid: [
    ['if (1) {}', {
      condition: {
        label: 'value',
        value: 1
      },
      body: [],
      continuation: {
        set: false
      }
    }],
    ['if (1 + 1) {{}}'],
    ['if (1 + 2 * 3) { int foo = bar; }'],
    ['if (1) {} else {}', {
      condition: {
        label: 'value',
        value: 1
      },
      body: [],
      continuation: {
        set: true,
        value: {
          elseBody: {
            label: 'codeBlock',
            value: []
          }
        }
      }
    }],
    ['if (1) {} else if (1) {}'],
    ['if (1) {} else if (1) {} else {}'],
    ['if (1) {} else if (1) {} else if (1) {} else {}', {
      condition: {
        label: 'value',
        value: 1
      },
      body: [],
      continuation: {
        set: true,
        value: {
          elseBody: {
            label: 'if',
            value: {
              condition: {
                label: 'value',
                value: 1
              },
              body: [],
              continuation: {
                set: true,
                value: {
                  elseBody: {
                    label: 'if',
                    value: {
                      condition: {
                        label: 'value',
                        value: 1
                      },
                      body: [],
                      continuation: {
                        set: true,
                        value: {
                          elseBody: {
                            label: 'codeBlock',
                            value: []
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }],
    ['if(1){}else if(1){}else if(1){}else{}']
  ],
  invalid: [
    '',
    'if',
    'if {}',
    'if () {}',
    'if (1) {} else',
    'if (1) {} else (1) {}'
  ]
});
