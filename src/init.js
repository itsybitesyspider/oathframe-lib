'use strict';

const Resource = require('./Resource');

module.exports = function(index_json) {
  return Resource.createDirectory(index_json).then(d => d.writeJSON({sections: []}, {flag: 'wx'}));
};
