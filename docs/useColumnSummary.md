# `useColumnSummary`

- Plugin Hook
- Optional

`useColumnSummary` is the hook that helps in **displaying/calculating column summary**.

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `initialState.columnSummary: { [columnId: string]: string }`

  - Must be memoized

- `disableColumnSummary: Bool`

  - Disables column summary at table level.

- `columnSummaryFns: Object<key: summaryType>`
  - Must be memoized
  - Allows overriding or adding additional summary types for columns to use. If a column's summary type isn't found on this object, it will default to using the built-in summary types.
  - Used to add custom keys of column summary logic

### Column Options

The following options are supported on any `Column` object passed to the `columns` options in `useTable()`

- `disableColumnSummary: Bool`

  - Optional
  - Defaults to `false`
  - If set to `true`, this column will not have summary

- `columnSummaryFn: String | Function`

  - Optional
  - Defaults to text
  - The resolved function from the this string/function will be used to calculate summary of this column.
  - If a string is passed, the function with that name located on either the custom columnSummaryFns opti on or the built -in columnSummaryFns types object will be used.
  - If a function is passed, it will be used directly.
  - For more information on this check examples
  - If a function is passed, it must be memoized
  - Defaults to `count`

- `ColumnSummary: Function | React.Component => JSX`
  - Required
  - Receives the table instance and column model as props
  - Must return valid JSX
  - This function (or component) is used to render column's summary UI

### Instance Properties

The following values are provided to the table `instance`:

- `setColumnSummary: Function(allColumnSummaries: { [columnId: string]: string })`

  - Sets summary for all columns

### Column Properties

The following properties are available on every `Column` object returned by the table instance.

- `setColumnSummary: Function(summaryType: string)`

  - Sets summary type for the given column

- `hasColumnSummary: Bool`
  - Denotes whether a column is has summary or not.

### Example

- [Source](https://github.com/gargroh/react-table-plugins/tree/master/examples/column-summary)
- [Open in CodeSandbox](https://codesandbox.io/s/github/gargroh/react-table-plugins/tree/master/examples/column-summary)
