import React from 'react'

import { actions, makePropGetter, functionalUpdate } from 'react-table'

actions.cellRangeSelectionStart = 'cellRangeSelectionStart'
actions.cellRangeSelecting = 'cellRangeSelecting'
actions.cellRangeSelectionEnd = 'cellRangeSelectionEnd'
actions.setSelectedCellIds = 'setSelectedCellIds' // exposed to user on an instance

const defaultCellIdSplitBy = '___'

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
    dispatch,
  } = instance

  const start = (event, startCell) => {
    dispatch({ type: actions.cellRangeSelectionStart, startCell, event })

    // Attaching mouse up on document, so that cell selection ends when user releases `mouse` outside table
    const mouseUpEvt = () => {
      end(event, cell.id)
      document.removeEventListener('mouseup', mouseUpEvt)
    }
    document.addEventListener('mouseup', mouseUpEvt)
  }

  const selecting = (event, selectingEndCell) =>
    dispatch({ type: actions.cellRangeSelecting, selectingEndCell, event })

  const end = (event, endCell) =>
    dispatch({ type: actions.cellRangeSelectionEnd, endCell, event })

  return [
    props,
    {
      onMouseDown: e => {
        e.persist() // avoid event-pooling
        start(e, cell.id)
      },
      onMouseEnter: e => {
        if (isSelectingCells) {
          e.persist()
          selecting(e, cell.id)
        }
      },
    },
  ]
}

// currentSelectedCellIds: Is for currently selected range
// selectedCellIds: Contains all selected cells
// On cellRangeSelectionEnd: we move currentSelectedCellIds to selectedCellIds
function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      ...state,
      selectedCellIds: { ...instance.initialState.selectedCellIds },
      isSelectingCells: false,
      startCellSelection: null,
      endCellSelection: null,
      currentSelectedCellIds: {},
    }
  }

  if (action.type === actions.cellRangeSelectionStart) {
    const { startCell, event } = action

    let newState = { ...state.selectedCellIds }

    if (event.ctrlKey) {
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
      selectedCellIds: { ...newState },
      isSelectingCells: true,
      startCellSelection: startCell,
    }
  }

  if (action.type === actions.cellRangeSelecting) {
    const { selectingEndCell } = action
    const {
      state: { startCellSelection },
      getCellsBetweenId,
    } = instance

    // Get cells between cell ids (range)
    let newState = getCellsBetweenId(startCellSelection, selectingEndCell)

    return {
      ...state,
      endCellSelection: selectingEndCell,
      currentSelectedCellIds: newState,
    }
  }

  if (action.type === actions.cellRangeSelectionEnd) {
    const {
      state: { selectedCellIds, currentSelectedCellIds },
    } = instance

    return {
      ...state,
      selectedCellIds: { ...selectedCellIds, ...currentSelectedCellIds },
      isSelectingCells: false,
      currentSelectedCellIds: {},
      startCellSelection: null,
      endCellSelection: null,
    }
  }

  if (action.type === actions.setSelectedCellIds) {
    const selectedCellIds = functionalUpdate(
      action.selectedCellIds,
      state.selectedCellIds
    )

    return {
      ...state,
      selectedCellIds: selectedCellIds,
    }
  }
}

function useInstance(instance) {
  const {
    dispatch,
    allColumns,
    rows,
    cellIdSplitBy = defaultCellIdSplitBy,
    cellsById = {},
    state: { selectedCellIds, currentSelectedCellIds },
  } = instance

  // Creating `currentIndex` so as to know what the correct index of row after other operations like filter, sort etc
  React.useMemo(() => {
    rows.forEach((row, index) => {
      row.currentIndex = index
    })
  }, [rows])

  const setSelectedCellIds = React.useCallback(
    selectedCellIds => {
      return dispatch({
        type: actions.setSelectedCellIds,
        selectedCellIds,
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
        cellsById[startCell].row.currentIndex,
        cellsById[endCell].row.currentIndex,
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
            let id = selectedRows[i] + cellIdSplitBy + selectedColumns[j]
            let cell = cellsById[id]
            // sometimes cell cannot be found - reason -> may be prepareRow of that row has beed skipped due to large scrolling of segment
            if (cell) {
              cellsBetween[cell.id] = true
            }
          }
        }
      }

      return cellsBetween
    },
    [allColumns, cellsById, cellIdSplitBy, rows]
  )

  Object.assign(instance, {
    cellIdSplitBy,
    getCellsBetweenId,
    cellsById,
    allSelectedCellIds: { ...currentSelectedCellIds, ...selectedCellIds },
    setSelectedCellIds,
  })
}

function prepareRow(row, { instance: { cellsById, cellIdSplitBy }, instance }) {
  row.allCells.forEach(cell => {
    cell.id = row.id + cellIdSplitBy + cell.column.id
    cellsById[cell.id] = cell
    cell.getCellRangeSelectionProps = makePropGetter(
      instance.getHooks().getCellRangeSelectionProps,
      { instance: instance, row, cell }
    )
  })
}
