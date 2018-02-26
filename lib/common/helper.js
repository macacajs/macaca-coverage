'use strict';

const fs = require('fs');
const path = require('path');
const util = require('xutil');
const xml2map = require('xml2map');
const child_process = require('child_process');

const logger = require('./logger');
const pkg = require('../../package');

const _ = Object.assign({}, util);

_.exec = cmd => {
  logger.debug(`execute command: ${cmd}`);
  const res = child_process.execSync(cmd, {
    maxBuffer: 1000 * 1024,
    stdio: [
      'pipe',
      'pipe',
      'ignore'
    ],
    cwd: process.cwd()
  }).toString().trim();
  logger.debug(res);
  return res;
};

_.getBin = cmd => {
  try {
    return _.exec(`which ${cmd}`);
  } catch (e) {
    logger.info(`please confirm ${cmd} is installed, ${_.chalk.underline.white(pkg.homepage)}`);
    logger.error(`command not found: ${cmd}`);
  }
};

_.writeJSONFileFromXMLFile = (xmlFile, distDir) => {
  const basename = path.basename(xmlFile).split('.')[0];
  const content = fs.readFileSync(xmlFile, 'utf8');
  const json = xml2map.tojson(content);
  const str = JSON.stringify(json, null, 2);
  _.mkdir(distDir);
  fs.writeFileSync(path.join(distDir, `${basename}.json`), str);
};

module.exports = _;
