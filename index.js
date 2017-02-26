/*!
 * node-opkg
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
 */

/**
 * A simple command-line wrapper around the openwrt `opkg` package manager.
 * @module node-opkg
 * @author Anders Evenrud <andersevenrud@gmail.com>
 * @license MIT
 */
'use strict';

const _cp = require('child_process');
const _spawn = _cp.spawn;

let BIN = '/usr/bin/opkg';

///////////////////////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////////////////////

/*
 * Parses package name input
 */
function getPackagesFromArg(pkg) {
  if ( !(pkg instanceof Array) ) {
    pkg = String(pkg).replace(/\s+/g, ' ').split(' ');
  }
  return pkg;
}

/*
 * Parses command line option input
 */
function getOptionsFromArg(opts) {
  if ( opts instanceof Array ) {
    return opts;
  }

  opts = opts || {};
  return Object.keys(opts).filter((k) => {
    return k.substr(0, 1) !== '_';
  }).map((k) => {
    if ( k === k.toUpperCase() ) {
      return '-' + k + (opts[k] || '');
    }
    let a = '--' + k.replace(/([A-Z])/g, '-$1').toLowerCase();
    if ( opts[k] !== null ) {
      a += '=' + opts[k];
    }
    return a;
  });
}

/*
 * Parses package list output
 */
function parsePackageOutput(stdout) {
  const lines = stdout.split('\n');
  const packages = [];

  let lastPackage;
  lines.forEach((l) => {
    if ( l.substr(0, 1) === ' ' ) {
      if ( lastPackage ) {
        lastPackage.description += ' ' + l.trim().replace(/\s+/g, ' ');
      }
    } else {
      if ( l.length > 3 ) {
        const spl = l.trim().split(' - ', 3);

        lastPackage = {
          Package: spl[0],
          Version: spl[1],
          Description: (spl[2] || '').trim().replace(/\s+/g, ' ')
        };

        packages.push(lastPackage);
      }
    }
  });

  return packages;
}

/*
 * Parses package status output
 */
function parseStatusOutput(stdout) {
  const info = {};

  stdout.split('\n').forEach((l) => {
    if ( l.trim().length ) {
      const spl = l.trim().split(': ', 2);
      if ( spl.length !== 2 ) {
        info.Description += l;
      } else {
        info[spl[0]] = spl[1];
      }
    }
  });

  return info;
}

/*
 * Parses file status output
 */
function parseFileOutput(stdout) {
  const spl = stdout.trim().split(' - ', 2);
  return {
    Package: spl[0],
    Version: spl[1]
  };
}

/*
 * Parses normal list outputs
 */
function parseListOutput(stdout, shift) {
  const lines = stdout.trim().split('\n');
  if ( lines.length && shift ) {
    lines.shift();
  }
  return lines;
}

/*
 * Runs the given command and opens up a stream,
 * handles exit state.
 */
function runCommand(cmd, opts, stdout, stderr) {
  opts = opts || {};
  stdout = opts._stdout || function() {};
  stderr = opts._stderr || function() {};

  return new Promise((resolve, reject) => {
    const pargs = getOptionsFromArg(opts);
    const a = pargs.length ? cmd.concat(pargs) : cmd;
    const s = _spawn(BIN, a);
    const o = [];
    const e = [];

    s.stdout.on('data', (data) => {
      o.push(data);
      stdout(data);
    });

    s.stderr.on('data', (data) => {
      e.push(data);
      stderr(data);
    });

    s.on('exit', (code) => {
      const result = {
        code: code,
        stdout: Buffer.concat(o).toString(),
        stderr: Buffer.concat(e).toString()
      };

      if ( code === 0 ) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });
}

///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

/**
 * Update package lists (`update`)
 *
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.update
 * @return {Promise}
 */
function updateList(opts) {
  const cmd = ['update'];
  return runCommand(cmd, opts);
}

/**
 * Upgrade package(s) (`upgrade`)
 *
 * @param {String|String[]}   pkg      Package(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.upgrade
 * @return {Promise}
 */
function upgradePackage(pkg, opts) {
  const cmd = ['upgrade'].concat(getPackagesFromArg(pkg));
  return runCommand(cmd, opts);
}

/**
 * Install package(s) (`install`)
 *
 * @param {String|String[]}   pkg      Package(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.install
 * @return {Promise}
 */
function installPackage(pkg, opts) {
  const cmd = ['install'].concat(getPackagesFromArg(pkg));
  return runCommand(cmd, opts);
}

/**
 * Configure package(s) (`configure`)
 *
 * @param {String|String[]}   pkg      Package(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.configure
 * @return {Promise}
 */
function configurePackage(pkg, opts) {
  const cmd = ['configure'].concat(getPackagesFromArg(pkg));
  return runCommand(cmd, opts);
}

/**
 * Remove package(s) (`remove`)
 *
 * @param {String|String[]}   pkg      Package(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.remove
 * @return {Promise}
 */
function removePackage(pkg, opts) {
  const cmd = ['remove'].concat(getPackagesFromArg(pkg));
  return runCommand(cmd, opts);
}

/**
 * Flag package(s) (`flag`)
 *
 * @param {String}            flag     Flag
 * @param {String|String[]}   pkg      Package(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.flag
 * @return {Promise}
 */
function flagPackage(flag, pkg, opts) {
  const flags = ['hold', 'noprune', 'user', 'ok', 'installed', 'unpackaged'];
  if ( flags.indexOf(flag) === -1 ) {
    return Promise.reject('Invalid flag: ' + flag);
  }

  const cmd = ['flag', flag].concat(getPackagesFromArg(pkg));
  return runCommand(cmd, opts);
}

/**
 * Lists packages (`list`)
 *
 * @param {String}            list     List type ('available', 'installed', 'upgradable')
 * @param {String|String[]}   [pkg]    Argument for 'available'
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.list
 * @return {Promise}
 */
function listPackages(list, pkg, opts) {
  const lists = {
    available: 'list',
    installed: 'list-installed',
    upgradable: 'list-upgradable'
  };

  let cmd = [lists[list]];

  if ( list === 'available' ) {
    if ( pkg ) {
      pkg = getPackagesFromArg(pkg);
      cmd = cmd.concat(pkg);
    }
  }

  if ( Object.keys(lists).indexOf(list) === -1 ) {
    return Promise.reject('Invalid argument: ' + list);
  }

  return new Promise((resolve, reject) => {
    runCommand(cmd, opts).then((result) => {
      resolve(parsePackageOutput(result.stdout));
    }).catch((result) => {
      reject(result.stderr);
    });
  });
}

/**
 * Lists available packages (`list`)
 *
 * @param {String|String[]}   [pkg]    Package name(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.listAvailable
 * @alias module:node-opkg.listPackages
 * @return {Promise}
 */
function listAvailablePackages(pkg, opts) {
  return listPackages('available', pkg, opts);
}

/**
 * Lists installed packages (`list`)
 *
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.listInstalled
 * @alias module:node-opkg.listPackages
 * @return {Promise}
 */
function listInstalledPackages(opts) {
  return listPackages('installed', opts);
}

/**
 * Lists upgradable packages (`list`)
 *
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.listUpgradable
 * @alias module:node-opkg.listPackages
 * @return {Promise}
 */
function listUpgradablePackages(opts) {
  return listPackages('upgradable', opts);
}

/**
 * Lists changed config files (`list-changed-conffiles`)
 *
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.changedConffiles
 * @return {Promise}
 */
function listChangedConfigurations(opts) {
  const cmd = ['list-changed-conffiles'];
  return new Promise((resolve, reject) => {
    runCommand(cmd, opts).then((result) => {
      resolve(parseListOutput(result.stdout));
    }).catch((result) => {
      reject(result.stderr);
    });
  });
}

/**
 * Shows package files (`files`)
 *
 * @param {String|String[]}   pkg      Package name(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.files
 * @return {Promise}
 */
function listPackageFiles(pkg, opts) {
  const cmd = ['files'].concat(getPackagesFromArg(pkg));
  return new Promise((resolve, reject) => {
    runCommand(cmd, opts).then((result) => {
      resolve(parseListOutput(result.stdout, true));
    }).catch((result) => {
      reject(result.stderr);
    });
  });
}

/**
 * Find package providing given file
 *
 * @param {String}            q        Query
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.status
 * @return {Promise}
 */
function findPackageByFile(q, opts) {
  const cmd = ['search', q];
  return new Promise((resolve, reject) => {
    runCommand(cmd, opts).then((result) => {
      if ( !result.stdout.trim().length ) {
        reject('No packge found');
      } else {
        resolve(parseFileOutput(result.stdout));
      }
    }).catch((result) => {
      reject(result.stderr);
    });
  });
}

/**
 * Shows package info (`info`)
 *
 * @param {String|String[]}   pkg      Package name(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.info
 * @return {Promise}
 */
function packageInfo(pkg, opts) {
  const cmd = ['info'].concat(getPackagesFromArg(pkg));
  return new Promise((resolve, reject) => {
    runCommand(cmd, opts).then((result) => {
      resolve(parseStatusOutput(result.stdout));
    }).catch((result) => {
      reject(result.stderr);
    });
  });
}

/**
 * Shows package status(es) (`status`)
 *
 * @param {String|String[]}   [pkg]    Package name(s)
 * @param {Array|Object}      [opts]   Command-line options
 *
 * @exports node-opkg.status
 * @return {Promise}
 */
function packageStatus(pkg, opts) {
  const cmd = ['status'].concat(getPackagesFromArg(pkg));
  return new Promise((resolve, reject) => {
    runCommand(cmd, opts).then((result) => {
      resolve(parseStatusOutput(result.stdout));
    }).catch((result) => {
      reject(result.stderr);
    });
  });
}

/**
 * Finds a package by query string
 *
 * @param {String}     q      Query string
 *
 * @exports node-opkg.find
 * @return {Promise}
 */
function findPackage(q) {
  return new Promise((resolve, reject) => {
    listPackages('available').then((packages) => {
      resolve(packages.filter((p) => {
        return p.Package.toLowerCase().indexOf(q) !== -1 ||
          p.Description.toLowerCase().indexOf(q) !== -1;
      }));
    }).catch(reject);
  });
}

/**
 * Sets the `opkg` executable path
 *
 * @param {String}  path  Path to executable
 *
 * @exports node-opkg.setExecPath
 */
function setExecPath(path) {
  BIN = path;
}

///////////////////////////////////////////////////////////////////////////////
// EXPORTS
///////////////////////////////////////////////////////////////////////////////

module.exports.setExecPath = setExecPath;
module.exports.update = updateList;
module.exports.upgrade = upgradePackage;
module.exports.install = installPackage;
module.exports.configure = configurePackage;
module.exports.remove = removePackage;
module.exports.flag = flagPackage;
module.exports.list = listPackages;
module.exports.listAvailable = listAvailablePackages;
module.exports.listInstalled = listInstalledPackages;
module.exports.listUpgradable = listUpgradablePackages;
module.exports.changedConffiles = listChangedConfigurations;
module.exports.files = listPackageFiles;
module.exports.search = findPackageByFile;
module.exports.info = packageInfo;
module.exports.status = packageStatus;
module.exports.find = findPackage;

// TODO
//module.exports.download
//module.exports.compareVersions
//module.exports.printArchitecture
//module.exports.whatDepends
//module.exports.whatDependsRec
//module.exports.whatProvides
//module.exports.whatConflicts
//module.exports.whatReplaces

