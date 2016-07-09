'use strict';

module.exports = function(resource) {
  if( resource.basename.endsWith('.md' ) && !resource.markdown ) {
    resource.markdown = resource.text;
  }

  return Promise.resolve(resource);
};
