import React, { useState, useEffect, useRef } from 'react';
// Components for extension
import Client from './Input/Client';
import Output from './Output/Output';
import Server from './Input/Server';
import Stats from './Stats/Stats';
import Management from './Management/Management';
import Editor from './Input/Editor';
import styles from './App.scss';
// Material UI
import Button from '@mui/material/Button';

const App = () => {
  // saving state to see if operating on client side or server side
  // 'true' for client-side and 'false' for server-side...
  const [dataOrigin, setOrigin] = useState(false);
  // queried data results
  const [results, setResults] = useState({});
  const [schema, setSchema] = useState({});
  const [queryString, setQueryString] = useState('');
  const [graphQLRoute, setGraphQLRoute] = useState('/graphQL');
  const [clientAddress, setClientAddress] = useState('http://localhost:8080')
  const [serverAddress, setServerAddress] = useState('http://localhost:3000')

  // const queriedText = results => {
  //   setResults(results);
  // };

  return (
    <div className="panel">
      <Button mode="dark" id="client-side" onClick={() => setOrigin(true)}>
        Client
      </Button>
      <Button mode="dark" id="server-side" onClick={() => setOrigin(false)}>
        Server
      </Button>
      <div className="main_container">
        <div className="query_input segmented_wrapper">
          <div>Queries</div>
          <div>
            <Editor
              clientAddress={clientAddress}
              serverAddress={serverAddress}
              graphQLRoute={graphQLRoute}
              setGraphQLRoute={setGraphQLRoute}
              queryString={queryString}
              setQueryString={setQueryString}
              setResults={setResults}
              schema={schema}
            />
          </div>
          {/* {dataOrigin ? <Client /> : <Server />} */}
          <Management />
        </div>
        <div className="query_output segmented_wrapper">
          <div>Queried Results</div>
          <Output results={results} />
        </div>
        <div className="query_stats segmented_wrapper">
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default App;
