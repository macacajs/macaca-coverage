'use strict';

const LCL = require('last-commit-log');

module.exports = async (dir, currentBranch, targetBranch) => {
  const lcl = new LCL(dir);
  const { diff } = LCL;
  return await lcl
    .getLastCommit()
    .then((commit) => {
      const diffMap = diff({
        targetBranch,
        currentBranch: currentBranch || commit.gitBranch,
      });
      return diffMap || {};
    });
};

