import React, { useState, useEffect, useMemo, cloneElement } from 'react';
import { useRowState, useTable } from 'react-table';
import beautify from 'json-beautify';
import Metrics from './Metrics';

const Network = ({ graphQLRoute, clientAddress, clientRequests } = props) => {
  // useEffect(() => {
  //   console.log('CRs: ', clientRequests)
     
  //   console.log('requests: ', requests)
  // }, [clientRequests]);

  return(
        <React.Fragment>
          <h2>Client Quell Requests</h2>
          <div id="network-page-container">
            <div id="network-request-table">
              <NetworkRequestTable clientRequests={clientRequests}/>
              {/* <TableTest /> */}
            </div>
            <div id="network-request-metrics">
              <Metrics 
                fetchTime={clientRequests[clientRequests.length - 1].time.toFixed(2)}
                fetchTimeInt={clientRequests.map(request => request.time)}
              />
            </div>
          </div>
        </React.Fragment>
        )
};

const NetworkRequest = (props) => {

  const { index, req } = props;

  return (
    <details>
      <summary>{index + 1}. {req.request.url}</summary>
      <p>Test</p>
    </details>
  )

}

const NetworkRequestTable = ({ clientRequests } = props) => {
  
  const columns = useMemo(
    () => [
      {
        id: 'query-type',
        Header: 'Query Type',
        accessor: row => Object.keys(JSON.parse(row.request.postData.text))
      },
      {
        id: 'url',
        Header: 'URL',
        accessor: row => row.request.url
      },
      {
        id: 'status',
        Header: 'Status',
        accessor: row => row.response.status
      },
      {
        id: 'size',
        Header: 'Size (kB)',
        accessor: row => (row.response.content.size / 1000).toFixed(2)
      },
      {
        id: 'time',
        Header: 'Time (ms)',
        accessor: row => row.time.toFixed(2)
      }
    ],
    [])

    const data = useMemo(
      () => [...clientRequests],
      [])

      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
      } = useTable({ columns, data })

  return (
    <>
    <p>Total Client Requests: {clientRequests.length}</p>
    {/* <div>
     {clientRequests.map((req, index) => <NetworkRequest key={index} req={req} index={index} />)}
   </div> */}

    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>


   </>
  )
}

export default Network;
