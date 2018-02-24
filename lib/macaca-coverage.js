'use strict';

const pkg = require('../package');
const logger = require('./common/logger');

const defaultOptions = {
  version: pkg.version,
  runtime: 'web'
};

module.exports = (options = {}) => {
  const config = Object.assign(defaultOptions, options);
  config.runtime = config.runtime.toLowerCase();
  logger.debug(config);

  try {
    const mod = require(`./${config.runtime}`);
    return mod(config);
  } catch (e) {
    logger.warn(e.stack);
  }
};
