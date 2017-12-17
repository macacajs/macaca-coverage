'use strict';

const istanbul = require('macaca-istanbul');

const defaultOptions = {
  runtime: 'web'
};

module.exports = (options = {}) => {
  const config = Object.assign(defaultOptions, options);
  console.log(config);

  return {
    Collector: istanbul.Collector,
    Reporter: istanbul.Reporter,
    collector: new istanbul.Collector()
  };
};
