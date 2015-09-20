'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer, test) {
  return Consumer(function(stream, acceptValid, acceptInvalid, reject) {
    var res = consumer(stream);

    if (res.type !== 'acceptValid') {
      return (res.type === 'acceptInvalid' ? acceptInvalid : reject)(res.value);
    }

    return (test(res.value) ? acceptValid : acceptInvalid)(res.value);
  });
};
