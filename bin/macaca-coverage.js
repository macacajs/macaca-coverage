#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;
const program = require('commander');
const Coverage = require('..');

const pkg = require('../package.json');
const cwd = process.cwd();

program
  .option('-f, --file <s>', 'coverage file')
  .option('-v, --versions', 'output version infomation')
  .usage('');

program.parse(process.argv);

if (program.versions) {
  console.info(`${EOL} ${pkg.version} ${EOL}`);
  process.exit(0);
}

if (program.file) {
  const {
    collector,
    Reporter
  } = Coverage({
    runtime: 'web'
  });
  const coverageFile = path.resolve(program.file);
  const __coverage__ = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
  collector.add(__coverage__);
  const distDir = path.join(cwd, `coverage_${Date.now()}`);
  const reporter = new Reporter(null, distDir);
  reporter.addAll([
    'html',
    'lcov',
    'json'
  ]);
  reporter.write(collector, true, () => {
    const coverageHtml = path.join(distDir, 'index.html');
    console.log(coverageHtml);
  });
} else {
  program.help();
  process.exit(0);
}
