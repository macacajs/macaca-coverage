'use strict';

const minimatch = require('minimatch');
const assert = require('power-assert');
const {
  renderIncrementalReporter,
  getIncrementalCoverage,
} = require('../lib/web/incremental-coverage');

describe('./test/incremental-coverage.test.js', () => { 
  const test1 = 'test/fixture/report/test1.js';
  const test2 = 'test/fixture/report/test2.js';
  const test3 = 'test/fixture/report/test3.js';
  const diffMap = require('./fixture/test-coverage-diff.json');
  const coverageMap = require('./fixture/test-coverage-final.json');

  describe('getIncrementalCoverage()', () => {
    let res;

    it('should be ok', () => {
      res = getIncrementalCoverage(coverageMap, diffMap);
      assert.equal(res.coverage[test1].s[1], 1);
      assert.deepEqual(res.coverage[test2], undefined);
      assert.deepEqual(res.coverage[test3], undefined);

      const summary1 = res.summary[test1];
      assert.equal(summary1.statements.cover, 11);
      assert.equal(summary1.statements.total, 12);
      assert.equal(summary1.branchs.cover, 2);
      assert.equal(summary1.branchs.total, 4);
      assert.equal(summary1.functions.cover, 4);
      assert.equal(summary1.functions.total, 6);
    });

    it('filter should be ok', () => {
      res = getIncrementalCoverage(coverageMap, diffMap, (currentFile) => {
        return [
          '**/test2.js',
          '**/test4.js'
        ].some(reg => minimatch(currentFile, reg));
      });
      assert.equal(res.coverage[test1].s[1], 1);
      assert.deepEqual(res.coverage[test2], undefined);
      assert.deepEqual(res.coverage[test3], undefined);

      const summary1 = res.summary[test1];
      assert.equal(summary1.statements.cover, 11);
      assert.equal(summary1.statements.total, 12);
      assert.equal(summary1.branchs.cover, 2);
      assert.equal(summary1.branchs.total, 4);
      assert.equal(summary1.functions.cover, 4);
      assert.equal(summary1.functions.total, 6);

      const summary2 = res.summary[test2];
      assert.equal(summary2.statements.total, 32);
      assert.equal(summary2.branchs.cover, 0);
      assert.equal(summary2.branchs.total, 0);
      assert.equal(summary2.functions.cover, 0);
      assert.equal(summary2.functions.total, 0);
    });
  });

  describe('renderIncrementalReporter()', () => {
    let res;
    const cwd = process.cwd();

    it('should be ok', () => {
      res = getIncrementalCoverage(coverageMap, diffMap, (currentFile) => {
        return [
          '**/test2.js',
          '**/test4.js'
        ].some(reg => minimatch(currentFile, reg));
      });
      res = renderIncrementalReporter(res, { cwd, output: cwd });
      const reg = /<td class="coverage-percent".*>\d+%<\/td>/g;
      res = res.match(reg) || [];
      assert.equal(res.length, 3);
      assert(res[0].includes('75%'));
      assert(res[1].includes('92%'));
      assert(res[2].includes('0%'));
    });
  });
});
