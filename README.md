# react-table-plugins

This repository contains miscellaneous [react-table](https://github.com/tannerlinsley/react-table) v7 plugins

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
