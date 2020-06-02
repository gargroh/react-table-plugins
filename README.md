# react-table-plugins

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
