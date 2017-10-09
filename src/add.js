'use strict';

const path = require('path');
const Resource = require('./Resource');

module.exports = function(resource_, directory_) {
  return Resource.resolve(resource_).then(resource => {
    return Resource.resolve(directory_).then(directory => {

      return directory.contains(resource).then(yes => {
        if( !yes )
          throw new Error('Not adding ' + resource.filepath()
            + ' because it isn\'t directly inside ' + directory.filepath());
      }).then(() => directory.readJSON()).then(json => {
        const base = path.basename(resource.filepath());

        if( json.sections.indexOf(base) >= 0 )
          throw new Error('Not adding ' + resource.filepath()
            + ' because it\'s already part of ' + directory.filepath());

        json.sections.push(base);
        return directory.writeJSON(json);
      }).then(() => 'ok');

    });
  });
};

