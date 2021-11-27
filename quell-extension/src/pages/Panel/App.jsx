import React, { useState, useEffect, useRef } from 'react';
// Components for extension
import Client from './Client/Client.jsx';
import Output from './Output/Output.jsx';
import Server from './Server/Server.jsx';
import Stats from './Stats/Stats.jsx';
import Management from './Management/Management.jsx';
import Editor from './Editor.jsx';

const App = () => {
  // saving state to see if operating on client side or server side
  // 'true' for client-side and 'false' for server-side...
  const [dataOrigin, setOrigin] = useState(true);
  // queried data results
  const [results, setResults] = useState('');
  
  const queriedText = results => {
    setResults(results);
  };

  return (
    <div className="panel">
      <button id="client-side" onClick={() => setOrigin(true)}>Client</button>
      <button id="server-side" onClick={() => setOrigin(false)}>Server</button>
      <div className="main_container">
        <div className="query_input segmented_wrapper">
          <div>Queries</div>
          <Editor queriedText={queriedText}/> 
          {dataOrigin ? <Client /> : <Server />}
          <Management />
        </div>
        <div className="query_output segmented_wrapper">
          <div>Queried Results</div>
          <Output results={results}/>
        </div>
        <div className="query_stats segmented_wrapper">
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default App;