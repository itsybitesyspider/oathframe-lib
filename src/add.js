'use strict';

const path = require('path');
const Resource = require('./Resource');

module.exports = function(resource, directory) {
  return Promise.resolve()
    .then(() => Promise.all([Resource.resolve(resource), Resource.resolve(directory)]))
    .then(items => {
      resource = items[0];
      directory = items[1];

      if( !Resource.isDirectory(directory) )
        throw new Error(directory + ' is not a directory');
    }).then(() => resource.exists())
    .then(() => {
      if( path.dirname(resource.filepath()) !== directory.filepath() ) {
        throw new Error('Not adding ' + resource.filepath()
           + ' because it isn\'t directly inside ' + directory.filepath());
      }
    }).then(() => directory.readJSON())
    .then(json => {
      const base = path.basename(resource.filepath());

      if( json.sections.indexOf(base) >= 0 )
        throw new Error('Not adding ' + resource.filepath()
          + ' because it\'s already part of ' + directory.filepath());

      json.sections.push(path.basename(resource.filepath()));
      return json;
    }).then(json => directory.writeJSON(json))
    .then(() => 'ok');
};

