'use strict';

const assert = require('assert');
const incrementalCoverage = require('../lib/core/incremental-coverage');

describe('./test/incremental-coverage.test.js', () => {

  it('incremental coverage should work', () => {

    const diffMap = require('./fixture/test-coverage-diff.json');
    const coverageMap = require('./fixture/test-coverage-final.json');

    const incrementalMap = incrementalCoverage(coverageMap, diffMap);

    assert.equal(incrementalMap.coverage['/root/demo/app/coverage_test1.js'].s[1], 1);
    assert.equal(incrementalMap.coverage['/root/demo/app/coverage_test2.js'], undefined);
    assert.equal(incrementalMap.coverage['/root/demo/app/coverage_test3.js'], undefined);

    const summary1 = incrementalMap.summary['/root/demo/app/coverage_test1.js'];
    assert.equal(summary1.statements.cover, 11);
    assert.equal(summary1.statements.total, 12);
    assert.equal(summary1.branchs.cover, 2);
    assert.equal(summary1.branchs.total, 4);
    assert.equal(summary1.functions.cover, 4);
    assert.equal(summary1.functions.total, 6);

    const summary2 = incrementalMap.summary['/root/demo/app/coverage_test2.js'];
    assert.equal(summary2.statements.cover, 0);
    assert.equal(summary2.statements.total, 32);
    assert.equal(summary2.branchs.cover, 0);
    assert.equal(summary2.branchs.total, 0);
    assert.equal(summary2.functions.cover, 0);
    assert.equal(summary2.functions.total, 0);
  });
});
