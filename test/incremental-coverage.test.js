'use strict';

const assert = require('assert');
const { 
  incrementalStatements,
  incrementalBranches,
  incrementalFunctions 
} = require('../lib/core/incremental-coverage');


describe('./test/incremental-coverage.test.js', () => {

  it('incremental coverage should work', () => {
    const coverageSummary = {};
    const diffMap = require('./fixture/test-coverage-diff.json');
    const coverageMap = require('./fixture/test-coverage-final.json');

    for (const file in diffMap) {
      const statements = incrementalStatements(coverageMap[file], diffMap[file]);
      const branchs = incrementalBranches(coverageMap[file], diffMap[file]);
      const functions = incrementalFunctions(coverageMap[file], diffMap[file]);
      coverageSummary[file] = {
        statements,
        branchs,
        functions,
      };
    }

    const test1 = coverageSummary['/root/demo/app/coverage_test1.js'];
    assert.equal(test1.statements.cover, 11);
    assert.equal(test1.statements.total, 12);
    assert.equal(test1.branchs.cover, 2);
    assert.equal(test1.branchs.total, 4);
    assert.equal(test1.functions.cover, 4);
    assert.equal(test1.functions.total, 6);

    const test2 = coverageSummary['/root/demo/app/coverage_test2.js'];
    assert.equal(test2.statements.cover, 0);
    assert.equal(test2.statements.total, 32);
    assert.equal(test2.branchs.cover, 0);
    assert.equal(test2.branchs.total, 0);
    assert.equal(test2.functions.cover, 0);
    assert.equal(test2.functions.total, 0);
  });
});
