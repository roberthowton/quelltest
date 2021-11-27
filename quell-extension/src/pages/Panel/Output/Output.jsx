import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');


const Output = (props) => {
  const results = props.results;
  
  return(
    <CodeMirror
      value={results}
      options={{
        lineNumbers: true,
        lint:true,
        mode:'graphql'
      }}  
      onBeforeChange={(editor, data, value) => {
        setText({value}); console.log(value);
      }}

    />
  );
};

export default Output;