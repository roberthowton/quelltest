import React, { useState, useEffect, useRef } from 'react';
// Components for extension
import Client from './Input/Client';
import Output from './Output/Output';
import Server from './Input/Server';
import Metrics from './Metrics/Metrics';
import Management from './Management/Management';
import Editor from './Input/Editor';
import styles from './App.scss';
// Material UI
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import { Tabs, Tab } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Logo from './assets/quell-logo-horiz.png';

// GraphQL
import { getIntrospectionQuery, buildClientSchema } from 'graphql';

const App = () => {
  // controls active tab
  const [activeTab, setActiveTab] = useState(0);
  // queried data results
  const [results, setResults] = useState({});
  const [schema, setSchema] = useState({});
  const [queryString, setQueryString] = useState('');
  const [graphQLRoute, setGraphQLRoute] = useState('/graphQL');
  const [clientAddress, setClientAddress] = useState('http://localhost:8080');
  const [serverAddress, setServerAddress] = useState('http://localhost:3000');
  const [queryResponseTime, setQueryResponseTime] = useState<number[]>([]);

  const logNewTime = (recordedTime: number) => {
    setQueryResponseTime(
      queryResponseTime.concat(Number(recordedTime.toFixed(2)))
    );
  };

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

  const handleTabChange = (event, clickedTab) => {
    setActiveTab(clickedTab);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="panel">
        <Box id="navbar">
          <div id="logo">
            <img id="logo-img" src={Logo} alt="quell logo" />
          </div>
          <Tabs centered={true} value={activeTab} onChange={handleTabChange}>
            <Tab label="Query" />
            <Tab label="Network" />
            <Tab label="Cache" />
            <Tab label="Settings" />
          </Tabs>
        </Box>
        <TabPanel value={activeTab} index={0}>
          <div className="main_container">
            <div className="query_input segmented_wrapper">
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
            <div className="query_output segmented_wrapper">
              <Box px={2}>
                <Output results={results} />
              </Box>
            </div>
            <div className="query_stats segmented_wrapper">
              <Metrics
                fetchTime={queryResponseTime[queryResponseTime.length - 1]}
                cacheStatus={'Yes'}
                cacheClearStatus={'No'}
                fetchTimeInt={queryResponseTime}
              />
            </div>
          </div>
        </TabPanel>

        {/* <div className="query_input segmented_wrapper">
            <Accordion disableGutters={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="query-accordion"
              >
                <Typography>Query</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="cache-accordion"
              >
                <Typography>Cache</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Button>View Cache</Button>
                <Button>Clear Cache</Button>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="settings-accordion"
              >
                <Typography>Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  id="outlined-basic"
                  label="GraphQL Endpoint"
                  variant="filled"
                />
                <TextField
                  id="outlined-basic"
                  label="Server Address"
                  variant="filled"
                />
                <TextField
                  id="outlined-basic"
                  label="Client Address"
                  variant="filled"
                />
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="query_output segmented_wrapper">
            <Box px={2}>
              <Output results={results} />
            </Box>
          </div>
          <div className="query_stats segmented_wrapper">
            <Metrics fetchTime={queryResponseTime[queryResponseTime.length-1]} cacheStatus={'Yes'} cacheClearStatus={'No'} fetchTimeInt = {queryResponseTime} />
          </div> */}
      </div>
    </ThemeProvider>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default App;
