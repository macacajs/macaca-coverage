#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;
const program = require('commander');
const Coverage = require('..');
const _ = require('lodash');
const mkdirp = require('mkdirp').sync;
const { getCurrentBranch, getDiffData } = require('../lib/common/git-diff');
const { writeIncrementalReporter } = require('../lib/web/incremental-coverage');
const logger = require('../lib/common/logger');

const pkg = require('../package.json');
const cwd = process.cwd();

program
  .option('-f, --file <s>', 'coverage file')
  .option('-v, --versions', 'output version infomation')
  .usage('')
  .action(options => {
    if (options.versions) {
      console.info(`${EOL} ${pkg.version} ${EOL}`);
      process.exit(0);
    }

    if (options.file) {
      const {
        collector,
        Reporter,
      } = Coverage({
        runtime: 'web',
      });
      const coverageFile = path.resolve(program.file);
      const __coverage__ = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
      collector.add(__coverage__);
      const distDir = path.join(cwd, `coverage_${Date.now()}`);
      const reporter = new Reporter(null, distDir);
      reporter.addAll([
        'html',
        'lcov',
        'json',
      ]);
      reporter.write(collector, true, () => {
        const coverageHtml = path.join(distDir, 'index.html');
        console.log(coverageHtml);
      });
    } else {
      program.help();
    }
  });

program
  .command('diff')
  .description('generage diff')
  .option('--current-branch [String]', 'current git branch name')
  .option('--target-branch [String]', 'target git branch name')
  .option('--coverage-json-file [String]', 'existed coverage json file')
  .option('--output [String]', 'output directory.')
  .action(async (cmdOptions) => {
    const defaultOptions = {
      currentBranch: getCurrentBranch({ cwd }),
      targetBranch: 'master',
      coverageJsonFile: path.resolve(cwd, 'coverage/coverage-final.json'),
      output: path.resolve(cwd, 'coverage'),
      cwd,
    };

    // step1, get options
    const options = Object.assign(defaultOptions, _.pick(cmdOptions, [
      'currentBranch',
      'targetBranch',
      'coverageJsonFile',
      'output',
    ]));
    options.coverageJsonFile = path.resolve(cwd, options.coverageJsonFile);
    options.output = path.resolve(cwd, options.output);
    mkdirp(options.output);
    logger.info('diff command options:\n%j', options);

    // step2, generate git diff json
    const diffData = getDiffData(options);
    const diffDataFilePath = path.resolve(options.output, 'diff-data.json');
    logger.info('gen diff data: %s', diffDataFilePath);
    fs.writeFileSync(diffDataFilePath, JSON.stringify(diffData, null, 2));

    // step3, generate diff reporter
    writeIncrementalReporter(diffData, options);
  });

program.parse(process.argv);

