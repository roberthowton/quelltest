const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const path = require('path');
const QuellCache = require('@quell/server');

const app = express();

// Allow cross-origin
app.use(cors());

app.use(express.json());

const quellCache = new QuellCache(schema, 6379, 300000);

// WARNING: if you get the error: "TypeError: Cannot read property '_fields' of undefined", 
// insert the following code into line 483 of node_modules/quell/server/src/quell.js:
// 
// if (!schema.mutation) return null;

// WARNING: Requires redis-server to be run in terminal on (default) port 6397 (should be handled by `npm run dev`)

app.use(
  '/graphql',
  quellCache.query, (req, res) => {
   return res.status(200).send(res.locals.queryResponse); 
  }
  // graphqlHTTP({
  //   schema,
  //   graphiql: true
  // })
);

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
