'use strict';

const {
  EOL
} = require('os');
const path = require('path');
const chalk = require('chalk');

const helper = require('../common/helper');
const logger = require('../common/logger');

const defaultOptions = {
};

// http://www.jacoco.org/jacoco/trunk/doc/cli.html

const jacocoJarPath = path.join(__dirname, 'jacococli.jar');

module.exports = (options = {}) => {
  const config = Object.assign(defaultOptions, options);
  logger.debug(`${EOL}${JSON.stringify(config, null, 0)}`);

  const list = [
    helper.getBin('java'),
    '-jar',
    jacocoJarPath,
    'report'
  ];

  if (config.file) {
    const file = path.resolve(config.file);
    if (helper.isExistedFile(file)) {
      logger.debug(`file is set to: ${file}`);
      list.push(file);
    }
  } else {
  }

  if (config.source) {
    const source = path.resolve(config.source);
    if (helper.isExistedDir(source)) {
      logger.debug(`source is set to: ${source}`);
      list.push('--sourcefiles');
      list.push(source);
    } else {
    }
  } else {
  }

  if (config.classfiles) {
    const classfiles = path.resolve(config.classfiles);
    if (helper.isExistedDir(classfiles)) {
      logger.debug(`classfiles is set to: ${classfiles}`);
      list.push('--classfiles');
      list.push(classfiles);
    } else {
    }
  } else {
  }

  if (config.html) {
    config.html = path.resolve(config.html);
    helper.mkdir(config.html);
    list.push('--html');
    list.push(config.html);

    const cmd = list.join(' ');
    helper.exec(cmd);
    logger.info(`HTML report generated: ${chalk.white.underline(config.html)}`);
  }

  if (config.xml || config.json) {
    const xmlDir = path.resolve(config.xml || config.json);
    helper.mkdir(xmlDir);
    list.push('--xml');
    const xmlFile = path.join(xmlDir, 'coverage.xml');
    list.push(xmlFile);

    const cmd = list.join(' ');
    helper.exec(cmd);

    if (config.xml) {
      config.xml = path.resolve(config.xml);
      logger.info(`XML report generated: ${chalk.white.underline(config.xml)}`);
    }

    if (config.json) {
      config.json = path.resolve(config.json);
      helper.writeJSONFileFromXMLFile(xmlFile, config.json);
      logger.info(`JSON report generated: ${chalk.white.underline(config.json)}`);
    }
  }
};

