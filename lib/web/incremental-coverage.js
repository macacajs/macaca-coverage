'use strict';

const path = require('path');
const Coverage = require('../macaca-coverage');
const minimatch = require('minimatch');
const {
  Collector,
  Reporter,
} = Coverage({
  runtime: 'web',
});
const reporterTemplate = require('./template/reporter-template');

const _incrementalStatements = (coverage = {}, diff = []) => {

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

const _incrementalFunctions = (coverage = {}, diff = []) => {

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

const _incrementalBranches = (coverage = {}, diff = []) => {

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


const incrementalCoverage = (coverageMap = {}, diffMap = [], options = {}) => {

  const summary = {};
  const coverage = {};
  const { cwd, needCollectedIncludes = [] } = options;

  for (const file in diffMap) {

    if (!diffMap[file]?.length) continue;
    if (!coverageMap[file]) {
      try {
        const relativePath = path.relative(cwd, file);
        const match = needCollectedIncludes.filter(reg => minimatch(relativePath, reg));
        if (!match.length) continue;
      } catch (error) {
        continue;
      }
    } else {
      coverage[file] = coverageMap[file];
    }

    const statements = _incrementalStatements(coverageMap[file], diffMap[file]);
    const branchs = _incrementalBranches(coverageMap[file], diffMap[file]);
    const functions = _incrementalFunctions(coverageMap[file], diffMap[file]);

    if (!statements.total && !branchs.total && !functions.total) continue;

    summary[file] = {
      statements,
      branchs,
      functions,
    };
  }

  return {
    coverage,
    summary,
  };
};

const incrementalReporter = (coverageMap = {}, diffMap = [], options = {}) => {

  const incrementalMap = incrementalCoverage(coverageMap, diffMap, options);
  const { coverage, summary } = incrementalMap;

  // create coverage reporter
  try {
    const collector = new Collector();
    collector.add(coverage);
    const reporter = new Reporter(null, options.output);
    reporter.addAll([
      'html',
      'json',
    ]);
    reporter.write(collector,
      { incrementalMap: diffMap },
      () => {});
  } catch (error) {
    console.log(error);
  }

  // incremental coverage summary
  const reporterHtml = reporterTemplate(summary, options);
  return {
    coverage,
    summary,
    reporterHtml,
  };
};


module.exports = {
  incrementalCoverage,
  incrementalReporter,
};
