'use strict';

const oathframe = require('../src/index');

describe('The add function', function() {
  it('adds a file to an index', function(done) {
    oathframe.add(this.tmp_dir + '/rogue.md', this.tmp_dir, {})
      .then(() => oathframe.render.asString(this.tmp_dir, 'markdown'))
      .then(result => {
        expect(result.indexOf('ending')).toBeLessThan(result.indexOf('rogue'));
      })
      .then(done)
      .catch(done.fail);
  });
});
