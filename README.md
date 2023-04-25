# macaca-coverage

[![NPM version][npm-image]][npm-url]
[![build status][CI-image]][CI-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-coverage.svg
[npm-url]: https://npmjs.org/package/macaca-coverage
[CI-image]: https://github.com/macacajs/macaca-coverage/actions/workflows/ci.yml/badge.svg
[CI-url]: https://github.com/macacajs/macaca-coverage/actions/workflows/ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/macacajs/macaca-coverage.svg?logo=codecov
[codecov-url]: https://app.codecov.io/gh/macacajs/macaca-coverage
[node-image]: https://img.shields.io/badge/node.js-%3E=_16-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-coverage.svg
[download-url]: https://npmjs.org/package/macaca-coverage

> Macaca coverage tool

## Use as CLI

Install Macaca command-line tool form npm

```bash
$ npm i macaca-coverage -g
```

Sample:

```bash
# step1, checkout a new branch
$ git checkout -b new/branch
# step2, modify code and commit ...
# step3, run testcase
$ npm i
$ npm run test
# step4, gen diff reporter
$ ./bin/macaca-coverage.js diff --target-branch master --coverage-json-file ./coverage/coverage-final.json --output ./test/temp
```

## Use as Node.js module

Install it form npm

```bash
$ npm i macaca-coverage --save-dev
```

```javascript
import Coverage from 'macaca-coverage';

const {
  collector,
  Reporter,
} = Coverage({
  runtime: 'web' // web, iOS, Android
});

const reporter = new Reporter();

collector.add(__coverage__);

reporter.addAll([
  'html',
  'lcov'
]);

reporter.write(collector, true, () => {
});
```

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/52845048?v=4" width="100px;"/><br/><sub><b>snapre</b></sub>](https://github.com/snapre)<br/>|
| :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Thu Apr 28 2022 14:59:00 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## License

The MIT License (MIT)
