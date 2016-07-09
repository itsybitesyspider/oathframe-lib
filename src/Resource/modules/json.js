'use strict';

module.exports = function(resource) {
  if( resource.basename.endsWith('.json' ) && !resource.json ) {
    const json = resource.text().then(JSON.parse);
    resource.json = () => json;
    return json.then(() => resource, () => resource);
  }

  return Promise.resolve(resource);
};
