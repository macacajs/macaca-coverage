'use strict';

const istanbul = require('macaca-istanbul');

const defaultOptions = {
  runtime: 'web'
};

module.exports = (options = {}) => {
  const config = Object.assign(defaultOptions, options);
  console.log(config);

  const {
    Collector,
    Reporter
  } = istanbul;

  return {
    Collector,
    Reporter,
    collector: new istanbul.Collector()
  };
};
