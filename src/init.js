'use strict';

const fs = require('fs-promise');
const Resource = require('./Resource');

const default_index = JSON.stringify({ sections: [] });

module.exports = function(index_json) {
  return fs.ensureDir(index_json)
    .then(() => {
      index_json = Resource.filepath(index_json);
    })
    .then(() => fs.writeFile(index_json, default_index, { encoding: 'utf8', flag: 'wx' }))
    .then(() => {
      console.error('Wrote ' + index_json);  // eslint-disable-line no-console
    });
};
