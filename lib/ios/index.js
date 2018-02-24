'use strict';

const {
  EOL
} = require('os');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const _ = require('../common/helper');
const logger = require('../common/logger');

const defaultOptions = {
};

// https://github.com/SlatherOrg/slather

module.exports = (options = {}) => {
  const config = Object.assign(defaultOptions, options);
  logger.debug(`${EOL}${JSON.stringify(config, null, 0)}`);
  const list = [
    _.getBin('slather'),
    'coverage'
  ];

  let xmlDir;

  if (config.xml || config.json) {
    list.push('-x');
    list.push('--output-directory');
    xmlDir = path.resolve(config.xml || config.json);
    _.mkdir(xmlDir);
    list.push(xmlDir);
  } else {
    list.push('--html');
  }

  if (config.name) {
    logger.debug(`name of scheme is set to: ${config.name}`);
    list.push('--scheme');
    list.push(config.name);
  } else {
  }

  if (config.project) {
    const project = path.resolve(config.project);
    if (_.isExistedDir(project)) {
      logger.debug(`Xcode project is set to: ${project}`);
      list.push(project);
    } else {
    }
  } else {
  }

  if (xmlDir) {
    let cmd = list.join(' ');
    _.exec(cmd);

    if (config.xml) {
      config.xml = path.resolve(config.xml);
      logger.info(`XML report generated: ${_.chalk.white.underline(config.xml)}`);
    }

    if (config.json) {
      config.json = path.resolve(config.json);
      const files = fs.readdirSync(xmlDir);
      const firstFile = path.join(xmlDir, files[0]);
      _.writeJSONFileFromXMLFile(firstFile, path.resolve(config.json));
      logger.info(`JSON report generated: ${_.chalk.white.underline(config.json)}`);
    }
  }

  if (config.html) {
    config.html = path.resolve(config.html);
    _.mkdir(config.html);
    if (xmlDir) {
      list.splice(2, 2);
      list[2] = '--html';
    }
    let cmd = list.join(' ');
    _.exec(cmd);
    const htmlDir = path.join(process.cwd(), 'html');

    if (_.isExistedDir(htmlDir)) {
      shell.mv(htmlDir, config.html);
    }

    logger.info(`HTML report generated: ${_.chalk.white.underline(config.html)}`);
  }
};

