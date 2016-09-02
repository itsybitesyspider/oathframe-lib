'use strict';

const index = require('../src/index');

describe('The render function', () => {
  it('Renders a single markdown document', (done) => {
    index.render('./example/a.md', md => {
      expect(md).toMatch(/beginning/);
      done();
    }).catch(done.fail);
  });
});

describe('The render function', () => {
  it('Renders an index document with all children', (done) => {
    let result = '';
    index.render('./example/', md => {
      result += md;
    }).then(() => {
      expect(result).toMatch(/beginning/);
      expect(result).toMatch(/early middle/);
      expect(result).toMatch(/late middle/);
      expect(result).toMatch(/interrupting/);
      expect(result).toMatch(/important/);
      expect(result).toMatch(/unimportant/);
      expect(result).toMatch(/ending/);

      expect(result.indexOf('beginning')).toBeLessThan(result.indexOf('early middle'));
      expect(result.indexOf('early middle')).toBeLessThan(result.indexOf('late middle'));
      expect(result.indexOf('late middle')).toBeLessThan(result.indexOf('interrupting'));
      expect(result.indexOf('interrupting')).toBeLessThan(result.indexOf('important'));
      expect(result.indexOf('important')).toBeLessThan(result.indexOf('unimportant'));
      expect(result.indexOf('unimportant')).toBeLessThan(result.indexOf('ending'));

      done();
    }).catch(done.fail);
  });
});
