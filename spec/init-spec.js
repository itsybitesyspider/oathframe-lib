'use strict';

const index = require('../src/index');
const Resource = require('../src/Resource');
const path = require('path');

describe('The init function', function() {
  it('creates a directory with an index file', function(done) {

    //literally all this huge bit of code does is create an empty index
    //and then peek around to make sure it looks like an empty index

    index.init(this.tmp_dir + '/doesnotexist')
      .then(() => index.render.asString(this.tmp_dir + '/doesnotexist'))
      .then(result => {
        expect(result).toBe('');
      })
      .then(() => Resource.resolve(this.tmp_dir + '/doesnotexist'))
      .then(resource => resource.readJSON())
      .then(json => {
        expect(typeof json).toBe('object');
        expect(json.sections.length).toBe(0);
      })
      .then(done)
      .catch(done.fail);
  });

  it('works on an already-existing empty directory', function(done) {
    index.init(this.tmp_dir + '/empty')
      .then(done)
      .catch(done.fail);
  });

  it('fails when run twice on the same directory', function(done) {
    index.init(this.tmp_dir + '/empty')
      .then(() => index.init(path.join(this.tmp_dir,'empty')))
      .then(done.fail)
      .catch(done);
  });

  // this is kindof redundant to the test above
  it('fails when run on a directory that already has an index', function(done) {
    index.init(this.tmp_dir)
      .then(done.fail)
      .catch(done);
  });
});
