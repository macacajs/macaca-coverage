# macaca-coverage

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-coverage.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-coverage
[travis-image]: https://img.shields.io/travis/macacajs/macaca-coverage.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-coverage
[coveralls-image]: https://img.shields.io/coveralls/macacajs/macaca-coverage.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/macacajs/macaca-coverage?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-coverage.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-coverage

> Macaca coverage tool

## Use as CLI

Install Macaca command-line tool form npm

```bash
$ npm i macaca-cli -g
$ macaca coverage -h
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

## License

The MIT License (MIT)
