'use strict';

var Consumer = require('./consumer.js');

module.exports = function(consumer) {
  return Consumer('optional(' + consumer.name + ')', function(api) {
    var res = consumer.consume(api.stream);

    if (!res.accepted) {
      return api.accept({
        set: false
      });
    }

    return api.forward(
      {
        set: true,
        value: res.value
      },
      res
    );
  });
};
