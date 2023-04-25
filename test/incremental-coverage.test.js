'use strict';

const path = require('path');
const assert = require('assert');
const { incrementalReporter } = require('../lib/web/incremental-coverage');
const cwd = process.cwd();

describe('./test/incremental-coverage.test.js', () => {

  const newDiffMap = {};
  const newCoverageMap = {};
  const test1 = path.join(cwd, 'test/fixture/report/test1.js');
  const test2 = path.join(cwd, 'test/fixture/report/test2.js');
  const test3 = path.join(cwd, 'test/fixture/report/test3.js');
 
  before('before', () => {
    const diffMap = require('./fixture/test-coverage-diff.json');
    const coverageMap = require('./fixture/test-coverage-final.json');
    
    for (const file in diffMap) {
      const filePath = path.join(cwd, file);
      newDiffMap[filePath] = diffMap[file];
    }

    for (const file in coverageMap) {
      const filePath = path.join(cwd, file);
      newCoverageMap[filePath] = coverageMap[file];
    }
  })
  it('incremental coverage should work', () => {
    const incrementalMap = incrementalReporter(newCoverageMap, newDiffMap, {
      cwd,
      output: path.join(cwd, 'test/fixture/report'),
    });
    assert.equal(incrementalMap.coverage[test1].s[1], 1);
    assert.equal(incrementalMap.coverage[test2], undefined);
    assert.equal(incrementalMap.coverage[test3], undefined);
  });

  it('incremental summary should work', () => {

    let incrementalMap = incrementalReporter(newCoverageMap, newDiffMap, {
      cwd,
      output: path.join(cwd, 'test/fixture/report'),
    });
    const summary1 = incrementalMap.summary[test1];
    assert.equal(summary1.statements.cover, 11);
    assert.equal(summary1.statements.total, 12);
    assert.equal(summary1.branchs.cover, 2);
    assert.equal(summary1.branchs.total, 4);
    assert.equal(summary1.functions.cover, 4);
    assert.equal(summary1.functions.total, 6);

    const summary2 = incrementalMap.summary[test2];
    assert.equal(summary2, undefined);

    // needCollectedIncludes config
    incrementalMap = incrementalReporter(newCoverageMap, newDiffMap, {
      cwd,
      needCollectedIncludes: ['**/test2.js'],
      output: path.join(cwd, 'test/fixture/report'),
    });

    const summary3 = incrementalMap.summary[test2];
    assert.equal(summary3.statements.cover, 0);
    assert.equal(summary3.statements.total, 32);
    assert.equal(summary3.branchs.cover, 0);
    assert.equal(summary3.branchs.total, 0);
    assert.equal(summary3.functions.cover, 0);
    assert.equal(summary3.functions.total, 0);

  });

  it('incremental reporter should work', () => {
     const incrementalMap = incrementalReporter(newCoverageMap, newDiffMap, {
      cwd,
      needCollectedIncludes: ['**/test2.js', '**/test4.js'],
      output: path.join(cwd, 'test/fixture/report'),
    });

    const reg = /<td class="coverage-percent".*>\d+%<\/td>/g;
    let list = incrementalMap.reporterHtml.match(reg) || [];
    assert.equal(list.length, 3);
    assert(list[0].includes('75%'));
    assert(list[1].includes('92%'));
    assert(list[2].includes('0%'));
  });
});
