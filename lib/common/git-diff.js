'use strict';

const path = require('path');
const LCL = require('last-commit-log');

const getCurrentBranch = ({
  cwd: gitDir,
}) => {
  const lcl = new LCL(gitDir);
  const commit = lcl.getLastCommitSync();
  return commit.gitBranch;
};

exports.getCurrentBranch = getCurrentBranch;

exports.getDiffData = ({
  cwd,
  currentBranch,
  targetBranch,
}) => {
  const { diff } = LCL;
  const diffMap = diff({
    targetBranch,
    currentBranch,
    cwd,
  });
  const newDiffMap = {};
  for (const filePath in diffMap) {
    const newFilePath = path.join(cwd, filePath);
    newDiffMap[newFilePath] = diffMap[filePath];
  }
  return newDiffMap;
};
