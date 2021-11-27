const path = require('path');
const express = require('express');
const app = express();
const QuellCache = require('../quell/quell-server/src/quell');

const PORT = 3000;

// Make sure redis is running by either:
// 1. running `redis-server` and `npm server` in this directory in a separate terminal instances, or:
// 2. run `npm run server-redis` in this directory
const REDIS_PORT = 6379;

const schema = require('./controllers/starWarsGQL');

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

const quellCache = new QuellCache(schema, REDIS_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/graphql', quellCache.query, (req, res) => {
  console.log('request: ', req.body);
  return res.status(200).send(res.locals.queryResponse);
});

app.get('/clearCache', quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

module.exports = app;
