import React, { useState, useEffect, useMemo, cloneElement } from 'react';
import { useRowState, useTable } from 'react-table';
import beautify from 'json-beautify';
import Metrics from './Metrics';
import SplitPane from 'react-split-pane';

const Network = ({ graphQLRoute, clientAddress, clientRequests } = props) => {
  const [clickedRowData, setClickedRowData] = useState(clientRequests[0])
  
  const [activeRow, setActiveRow] = useState<number>(-1);
 



  useEffect(() => {
    console.log('CRs: ', clientRequests)
    console.log('Clicked Row Data: ', clickedRowData)
     
  }, [clientRequests, clickedRowData]);

  return(
        <React.Fragment>
          <div style={{fontSize:'1.25rem', fontWeight:'bolder'}}>Client Quell Requests</div>    
          <div style={{fontSize:'.75rem'}}>Total Client Requests: {clientRequests.length}</div>
          <div id="network-page-container">
            <div id="network-request-table">
              <NetworkRequestTable clientRequests={clientRequests} setClickedRowData={setClickedRowData} setActiveRow={setActiveRow} activeRow={activeRow}/>
            </div>
            <div id="network-request-metrics">
              {activeRow > -1 ? 
                <div id="headerBox"><RequestDetails clickedRowData={clickedRowData} /></div>:
                <Metrics 
                  fetchTime={clientRequests[clientRequests.length - 1].time.toFixed(2)}
                  fetchTimeInt={clientRequests.map(request => request.time)}
                />
              }
            </div>
          </div> 
        </React.Fragment>
        )
};

const RequestDetails = ({ clickedRowData } = props) => {
  return (
    <>
      <h3>Request Headers</h3>
      {clickedRowData.request.headers.map((header, index) => <p key={`req-header-${index}`}><b>{header.name}</b>: {header.value}</p>)}
      <hr />
      <h5>Response Headers</h5>
      {clickedRowData.response.headers.map((header, index) => <p key={`res-header-${index}`}><b>{header.name}</b>: {header.value}</p>)}
    </>
  )
  
}

const NetworkRequestTable = ({ clientRequests, setClickedRowData, setActiveRow, activeRow } = props) => {
  const handleRowClick = (cell) => {
    // const { request.headers, response.headers } = cell.row.original;
    setClickedRowData(cell.row.original);
  }
  
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
      } = useTable({columns, data })

  return (
    <>
    {/* <div>
     {clientRequests.map((req, index) => <NetworkRequest key={index} req={req} index={index} />)}
   </div> */}
    <div id="dataTable_container">
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
                  <td 
                    style={activeRow===cell.row.id ? {backgroundColor:'red'} : {}}
                    {...cell.getCellProps()}
                    onClick={()=> {
                      console.log(cell.row.id);
                      if (activeRow !== cell.row.id) setActiveRow(cell.row.id);
                      else (setActiveRow(-1));
                      handleRowClick(cell);
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
    </div>


   </>
  )
}

export default Network;
