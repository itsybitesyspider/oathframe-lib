'use strict';

const path = require('path');

const Resource = require('../src/Resource');

describe('The Resource object', function() {
  it('can test that Files are Resources', function(done) {
    Resource.createFile(path.join(this.tmp_dir,'foo.txt'))
      .then(f => expect(Resource.isResource(f)).toBe(true))
      .then(done)
      .catch(done.fail);
  });

  it('can test that Directories are Resources', function(done) {
    Resource.createDirectory(path.join(this.tmp_dir,'foo'))
      .then(d => expect(Resource.isResource(d)).toBe(true))
      .then(done)
      .catch(done.fail);
  });

  it('can test that non-File non-Directory parameters are not Resources', function() {
    expect(Resource.isResource({'this':'thing'})).toBe(false);
  });

  it('can resolve Files', function(done) {
    Resource.resolve(path.join(this.tmp_dir,'a.md'))
      .then(f => f.readText())
      .then(contents => expect(contents).toMatch(/beginning/))
      .then(done)
      .catch(done.fail);
  });

  it('can resolve Directories', function(done) {
    Resource.resolve(this.tmp_dir)
      .then(d => d.readJSON())
      .then(json => expect(json.sections.length).toBe(5))
      .then(done)
      .catch(done.fail);
  });
});

describe('The Directory object', function() {
  it('uses a .oathframe.json file as its physicalFilepath', function(done) {
    Resource.createDirectory(path.join(this.tmp_dir,'foo'))
      .then(d => expect(d.physicalFilepath()).toBe(path.join(d.filepath(), '.oathframe.json')))
      .then(done)
      .catch(done.fail);
  });

  it('has a write method that returns the original', function(done) {
    Resource.createDirectory(path.join(this.tmp_dir,'foo'))
      .then(d => d.writeJSON({'arbitrary':'json'})
        .then(d_ => expect(d_).toBe(d)))
      .then(done)
      .catch(done.fail);
  });

  it('has a read method that returns the written data', function(done) {
    const json = {'arbitrary':'json'};

    Resource.createDirectory(path.join(this.tmp_dir,'foo'))
      .then(f => f.writeJSON(json))
      .then(f => f.readJSON())
      .then(json_ => expect(json_).toEqual(json))
      .then(done)
      .catch(done.fail);
  });

  it('has an isDirectory method to check if an object is a Directory object', function(done) {
    expect(Resource.isDirectory({'this':'thing'})).toBe(false);

    Resource.createDirectory(path.join(this.tmp_dir,'foo'))
      .then(d => expect(Resource.isDirectory(d)).toBe(true))
      .then(done)
      .catch(done.fail);
  });
});

describe('The File object', function() {
  it('has the same filepath and physicalFilepath', function(done) {
    Resource.createFile(path.join(this.tmp_dir,'foo.txt'))
      .then(f => expect(f.physicalFilepath()).toBe(f.filepath()))
      .then(done)
      .catch(done.fail);
  });

  it('has a write method that returns the original', function(done) {
    Resource.createFile(path.join(this.tmp_dir,'foo.txt'))
      .then(f => f.writeText('foo')
        .then(f_ => expect(f_).toBe(f)))
      .then(done)
      .catch(done.fail);
  });

  it('has a read method that returns the written data', function(done) {
    const s = 'The quick brown fox jumped over the lazy spider.';

    Resource.createFile(path.join(this.tmp_dir,'foo.txt'))
      .then(f => f.writeText(s))
      .then(f => f.readText())
      .then(s_ => expect(s_).toBe(s))
      .then(done)
      .catch(done.fail);
  });

  it('does not have any sections', function(done) {
    Resource.createFile(path.join(this.tmp_dir,'foo.txt'))
      .then(f => f.sections())
      .then(s => expect(s).toEqual([]))
      .then(done)
      .catch(done.fail);
  });

  it('has an isFile method to check if an object is a File object', function(done) {
    expect(Resource.isFile({'this':'thing'})).toBe(false);

    Resource.createFile(path.join(this.tmp_dir,'foo.txt'))
      .then(f => expect(Resource.isFile(f)).toBe(true))
      .then(done)
      .catch(done.fail);
  });
});



