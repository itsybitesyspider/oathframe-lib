'use strict';

const path = require('path');
const oathframe = require('../src/index');

describe('The add function', function() {
  it('adds a file to an index', function(done) {
    oathframe.add(path.join(this.tmp_dir,'rogue.md'), this.tmp_dir, {})
      .then(() => oathframe.render.asString(this.tmp_dir))
      .then(result => {
        expect(result.indexOf('ending')).toBeLessThan(result.indexOf('rogue'));
      })
      .then(done)
      .catch(done.fail);
  });

  it('refuses to add a file which is not somewhere in a subdirectory', function(done) {
    oathframe.add('./example/rogue.md', this.tmp_dir, {})
      .then(done.fail)
      .catch(done);
  });

  it('refuses to add a file which is already in the index', function(done) {
    oathframe.add(path.join(this.tmp_dir,'a.md'), this.tmp_dir, {})
      .then(done.fail)
      .catch(done);
  });

  it('refuses to add a file which is already present in the tree of indexes', function(done) {
    oathframe.add(path.join(this.tmp_dir, 'nested','2.md'), this.tmp_dir, {})
      .then(done.fail)
      .catch(done);
  });
});
