# `useCellRangeSelection`

- Plugin Hook
- Optional

`useCellRangeSelection` is the hook that allows **cell selection and cell range selection**.

### Usage

- `Mouse drag` - Click the mouse and drag to select a `cell range` and this will clear any existing selected cells/ranges

- `Ctrl + Mouse drag` - Holding `Ctr` and `Mouse drag` will select `multiple cell ranges` and this keeps all existing selected cells/ranges

- `Ctrl + click` - For cell selection and this keeps all existing selected cells/ranges

### Table Options

The following options are supported via the main options object passed to `useTable(options)`

- `cellIdSplitBy: String`
  - **Optional**
  - This string is used to overwrite cell Id as `column Id + cellIdSplitBy + row Id`
  - By default `cellIdSplitBy` is `_col_row_` where cell Id's are generated as `column Id + '_col_row_' + row Id`
- `initialState.selectedCellIds: Object<cellId: Boolean>`
  - **Optional**
  - Defaults to `{}`
  - If a cell's ID is set to `true` in this object, it will have a selected state

### Instance Properties

The following values are provided to the table `instance`:

- `state.selectedCellIds: Object<cellId: Boolean(true)>`

  - `selectedCellIds` is a state that contains all selected cell Ids except current **selecting** range, once current selecting range is finished it moves to `selectedCellIds`
  - More info: User performs range selection as `start selection` -> `currently selecting` -> `end selection`. Now `selectedCellIds` contains all cell Ids except the cell Ids which fall under `currently selecting`

- `state.currentSelectedCellIds: Object<cellId: Boolean(true)>`

  - `currentSelectedCellIds` is a state that contains cell Ids of `currently selecting range`. It is a state when user is currently performing range selection
  - More info: User performs range selection as `start selection` -> `currently selecting` -> `end selection`. Now `currentSelectedCellIds` is a state which contains `currently selecting` cell Ids
  - Once user ends selection, `currentSelectedCellIds` are moved to `state.selectedCellIds`, It is handled by hook itself

- `state.isSelectingCells: Boolean`

  - State which tells whether user is performing range selection
  - Defaults to false

- `cellsById: Object<cellId: cell>`

  - This Object map has mapping of cell Id to it's cell instance
    - Can be used to get cell value to further make any calculations. (for example: Finding average value of selected cells)

- `setSelectedCellIds: Function( Object<cellId: Boolean> )`

  - Use this function to set `selectedCellIds` state

- `getCellsBetweenId: Function( startCellId, endCellId ) => Object<cellId: Boolean(true)>`
  - This function is used to get all cells between start cell Id and end cell Id
    - This is helpful when getting all cells that falls under a specific range and then setState `selectedCellIds` via `setSelectedCellIds`. More info and demo available in the `cell-range-selection` example

### Example

- [Source](https://github.com/gargroh/react-table-plugins/tree/master/examples/cell-range-selection)
- [Open in CodeSandbox](https://codesandbox.io/s/github/gargroh/react-table-plugins/tree/master/examples/cell-range-selection)
