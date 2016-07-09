'use strict';

module.exports = function(resource,load) {
  function withModule(name) {
    return (x) => require(name)(x,load);
  }

  return Promise.resolve(resource)
    .then(withModule('./json'))
    .then(withModule('./sections'))
    .then(withModule('./markdown'))
    .then(withModule('./html'));
};
