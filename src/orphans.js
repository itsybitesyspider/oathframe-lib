'use strict';

const fs = require('fs-promise');
const path = require('path');
const R = require('ramda');
const Resource = require('./Resource');

module.exports = function(root_) {
  const result = [];

  return Resource.resolve(root_).then(root => root.traverse(resource => {
    if( !Resource.isDirectory(resource) )
      return;

    return resource.sections().then(sections => {
      sections = sections.map(x => path.basename(x.filepath()));
      return fs.readdir(resource.filepath()).then(files => {
        files = files.map(x => path.basename(x));
        R.reject(x => x.startsWith('.'), R.difference(files, sections))
          .forEach(x => {
            result.push(x);
          });
      });
    });
  })).then(() => result);
};

