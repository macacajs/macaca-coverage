'use strict';

const fs = require('fs');
const path = require('path');

const getFilePath = (dir, fileName) => {
  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) {
    const f = fileName.substr(fileName.indexOf(path.sep) + 1);
    if (f === fileName) return;
    const _filePath = getFilePath(dir, f);
    if (_filePath) return _filePath;
  } else {
    return filePath;
  }
};

const renderReporter = (summary, options = {}) => {
  const { cwd, output, reporterUrl } = options;

  const rowCoverList = [];
  const rowNotCoverList = [];

  for (const name in summary) {
    const statements = summary[name].statements;
    if (!statements.total) continue;
    const statementsPercent = `${(statements.cover / statements.total * 100).toFixed()}`;

    const relativePath = path.relative(cwd, name);
    const fileCoveragePath = getFilePath(output, `${relativePath}.html`) || '';

    if (!fileCoveragePath) {
      const rowStr = `
      <tr style="display:table-row; color:#858585; font-weight:bold;">
        <td>${relativePath}</td>
        <td>${statements.total}</td>
        <td>${statements.total}</td>
        <td class="coverage-percent">${statementsPercent}%</td>
      </tr>`;
      rowNotCoverList.push(rowStr);
    } else {
      const reportUrl = `${reporterUrl || '.'}/${fileCoveragePath.substr(output.length + 1)}`;
      const notCovNum = statements.total - statements.cover;
      let backgroundColor = '#FCDDE1';
      const percent = Number(statementsPercent) || 0;
      if (percent >= 50 && percent < 80) {
        backgroundColor = '#FFF2BA';
      } else if (percent >= 80) {
        backgroundColor = '#E2F3CA';
      }
      const rowStr = `
      <tr style="display:table-row; font-weight:bold; background-color:${backgroundColor}">
        <td><a href="${reportUrl}" target="view_window">${relativePath}</a></td>
        <td>${statements.total}</td>
        <td>${notCovNum}</td>
        <td class="coverage-percent">${percent}%</td>
      </tr>`;
      rowCoverList.push({
        percent,
        tr: rowStr.trim(),
      });
    }
  }

  rowCoverList.sort((a, b) => {
    return a.percent - b.percent;
  });

  let content = '';
  rowCoverList.map(row => {
    content += row.tr;
  });
  content += rowNotCoverList.join('');

  return `
  <table>
    <tr style="display:table-row; font-weight:bold; background-color:#F1F0F0;">
      <td>file</td>
      <td>incremental</td>
      <td>uncovered</td>
      <td>coverage</td>
    </tr>
    ${content}
  </table>`;
};

module.exports = renderReporter;
