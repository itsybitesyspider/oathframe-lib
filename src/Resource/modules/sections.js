'use strict';

const path = require('path');

module.exports = function(resource,load) {
  if( resource.json && !resource.sections ) {
    return resource.json().then(json => json.sections.map(section => {
      const child = load(path.join(resource.dirname,section));
      child.parent = () => resource;
      return child;
    })).then(sections => Promise.all(sections)).then(sections => {
      resource.sections = () => sections;
      resource.children = () => sections;
      return resource;
    });
  }

  return resource;
};
