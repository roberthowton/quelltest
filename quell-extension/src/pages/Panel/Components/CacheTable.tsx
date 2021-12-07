import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';

const CacheTable = () => {
  //use state to store data from redis server
  const [ redisStats, setRedisStats ] = useState([]);

  useEffect(() => {
    //  send fetch to redis route
     fetch('http://localhost:3000/redis')
     .then(response => response.json())
     .then(data => setRedisStats(data))
     .catch(error => console.log('error fetching from redis', error));
  },[])
  
  const RedisStatTable = ( {redisStats} = props) => {
    const output = [];
    const titles = Object.keys(redisStats);
    // Generates title bar
    output.push(
      <div className="statsColumns">{
        titles.map((el, i) => 
          <div key={i} 
            className='titleElements'>
            {el[0].toUpperCase() + el.slice(1)}
          </div>
        )
      }</div>
    );
    output.push(
      <div className="statsColumns">{
        titles.map(el => {
          const subTables = []
          for(let i in redisStats[el]){
            subTables.push(
              <div className='subStats'>
                <div style={{border:'1px solid #999', padding:'0 10px 0 10px'}}>{redisStats[el][i].name}</div>
                <div style={{border:'1px solid #999', padding:'0 10px 0 10px'}}>{redisStats[el][i].value}</div>
              </div>
            );
          }
          return subTables;
        })
      }</div>)
    return output;
  }


/*   const columns = useMemo(() => [
    {
      id: 'server',
      Header: 'Server',
      // accessor: row => row.server.map(stat => stat.name)
      columns: [{id: 'server-name', Header: 'Property', accessor: row => row.name)}, {id: 'server-value', Header: 'Value', accessor: row => row.value }]
    }, */
  //   {
  //   id: 'client-col',
  //   Header: 'Client',
  //   accessor: row => redisStats.client[0]
  //   // columns: [{},{}]
  // },fs
  // {
  //   id: 'mem-col',
  //   Header: 'Memory',
  //   accessor: row => redisStats.memory[0]
  //   // columns: [{},{}]
  // },
  // {
  //   id: 'stat-col',
  //   Header: 'Statistics',
  //   accessor: row => redisStats.stats[0]
  //   // columns: [{},{}]
  // }
  //], [])

/*   const data = useMemo(
    () => [...redisStats], []);
  console.log(data);
 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data }) */
  
  return (
    
    <>
    <div>
      <div><RedisStatTable redisStats={redisStats}/></div>
    </div>
   {/*  <p>Redis Database</p>
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
    </table> */}
   </>

  )
}
export default CacheTable
