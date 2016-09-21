'use strict';

const Resource = require('./Resource');

module.exports = function(index) {
  return Promise.resolve()
    .then(() => Resource.createDirectory(index))
    .then(d => d.writeJSON({sections: []}, {flag: 'wx'}))
    .then(() => 'ok');
};
