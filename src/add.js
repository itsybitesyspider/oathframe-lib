'use strict';

const fs = require('fs-promise');
const path = require('path');
const Resource = require('./Resource');

module.exports = function(text_filepath, index_filepath) {
  return fs.access(text_filepath, fs.R_OK)
    .then(() => Resource.resolve(index_filepath))
    .then(resource => resource.json().then(json => {
      json.sections.push(path.relative(index_filepath,text_filepath));
      return resource.write(JSON.stringify(json));
    }));
};

