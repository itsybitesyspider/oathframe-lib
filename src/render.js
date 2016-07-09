'use strict';

const Resource = require('./Resource');

module.exports = function(root, format, to) {
  if( typeof format !== 'string' )
    throw new Error('oathframe render: invalid format: ' + format);

  return Resource.resolve(root).then(resource =>
    resource.traverse(r => {
      if( r[format] )
        return r[format]().then(to);
    }));
};

module.exports.asString = function(root, format) {
  let result = '';

  return module.exports(root, format, s => {
    result += s;
  }).then(() => result);
};

module.exports.asArray = function(root, format) {
  const result = [];

  return module.exports(root, format, o => {
    result.push(o);
  }).then(() => result);
};

