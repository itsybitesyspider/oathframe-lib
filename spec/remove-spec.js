'use strict';

const path = require('path');
const oathframe = require('../src/index');

describe('The remove function', function() {
  it('removes a file from the index', function(done) {
    oathframe.remove(path.join(this.tmp_dir,'a.md'), this.tmp_dir)
      .then(() => oathframe.render.asString(this.tmp_dir))
      .then(result => {
        expect(result.indexOf('beginning')).toBe(-1);
        expect(result.indexOf('ending')).toBeGreaterThan(result.indexOf('early'));
      })
      .then(done)
      .catch(done.fail);
  });

  it('refuses to remove a file which is not actually in the index', function(done) {
    oathframe.remove(path.join(this.tmp_dir,'rogue.md'), this.tmp_dir)
      .then(done.fail)
      .catch(done);
  });

  it('refuses to remove a file which is deeper in the tree of indexes', function(done) {
    oathframe.add(path.join(this.tmp_dir, 'nested','2.md'), this.tmp_dir, {})
      .then(done.fail)
      .catch(done);
  });
});
