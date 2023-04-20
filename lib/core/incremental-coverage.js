'use strict';

const incrementalStatements = (coverage = {}, diff = []) => {

  let total = 0;
  let cover = 0;

  if (!coverage.path) {
    for (const lines of diff) {
      total += lines[1] - lines[0] + 1;
    }
  } else {
    const s = coverage.s;
    const statementMap = coverage.statementMap;
    for (const lines of diff) {
      for (const index in statementMap) {
        const startLine = statementMap[index].start.line;
        if (startLine >= lines[0] && startLine <= lines[1]) {
          if (s[index]) {
            cover += 1;
          }
          total += 1;
        }
      }
    }
  }

  return {
    cover,
    total,
  };
};

const incrementalFunctions = (coverage = {}, diff = []) => {

  let total = 0;
  let cover = 0;
  const f = coverage.f;
  const fnMap = coverage.fnMap;

  for (const lines of diff) {
    for (const index in fnMap) {
      const startLine = fnMap[index].loc.start.line;
      const endLine = fnMap[index].loc.end.line;
      if (startLine >= lines[0] && startLine <= lines[1]) {
        if (f[index]) {
          cover += 1;
        }
        total += 1;
      } else if (endLine >= lines[0] && endLine <= lines[1]) {
        if (f[index]) {
          cover += 1;
        }
        total += 1;
      }
    }
  }

  return {
    cover,
    total,
  };
};

const incrementalBranches = (coverage = {}, diff = []) => {

  let total = 0;
  let cover = 0;
  const b = coverage.b;
  const branchMap = coverage.branchMap;

  for (const lines of diff) {
    for (const index in branchMap) {
      const locations = branchMap[index].locations;
      for (const locationsIndex in locations) {
        const startLine = branchMap[index].loc.start.line;
        const endLine = branchMap[index].loc.end.line;
        if (startLine >= lines[0] && startLine <= lines[1]) {
          if (b[index][locationsIndex]) {
            cover += 1;
          }
          total += 1;
        } else if (endLine >= lines[0] && endLine <= lines[1]) {
          if (b[index][locationsIndex]) {
            cover += 1;
          }
          total += 1;
        }
      }
    }
  }

  return {
    cover,
    total,
  };
};

module.exports = {
  incrementalStatements,
  incrementalBranches,
  incrementalFunctions,
};
