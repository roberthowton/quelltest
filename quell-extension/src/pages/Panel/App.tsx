import React, { useState, useEffect, useRef } from 'react';
import * as fs from 'fs';
// Components for extension
import Client from './Input/Client';
import Output from './Components/Output';
import Server from './Input/Server';
import Metrics from './Components/Metrics';
import Management from './Management/Management';
import Editor from './Components/Editor';
import Network from './Components/Network';
import styles from './App.scss';
// Material UI
/* import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import { Tabs, Tab, getContainerUtilityClass } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@emotion/react';
import theme from './theme'; */
import Logo from './assets/Quell_full_size.png';

// GraphQL
import { getIntrospectionQuery, buildClientSchema } from 'graphql';
import Settings from './Components/Settings';

// Sample clientRequest data for building Network component
import data from './data/sampleClientRequests';

const App = () => {
  // queried data results
  const [results, setResults] = useState({});
  const [schema, setSchema] = useState({});
  const [queryString, setQueryString] = useState<string>('');
  const [graphQLRoute, setGraphQLRoute] = useState<string>('/graphQL');
  const [clientAddress, setClientAddress] = useState<string>('http://localhost:8080');
  const [serverAddress, setServerAddress] = useState<string>('http://localhost:3000');
  const [redisAddress, setRedisAddress] = useState<string>('http://localhost:6379');
  const [clearCacheRoute, setClearCacheRoute] = useState<string>('/clearCache');
  const [queryResponseTime, setQueryResponseTime] = useState<number[]>([]);
  const [clientRequests, addClientRequests] = useState(data);
  // changes tab - defaults to query
  const [tabName, setActiveTab] = useState<string>('query');

  const handleTabChange = (clickedTab:string) => {
    setActiveTab(clickedTab);
    console.log('clicked',clickedTab);
  };

  // grabbing the time to query results and rounding to two digits
  const logNewTime = (recordedTime:number) => {
    setQueryResponseTime(
      queryResponseTime.concat(Number(recordedTime.toFixed(2)))
    );
  };

  // 
  useEffect(() => {
    const introspectionQuery = getIntrospectionQuery();
    const address = `${serverAddress}${graphQLRoute}`;
    fetch(address, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: introspectionQuery,
        operationName: 'IntrospectionQuery',
        variables: null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const schema = buildClientSchema(data.data);
        setSchema(schema);
      })
      .catch((err) => console.log(err));
  }, [clientAddress, serverAddress, graphQLRoute]);

  return (
    <div className="devtools">
      <div id="navbar">
        <img id="logo-img" src={Logo} alt="quell logo" />

        <button 
          id="queryButton" 
          className="navbutton"
          style={tabName==='query' ? {backgroundColor:"#333"} : {}} 
          onClick={() => handleTabChange('query')}>
          Query
        </button>
        
        <button 
          id="networkButton" 
          className="navbutton" 
          style={tabName==='network' ? {backgroundColor:"#333"} : {}} 
          onClick={() => handleTabChange('network')}>
          Network
        </button>
        
        <button 
          id="cacheButton" 
          className="navbutton" 
          style={tabName==='cache' ? {backgroundColor:"#333"} : {}} 
          onClick={() => handleTabChange('cache')}>
          Cache
        </button>

        <button 
          id="settingsButton" 
          className="navbutton" 
          style={tabName==='settings' ? {backgroundColor:"#333"} : {}} 
          onClick={() => handleTabChange('settings')}>
          Settings
        </button>

      </div>
        {tabName === 'query' && 
          <div className="queryTab">
            <span className='queryInput resizable'>
              <Editor
                clientAddress={clientAddress}
                serverAddress={serverAddress}
                graphQLRoute={graphQLRoute}
                queryString={queryString}
                setQueryString={setQueryString}
                setResults={setResults}
                schema={schema}
                logNewTime={logNewTime}
                clearCacheRoute={clearCacheRoute}
              />
            </span>
          
            <span className='queryResult resizable'>
              <Output results={results} />
            </span>

            <span className='metricsOutput resizable'>
              <Metrics
                fetchTime={queryResponseTime[queryResponseTime.length - 1]}
                cacheStatus={'Yes'}
                cacheClearStatus={'No'}
                fetchTimeInt={queryResponseTime}
              />
            </span>
          </div>
        }
        
        {tabName === 'network' && 
          <div className="networkTab">
            <Network
              graphQLRoute={graphQLRoute}
              clientAddress={clientAddress}
              clientRequests={clientRequests}
            />
          </div>
        }

        {tabName === 'cache' && 
          <div className="cacheTab">
            <div>cache</div>
          </div>
        }

        {tabName === 'settings' &&  
          <div className="settingsTab">
            <Settings 
              graphQLRoute={graphQLRoute}
              setGraphQLRoute={setGraphQLRoute}
              clientAddress={clientAddress}
              setClientAddress={setClientAddress}
              serverAddress={serverAddress}
              setServerAddress={setServerAddress}
              redisAddress={redisAddress}
              setRedisAddress={setRedisAddress}
              schema={schema}
              setSchema={setSchema}
              clearCacheRoute={clearCacheRoute}
              setClearCacheRoute={setClearCacheRoute}
            />
          </div>
        }
    </div>
  );
};

export default App;
