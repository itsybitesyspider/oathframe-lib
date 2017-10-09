'use strict';

const oathframe = require('../src/index');

describe('The orphans function', function() {
  it('lists all orphans under an element', function(done) {
    oathframe.orphans(this.tmp_dir).then(orphans => {
      expect(orphans).toEqual(['empty', 'rogue.md']);
    }).then(done).catch(done.fail);
  });
});
