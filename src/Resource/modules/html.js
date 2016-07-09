'use strict';

const marked = require('marked');
const markdown_options = { gdm: true };

module.exports = function(resource) {
  if( resource.markdown && !resource.html ) {
    resource.html = () => resource.markdown().then(md => marked(md, markdown_options));
  }

  return Promise.resolve(resource);
};

