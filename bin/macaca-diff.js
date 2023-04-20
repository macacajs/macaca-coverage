'use strict';

const fs = require('fs');
const program = require('commander');
const getDiff = require('../lib/core/diff');

program
  .option('-t, --targetBranch [String]', 'Run locally.', 'master')
  .option('-o, --output [String]', 'Diff save path.', 'coverage-diff.json');

program.action(async (option) => {

  try {

    const cwd = process.cwd();
    const output = option.output;
    const targetBranch = option.targetBranch;

    const diffMap = await getDiff(cwd, targetBranch);

    fs.writeFileSync(output, JSON.stringify(diffMap, null, 2));

  } catch (error) {
    throw (error);
  }
});

program.parse(process.argv);

