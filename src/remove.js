'use strict';

const path = require('path');
const R = require('ramda');
const Resource = require('./Resource');

module.exports = function(resource_, directory_) {
  return Resource.resolve(resource_).then(resource => {
    return Resource.resolve(directory_).then(directory => {
      return directory.readJSON().then(json => {
        const base = path.relative(directory.filepath(), resource.filepath());

        if( json.sections.indexOf(base) < 0 )
          throw new Error('Can\'t find ' + resource.filepath() + ' in ' + directory.filepath());

        json.sections = R.reject(x => x === base, json.sections);
        return directory.writeJSON(json);
      }).then(() => 'ok');
    });
  });
};

