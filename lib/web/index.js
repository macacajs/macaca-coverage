'use strict';

const {
  EOL
} = require('os');
const fs = require('fs');
const path = require('path');
const istanbul = require('macaca-istanbul');

const _ = require('../common/helper');
const logger = require('../common/logger');

const defaultOptions = {
};

const {
  Collector,
  Reporter
} = istanbul;

module.exports = (options = {}) => {
  const config = Object.assign(defaultOptions, options);
  logger.debug(`${EOL}${JSON.stringify(config, null, 0)}`);

  const collector = new Collector();

  if (config.file) {
    const file = path.resolve(config.file);
    if (_.isExistedFile(file)) {
      logger.debug(`file is set to: ${file}`);
      let content = fs.readFileSync(file, 'utf8');
      let json = JSON.parse(content);
      collector.add(json);
    }
  } else {
  }

  if (config.html) {
    config.html = path.resolve(config.html);
    _.mkdir(config.html);
    const htmlReporter = new Reporter(null, config.html);
    htmlReporter.addAll([
      'html'
    ]);
    htmlReporter.write(collector, true, () => {
      logger.info(`HTML report generated: ${_.chalk.white.underline(config.html)}`);
    });
  }

  if (config.json) {
    config.json = path.resolve(config.json);
    const jsonReporter = new Reporter(null, config.json);
    jsonReporter.addAll([
      'json'
    ]);
    jsonReporter.write(collector, true, (e) => {
      logger.info(`JSON report generated: ${_.chalk.white.underline(config.json)}`);
    });
  }

  return {
    Collector,
    Reporter,
    collector
  };
};
