/*!
 * node-opkg
 *
 * A simple command-line wrapper around the openwrt `opkg` package manager.
 *
 * ---
 *
 * Copyright 2017 Anders Evenrud <andersevenrud@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ---
 *
 * @version 0.5.5
 * @package node-opkg
 * @author Anders Evenrud <andersevenrud@gmail.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const library = require('../index.js');

const timeout = 60000;

const checkpackage = 'python-core';
const checkbin = ['/usr/bin/python2', '/usr/bin/ssh'];
const findpackage = 'python';
const installpackage = 'nodejs';

console.log('PLEASE NOTE THAT THESE TESTS CAN BE PLATFORM SPESIFIC');

//library.setExecPath(require('path').dirname(__dirname) + '/opkg-remote');

describe('files()', () => {
  it('files("<package>")', (done) => {
    library.files(checkpackage).then((res) => {
      assert(true, res instanceof Array);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('changedConffiles()', () => {
  it('changedConffiles()', (done) => {
    library.changedConffiles().then((res) => {
      assert(true, res instanceof Array);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('info()', () => {
  it('info("<package>")', (done) => {
    library.info(checkpackage).then((res) => {
      assert(checkpackage, res.Package);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('search()', () => {
  it('search("<valid>")', (done) => {
    library.search(checkbin[0]).then((res) => {
      assert(checkpackage, res.Package);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
  it('search("<invalid>")', (done) => {
    library.search(checkbin[1]).then((res) => {
      assert(false, true);
      done();
    }).catch((err) => {
      assert('No packge found', err);
      done();
    });
  }).timeout(timeout);
});

describe('install()', () => {
  it('install("<package>")', (done) => {
    library.install(installpackage).then((res) => {
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('remove()', () => {
  it('remove("<package>")', (done) => {
    library.remove(installpackage, {forceDepends: null}).then((res) => {
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('status()', () => {
  it('status()', (done) => {
    library.status(checkpackage).then((res) => {
      assert(checkpackage, res.Package);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('find()', () => {
  it('find("<q>")', (done) => {
    library.find(findpackage).then((res) => {
      assert(true, res instanceof Array);
      assert(true, res.length > 3);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('update()', () => {
  it('update()', (done) => {
    library.update().then((res) => {
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

describe('list()', () => {
  it('list("available") [list]', (done) => {
    library.list('available').then((res) => {
      assert(true, res instanceof Array);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);

  it('list("available", "<package>") [list <package>]', (done) => {
    library.list('available', checkpackage).then((res) => {
      assert(true, res instanceof Array);
      assert(1, res.length);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);

  it('list("installed") [list-installed]', (done) => {
    library.list('installed').then((res) => {
      assert(true, res instanceof Array);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);

  it('list("upgradable") [list-upgradable]', (done) => {
    library.list('upgradable').then((res) => {
      assert(true, res instanceof Array);
      done();
    }).catch((err) => {
      done(new Error(err));
    });
  }).timeout(timeout);
});

