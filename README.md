[![npm][npm]][npm-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200"
    src="https://cdn.worldvectorlogo.com/logos/eslint.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>ESLint Config Webpack</h1>
  <p>Provides Webpacks's .eslintrc as an extensible shared config.<p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D eslint-config-webpack
```

<h2 align="center">Usage</h2>

Webpack's eslint config contains all of our ESLint rules, including ECMAScript 6+ and is similar to [Airbnb's ESLint base rules](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base). It requires `eslint` and `eslint-plugin-import`.

<h2 align="center">eslint setup</h2>

_In your .eslintrc.js || .yml || .json add ..._

```js
// Add to your .eslintrc

"extends": "webpack"
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/@webpack-contrib/eslint-config-webpack.svg
[npm-url]: https://npmjs.com/package/@webpack-contrib/eslint-config-webpack
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack
[test]: http://img.shields.io/travis/webpack-contrib/eslint-config-webpack.svg
[test-url]: https://travis-ci.org/webpack-contrib/eslint-config-webpack
[cover]: https://coveralls.io/repos/github/webpack-contrib/eslint-config-webpack/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/webpack-contrib/eslint-config-webpack?branch=master
