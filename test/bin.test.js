#!/usr/bin/env node
'use strict';

const assert = require('assert');
const pkg = require('../package.json');
const lock = require('../package-lock.json');

const requiredBins = ['deepseek', 'deepseek-cli'];
const lockBins = (lock.packages && lock.packages[''] && lock.packages[''].bin) || {};

for (const name of requiredBins) {
  assert(pkg.bin && pkg.bin[name], `package.json bin is missing "${name}"`);
  assert(lockBins[name], `package-lock.json root bin is missing "${name}"`);
}

console.log('ok: bin exposes', requiredBins.join(', '));
