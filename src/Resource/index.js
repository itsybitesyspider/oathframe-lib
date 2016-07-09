'use strict';

const fs = require('fs-promise');
const path = require('path');

const modules = require('./modules');

/*
 * The prototype of all Resource objects.
 *
 * A resource is a file loaded from disk with the following fields:
 *
 * dirname: the directory in which the file is located.
 * basename: the name of the file itself
 *
 * children (Promise): a list of other Resource objects referenced by this one
 * parent: if this Resource was loaded because it was referenced by
 *   another Resource, a backreference to that Resource.
 *
 * text: the exact text content of this Resource.
 */
const Resource = {
  _type: 'oathframe/Resource',
  dirname: null,
  basename: null,
  filepath: null,

  children: () => Promise.resolve([]),
  parent: () => null,

  text: () => ''
};

Resource.traverse = function(to) {
  return Promise.resolve(to(this))
    .then(() => this.children())
    .then(children => {
      let p = Promise.resolve();
      children.forEach(child => {
        p = p.then(() => child.traverse(to));
      });

      return p;
    })
    .then(() => undefined);
};

module.exports.create = function(filepath) {
  filepath = module.exports.filepath(filepath);

  const resource = Object.assign(Object.create(Resource), {
    dirname: path.dirname(filepath),
    basename: path.basename(filepath),
    filepath: filepath,
    text: () => verboseLoad(filepath)
  });

  return modules(resource,module.exports.create);
};

module.exports.isResource = function(maybe_resource) {
  return maybe_resource._type === Resource._type;
};

module.exports.resolve = function(something) {
  if( module.exports.isResource(something) )
    return something;
  else if( typeof something === 'string' )
    return module.exports.create(something);
  else
    throw new Error('oathframe/Resource: not sure how to load: ' + something);
};

module.exports.filepath = function(something) {
  if( module.exports.isResource(something) ) {
    return something.filepath;
  } else if( typeof something === 'string' ) {
    something = path.resolve(something);

    if( fs.statSync(something).isDirectory() )
      something = path.join(something,'.oathframe.json');

    return something;
  } else {
    throw new Error('oathframe/Resource.filepath: not sure what to do with: ' + something);
  }
};

module.exports.prototype = Resource;

/*
 * Load a file with verbose messages.
 */
function verboseLoad(filepath) {
  return fs.readFile(filepath,{encoding:'utf8'}).then(result => {
    console.error('Loaded: ' + filepath); // eslint-disable-line no-console
    return result;
  }).catch(err => {
    console.error('Failed to load: ' + filepath + ' (' + err.message + ')'); // eslint-disable-line no-console
    throw err;
  });
}

