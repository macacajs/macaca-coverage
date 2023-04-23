#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const EOL = require('os').EOL;
const program = require('commander');
const Coverage = require('..');
const getDiff = require('../lib/core/diff');
const summaryTemplate = require('../lib/template/summary-template');
const { incrementalReporter } = require('../lib/core/incremental-coverage');

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
      process.exit(0);
    }
  });

program
  .command('diff')
  .description('Get diff')
  .option('-c, --currentBranch [String]', 'current branch.', null)
  .option('-t, --targetBranch [String]', 'target branch.', 'master')
  .option('-o, --output [String]', 'diff save path.', 'coverage-diff.json')
  .action(async (option) => {

    const output = option.output;
    const currentBranch = option.currentBranch;
    const targetBranch = option.targetBranch;

    const diffMap = await getDiff(cwd, currentBranch, targetBranch);
    const newDiffMap = {};
    for (const file in diffMap) {
      const filePath = path.join(cwd, file);
      newDiffMap[filePath] = diffMap[file];
    }

    console.info(`diff path: ${output}`);

    fs.writeFileSync(output, JSON.stringify(newDiffMap, null, 2));
  });

program
  .command('incremental-reporter')
  .description('Get incremental reporter')
  .option('-c, --coveragePath [String]', 'coverage path.', 'coverage/coverage-final.json')
  .option('-d, --diffPath [String]', 'diff path.', 'coverage-diff.json')
  .option('-o, --output [String]', 'reporter path.', 'coverage')
  .action(async (option) => {

    const output = path.join(cwd, option.output);
    const summaryHtmlpath = path.join(output, 'summary.html');
    const diffPath = path.join(cwd, option.diffPath);
    const coveragePath = path.join(cwd, option.coveragePath);
    console.info(`diff path: ${diffPath}`);
    console.info(`coverage path: ${coveragePath}`);

    const diffMap = require(diffPath);
    const coverageMap = require(coveragePath);

    const incrementalMap = incrementalReporter(coverageMap, diffMap, {
      projectPath: cwd,
      needCollectedIncludes: process.env.INCREMENTAL_NEED_COLLECTED_INCLUDES || [],
      reporterPath: output,
    });

    console.info(incrementalMap);
    console.info(`reporter: ${output}`);
    console.info(`summary: ${summaryHtmlpath}`);
    fs.writeFileSync(summaryHtmlpath, summaryTemplate(incrementalMap.reporterHtml));
  });

program.parse(process.argv);

