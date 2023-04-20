'use strict';

const LCL = require('last-commit-log');

module.exports = async (dir, targetBranch) => {
  try {
    const lcl = new LCL(dir);
    const { diff } = LCL;
    return await lcl
      .getLastCommit()
      .then((commit) => {
        const diffMap = diff({
          targetBranch,
          currentBranch: commit.gitBranch,
        });
        return diffMap || {};
      });
  } catch (error) {
    throw error;
  }
};

