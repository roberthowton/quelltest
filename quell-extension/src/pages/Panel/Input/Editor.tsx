import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror-graphql/lint';
// import 'codemirror-graphql/hint';
import 'codemirror-graphql/mode';
import { validateSchema } from 'webpack';
import Button from '@mui/material/Button';

const Editor = (props) => {
  const [defaultText, setText] = useState('# Enter GraphQL query here\n\n\n\n');

  const handleClickSubmit = () => {
    const query = props.queryString;
    const address = `${props.serverAddress}${props.graphQLRoute}`;
    fetch(address, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
              query: query,
              operationName: undefined,
              variables: null
            })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        props.setResults(data);
      })
      .catch(err => console.log(err));
  }

  return (
    <React.Fragment>
      <CodeMirror
        value={defaultText}
        options={{
          theme: 'material',
          lineNumbers: true,
          mode: 'graphql',
          // lint: {
          //   schema: props.schema,
          // },
          lint: false,
          hintOptions: {
            schema: props.schema,
          },
        }}
        onBeforeChange={(editor, data, value) => {
          setText(value);
        }}
        // sends Query to parent componet to be processed by
        onChange={(editor, data, value) => {
          props.setQueryString(value);
        }}
      />
      <div>
        <Button onClick={handleClickSubmit}>Submit Query</Button>
      </div>
    </React.Fragment>
  );
};

export default Editor;
