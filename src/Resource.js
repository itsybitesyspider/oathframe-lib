'use strict';

const path = require('path');
const fs = require('fs-promise');

const Resource = {
  _type: 'oathframe/Resource',
  _filepath: null
};

// The prototype of all File objects.
const File = Object.assign(Object.create(Resource), {
  _type: 'oathframe/File',
  _filepath: null
});

const Directory = Object.assign(Object.create(Resource), {
  _type: 'oathframe/Directory',
  _filepath: null
});

// Path to this Resource.
Resource.filepath = function() {
  return this._filepath;
};

// Path to this file, or the '.oathframe.json' index file.
Resource.physicalFilepath = function() {
  return this.filepath();
};

// Path to the '.oathframe.json' index file.
Directory.physicalFilepath = function() {
  return path.join(this.filepath(), '.oathframe.json');
};

// Write text to this file.
Resource.writeText = function(text, options) {
  options = options || {};
  options = Object.assign({encoding:'utf8'}, options);

  return fs.writeFile(this.physicalFilepath(), text, options)
    .then(() => {
      console.error('Wrote: ' + this.filepath());  // eslint-disable-line no-console
      return this;
    });
};

// Read the text of this file.
Resource.readText = function() {
  return fs.readFile(this.physicalFilepath(), {encoding:'utf8'})
    .then(contents => {
      console.error('Read: ' + this.filepath()); // eslint-disable-line no-console
      return contents;
    });
};

// Write the '.oathframe.json' file for this directory.
Directory.writeJSON = function(data, options) {
  options = options || {};
  options = Object.assign({encoding:'utf8'}, options);

  return fs.ensureDir(this.filepath())
    .then(() => fs.writeFile(this.physicalFilepath(), JSON.stringify(data), options))
    .then(() => {
      console.error('Wrote: ' + this.filepath() + path.sep);  // eslint-disable-line no-console
      return this;
    });
};

// Read the '.oathframe.json' file for this directory.
// Returns a fresh copy of this Directory with the newly read data.
Directory.readJSON = function() {
  return fs.readFile(this.physicalFilepath(), {encoding:'utf8'})
    .then(contents => {
      const result = JSON.parse(contents);
      console.error('Read: ' + this.filepath() + path.sep); // eslint-disable-line no-console
      return result;
    });
};

// Most resources don't have sections.
Resource.sections = function() {
  return Promise.resolve([]);
};

Directory.sections = function() {
  return this.readJSON()
    .then(json => Promise.all(json.sections.map(section =>
      resolve(path.join(this.filepath(), section)))));
};

Resource.traverse = function(f) {
  return this.sections().then(sections => {
    let result = Promise.resolve();
    result = result.then(() => f(this));
    sections.forEach(i => {
      result = result.then(() => i.traverse(f));
    });
    return result;
  });
};

// Create a new file.
function createFile(filepath) {
  if(path.basename(filepath).startsWith('.'))
    throw new Error('No dotfiles.');

  const result = Object.assign(Object.create(File), {
    _filepath: filepath
  });

  return Promise.resolve(result);
}

module.exports.createFile = createFile;

/*
 * Create a Resource based on the specified filepath.
 */
function createDirectory(filepath) {
  if(path.basename(filepath).startsWith('.'))
    throw new Error('No dotfiles.');

  const result = Object.assign(Object.create(Directory), {
    _filepath: filepath
  });

  return Promise.resolve(result);
}

module.exports.createDirectory = createDirectory;

/*
 * Answer a Promise of a File or Directory (whichever it is)
 * based on the parameter. The parameter can be a kind of
 * Resource or it can be a filepath.
 *
 * If the parameter is a filepath does not already exist,
 * there will be an error.
 */
function resolve(x) {
  return Promise.resolve(x).then(something => {
    if( isResource(something) )
      return Promise.resolve(something);

    if( typeof something === 'string' ) {
      if( path.basename(something) === '.oathframe.json' )
        return resolve(path.dirname(something));

      return fs.stat(something).then(stat => (stat.isDirectory() ? createDirectory : createFile)(something));
    }

    throw new Error('Resource: not sure how to resolve ' + something);
  });
}

module.exports.resolve = resolve;

function isFile(maybe) {
  return maybe._type === File._type;
}

module.exports.isFile = isFile;

function isDirectory(maybe) {
  return maybe._type === Directory._type;
}

module.exports.isDirectory = isDirectory;

// True iff the parameter is a kind of Resource, false otherwise.
function isResource(maybe) {
  return isFile(maybe) || isDirectory(maybe);
}

module.exports.isResource = isResource;

