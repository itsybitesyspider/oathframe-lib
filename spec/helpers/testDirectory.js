'use strict';

const tmp = require('tmp');
const fs = require('fs-promise');

beforeEach(function() {
  this.tmpobj = tmp.dirSync();

  this.tmp_dir = this.tmpobj.name;

  fs.copySync('./example', this.tmp_dir);
});

