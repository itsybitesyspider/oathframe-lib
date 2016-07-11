'use strict';

const index = require('../src/index');

describe('The init function', function() {
  it('creates a directory with an index file', function(done) {

    //literally all this huge bit of code does is create an empty index
    //and then peek around to make sure it looks like an empty index

    index.init(this.tmp_dir + '/doesnotexist')
      .then(() => index.render.asString(this.tmp_dir + '/doesnotexist', 'markdown'))
      .then(result => {
        expect(result).toBe('');
      })
      .then(() => index.render.asArray(this.tmp_dir + '/doesnotexist', 'json'))
      .then(result => {
        expect(result.length).toBe(1);
        expect(typeof result[0]).toBe('object');
        expect(result[0].sections.length).toBe(0);
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
      .then(() => index.init(this.tmp_dir + '/empty'))
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
