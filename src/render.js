'use strict';

const Resource = require('./Resource');
const marked = require('marked');

module.exports = function() {
  const resource = Resource.resolve(arguments[0]);
  let options = {};
  let to = undefined;

  if( arguments.length === 2 ) {
    to = arguments[1];
  }

  if( arguments.length === 3 ) {
    options = arguments[1] || {};
    to = arguments[2];
  }

  options.fromText = options.fromText || (x => Promise.resolve(x));
  options.fromJSON = options.fromJSON || (() => Promise.resolve(''));
  options.render = options.render || (x => Promise.resolve(marked(x)));

  return resource.then(r => implementation(r, options, to));
};

function implementation(resource, options, to) {
  if( !Resource.isResource(resource) )
    throw new Error(resource + ' is not a Resource. Please report this as a bug.');

  return resource.traverse(i => {
    if( Resource.isFile(i) )
      return i.readText().then(options.fromText).then(options.render).then(to);
    else if( Resource.isDirectory(i) )
      return i.readJSON().then(options.fromJSON).then(options.render).then(to);
    else
      throw new Error('Not sure what to do with ' + i);
  });
}

module.exports.asString = function(resource, options) {
  let result = '';

  return module.exports(resource, options, i => {
    result += i;
  }).then(() => result);
};

module.exports.asArray = function(resource, options) {
  const result = [];

  return module.exports(resource, options, i => {
    result.push(i);
  }).then(() => result);
};

