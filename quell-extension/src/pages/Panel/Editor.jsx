import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';

const Editor = (props) => {

  const[defaultText, setText] = useState("Enter GraphQL query here\n\n\n\n");
  
  return(
    <CodeMirror
      value={defaultText}
      options={{
        lineNumbers: true,
        lint:true,
        mode:'graphql'
      }}  
      onBeforeChange={(editor, data, value) => {
        setText({value}); console.log(value);
      }}
      onChange={(editor, data, value) => {
        props.queriedText(value);
      }}
    />
  );
};

export default Editor;