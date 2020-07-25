import React from 'react'

import { actions, makePropGetter, functionalUpdate } from 'react-table'

actions.cellRangeSelectionStart = 'cellRangeSelectionStart'
actions.cellRangeSelecting = 'cellRangeSelecting'
actions.cellRangeSelectionEnd = 'cellRangeSelectionEnd'
actions.setSelectedCellIds = 'setSelectedCellIds' // exposed to user on an instance

export const useCellRangeSelection = hooks => {
  hooks.getCellRangeSelectionProps = [defaultgetCellRangeSelectionProps]
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

useCellRangeSelection.pluginName = 'useCellRangeSelection'

const defaultgetCellRangeSelectionProps = (props, { instance, cell }) => {
  const {
    state: { isSelectingCells },
    dispatch
  } = instance

  // These actions are not exposed on an instance, as we provide setSelectedCells and getCellsBetweenId.
  const start = (startCell, event) =>
    dispatch({ type: actions.cellRangeSelectionStart, startCell, event })
  const selecting = (selectingEndCell, event) =>
    dispatch({ type: actions.cellRangeSelecting, selectingEndCell, event })
  const end = (endCell, event) =>
    dispatch({ type: actions.cellRangeSelectionEnd, endCell, event })

  return [
    props,
    {
      onMouseDown: e => {
        e.persist() // event-pooling
        start(cell.id, e)
      },
      onMouseUp: e => {
        e.persist()
        end(cell.id, e)
      },
      onMouseEnter: e => {
        if (isSelectingCells) {
          e.persist()
          selecting(cell.id, e)
        }
      }
    }
  ]
}

// currentSelectedCellIds: Is for currently selected range
// selectedCellIds: Contains all selected cells
// On cellRangeSelectionEnd: we move currentSelectedCellIds to selectedCellIds
function reducer (state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      ...state,
      selectedCellIds: { ...instance.initialState.selectedCellIds } || {},
      isSelectingCells: false,
      startCellSelection: null,
      endCellSelection: null,
      currentSelectedCellIds: {}
    }
  }

  if (action.type === actions.cellRangeSelectionStart) {
    const { startCell, event } = action

    let newState = Object.assign(state.selectedCellIds, {})
    if (event.ctrlKey === true) {
      if (newState[startCell]) {
        delete newState[startCell]
      } else {
        newState[startCell] = true
      }
    } else {
      newState = {}
    }

    return {
      ...state,
      selectedCellIds:
        {
          ...newState
        } || {},
      isSelectingCells: true,
      startCellSelection: startCell
    }
  }

  if (action.type === actions.cellRangeSelecting) {
    const { selectingEndCell } = action
    const {
      state: { startCellSelection },
      getCellsBetweenId
    } = instance

    // Get cells between cell ids (range)
    let newState = getCellsBetweenId(startCellSelection, selectingEndCell)

    return {
      ...state,
      endCellSelection: selectingEndCell,
      currentSelectedCellIds: newState
    }
  }

  if (action.type === actions.cellRangeSelectionEnd) {
    const {
      state: { selectedCellIds, currentSelectedCellIds }
    } = instance

    return {
      ...state,
      selectedCellIds: { ...selectedCellIds, ...currentSelectedCellIds },
      isSelectingCells: false,
      currentSelectedCellIds: {},
      startCellSelection: null,
      endCellSelection: null
    }
  }

  if (action.type === actions.setSelectedCellIds) {
    const selectedCellIds = functionalUpdate(
      action.selectedCellIds,
      state.selectedCellIds
    )

    return {
      ...state,
      selectedCellIds: selectedCellIds
    }
  }
}

function useInstance (instance) {
  const { dispatch, allColumns, rows } = instance

  const cellsById = {}
  // make user control the cellIdSplitter
  const defaultCellIdSplitBy = '_col_row_'
  let cellIdSplitBy = instance.cellIdSplitBy || defaultCellIdSplitBy
  Object.assign(instance, { cellIdSplitBy })

  const setSelectedCellIds = React.useCallback(
    selectedCellIds => {
      return dispatch({
        type: actions.setSelectedCellIds,
        selectedCellIds
      })
    },
    [dispatch]
  )

  // Returns all cells between Range ( between startcell and endcell Ids)
  const getCellsBetweenId = React.useCallback(
    (startCell, endCell) => {
      if (!cellsById[startCell] || !cellsById[endCell]) {
        console.info({ startCell, endCell })
        throw new Error(
          `React Table: startCellId and endCellId has to be valid cell Id`
        )
      }

      // get rows and columns index boundaries
      let rowsIndex = [
        cellsById[startCell].row.index,
        cellsById[endCell].row.index
      ]
      let columnsIndex = []
      allColumns.forEach((col, index) => {
        if (
          col.id === cellsById[startCell].column.id ||
          col.id === cellsById[endCell].column.id
        ) {
          columnsIndex.push(index)
        }
      })

      // all selected rows and selected columns
      const selectedColumns = []
      const selectedRows = []
      for (
        let i = Math.min(...columnsIndex);
        i <= Math.max(...columnsIndex);
        i++
      ) {
        selectedColumns.push(allColumns[i].id)
      }
      for (let i = Math.min(...rowsIndex); i <= Math.max(...rowsIndex); i++) {
        selectedRows.push(rows[i].id)
      }

      // select cells
      const cellsBetween = {}
      if (selectedRows.length && selectedColumns.length) {
        for (let i = 0; i < selectedRows.length; i++) {
          for (let j = 0; j < selectedColumns.length; j++) {
            let id = selectedColumns[j] + cellIdSplitBy + selectedRows[i]
            let cell = cellsById[id]
            cellsBetween[cell.id] = true
          }
        }
      }

      return cellsBetween
    },
    [allColumns, cellsById, cellIdSplitBy, rows]
  )

  Object.assign(instance, {
    getCellsBetweenId,
    cellsById,
    setSelectedCellIds
  })
}

function prepareRow (
  row,
  { instance: { cellsById, cellIdSplitBy }, instance }
) {
  row.allCells.forEach(cell => {
    cell.id = cell.column.id + cellIdSplitBy + row.id
    cellsById[cell.id] = cell
    cell.getCellRangeSelectionProps = makePropGetter(
      instance.getHooks().getCellRangeSelectionProps,
      { instance: instance, row, cell }
    )
  })
}
