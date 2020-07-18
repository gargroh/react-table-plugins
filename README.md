# react-table-plugins
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This repository contains miscellaneous [react-table](https://github.com/tannerlinsley/react-table) v7 plugins

<a href="#badge"><img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg"></a>

## Installation

Install as a dependency using `npm` or `yarn`

```bash
# NPM
$ npm install react-table-plugins

# Yarn
$ yarn add react-table-plugins
```

To import React Table Plugins:

```js
import {
  useExportData
  ...
} from 'react-table-plugins'
```

Plug it in same way as other react-table plugins are used:

```diff
function MyTable() {
  const instance = useTable(
    {
      data,
      columns,
    },
+   useExportData
  )
}
```

## Documentation

- [useExportData](./docs/useExportData.md) - Exporting data from table

## Examples

- Export Data
  - [Source](https://github.com/gargroh/react-table-plugins/tree/master/examples/export-data)
  - [Open in CodeSandbox](https://codesandbox.io/s/github/gargroh/react-table-plugins/tree/master/examples/export-data)

## ChangeLog

Please visit [releases](https://github.com/gargroh/react-table-plugins/releases)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/gargroh"><img src="https://avatars3.githubusercontent.com/u/42495927?v=4" width="100px;" alt=""/><br /><sub><b>Rohit Garg</b></sub></a><br /><a href="https://github.com/gargroh/react-table-plugins/commits?author=gargroh" title="Code">💻</a> <a href="#example-gargroh" title="Examples">💡</a> <a href="#plugin-gargroh" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/gargroh/react-table-plugins/pulls?q=is%3Apr+reviewed-by%3Agargroh" title="Reviewed Pull Requests">👀</a> <a href="#tool-gargroh" title="Tools">🔧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!