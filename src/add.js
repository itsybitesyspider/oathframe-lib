'use strict';

const fs = require('fs-promise');
const Resource = require('./Resource');

module.exports = function(text_filepath, index_filepath) {
  return Resource.resolve(index_filepath).then(index => index.json().then(json => {
    json.sections.push(text_filepath);

    return fs.access(text_filepath, fs.R_OK)
      .then(() => console.error('File is ok: ' + text_filepath))  // eslint-disable-line no-console
      .then(() => fs.writeFile(index.filepath, JSON.stringify(json), { encoding: 'utf8' }))
      .then(() => console.error('Updated reference to ' + text_filepath + ' in ' + index_filepath)); // eslint-disable-line no-console
  }));
};

