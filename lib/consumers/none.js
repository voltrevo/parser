'use strict';

var Consumer = require('./consumer.js');

module.exports = Consumer('none', function(api) {
  return api.reject('none always rejects');
});
