import React from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { useCellRangeSelection } from "react-table-plugins";
import makeData from "./makeData";

const Styles = styled.div`
  padding: 1rem;

  table {
    height: 200px;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  table,
  pre {
    float: left;
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // currentSelectedCellIds: cells of a current selected range
    // selectedCellIds: All previously selected cells
    state: { selectedCellIds, currentSelectedCellIds },
    // getCellsBetweenId (Fn): Pass two cell Ids to get all cell Ids between them
    getCellsBetweenId,
    setSelectedCellIds,
    cellsById,
  } = useTable(
    {
      columns,
      data,
      // cellIdSplitBy (string): Cell id is split by column.id + cellIdSplitBy + row.id
      cellIdSplitBy: "cols_rows",
      initialState: {
        selectedCellIds: {},
      },
    },
    useCellRangeSelection
  );

  let cellsSelected = { ...currentSelectedCellIds, ...selectedCellIds };

  // returns two random cell ids, this is just for the demo.
  const getRandomCellIds = React.useCallback(() => {
    let cloneCellIds = Object.keys(cellsById);
    let randomCellId = () =>
      cloneCellIds[(cloneCellIds.length * Math.random()) << 0];
    return [randomCellId(), randomCellId()];
  }, [cellsById]);

  // getCellsBetweenId returns all cell Ids between two cell Id, and then setState for selectedCellIds
  const selectRandomCells = React.useCallback(() => {
    const cellsBetween = getCellsBetweenId(...getRandomCellIds());
    setSelectedCellIds(cellsBetween);
  }, [getCellsBetweenId, setSelectedCellIds, getRandomCellIds]);

  return (
    <>
      <button onClick={selectRandomCells}>Select cells randomly</button>
      <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellRangeSelectionProps()}
                        {...cell.getCellProps()}
                        style={
                          cellsSelected[cell.id]
                            ? { backgroundColor: "#6beba8", userSelect: "none" }
                            : { backgroundColor: "white", userSelect: "none" }
                        }
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <pre>
          <code>
            {JSON.stringify(
              { selectedCellIds, currentSelectedCellIds },
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name1",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
        ],
      },
    ],
    []
  );

  const data = React.useMemo(() => makeData(20), []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
