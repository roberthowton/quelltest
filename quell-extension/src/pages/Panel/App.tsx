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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import Logo from './assets/quell-logo-horiz.png';

// GraphQL
import { getIntrospectionQuery, buildClientSchema } from 'graphql';

const App = () => {
  // saving state to see if operating on client side or server side
  // 'true' for client-side and 'false' for server-side...
  const [dataOrigin, setOrigin] = useState(false);
  // queried data results
  const [results, setResults] = useState({});
  const [schema, setSchema] = useState({});
  const [queryString, setQueryString] = useState('');
  const [graphQLRoute, setGraphQLRoute] = useState('/graphQL');
  const [clientAddress, setClientAddress] = useState('http://localhost:8080');
  const [serverAddress, setServerAddress] = useState('http://localhost:3000');

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
    <ThemeProvider theme={theme}>
      <div className="panel">
        <div id="navbar">
          <img id="logo" src={Logo} alt="quell logo" />
        </div>
        {/* <Button id="client-side" onClick={() => setOrigin(true)}>
          Client
        </Button>
        <Button id="server-side" onClick={() => setOrigin(false)}>
          Server
        </Button> */}
        <div className="main_container">
          <div className="query_input segmented_wrapper">
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
            <Stats />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
