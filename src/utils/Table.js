import { Checkbox } from '@material-ui/core';
import React from 'react';
import { useTable, useRowSelect } from 'react-table';

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows
  } = useTable(
    { 
      columns,
      data
    }, 
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => {
          return [
            {
              id:'selection',
              Header: ({getToggleAllRowsSelectedProps}) => (
                <Checkbox {...getToggleAllRowsSelectedProps()}/>
              ),
              Cell:({row}) => (
                <Checkbox {...row.getToggleRowSelectedProps()}/>
              )
            },
            ...columns
          ]
        })
      }
    )

  const firstPageRows = rows.slice(0,10);

  return (
    <>
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {firstPageRows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
    <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows:selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre>
  </>
  )
}

export default Table;