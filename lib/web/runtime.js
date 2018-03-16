'use strict';

const Coverage = require('../macaca-coverage');

const {
  collector,
  Reporter
} = Coverage({
  runtime: 'web'
});

const reporter = new Reporter();

exports.coverage = () => {
  if (typeof window === undefined) {
    console.log('require browser runtime');
    return;
  } else if (!window.__coverage__) {
    console.log('variable `__coverage__` not found');
    return;
  }

  collector.add(window.__coverage__);

  reporter.addAll([
    'html',
    'lcov'
  ]);

  setTimeout(() => {
    reporter.write(collector, true, () => {
    });
  }, 16);
};
