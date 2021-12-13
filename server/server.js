const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
// const QuellCache = require('../../quell/quell-server/src/quell');
const QuellCache = require('../Quell/quell-server/src/quell')

const PORT = 3000;

// Make sure redis is running by either:
// 1. running `redis-server` and `npm server` in this directory in a separate terminal instances, or:
// 2. run `npm run server-redis` in this directory
const REDIS_PORT = 6379;

const schema = require('./controllers/starWarsGQL');

app.use(cors());

const quellCache = new QuellCache(schema, REDIS_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options('/graphql', cors());
app.use('/graphql', cors(), quellCache.query, (req, res) => {
  console.log(res.locals.queryResponse)
  return res.status(200).send(res.locals.queryResponse);
});

app.options('/redis', cors());
app.use('/redis', ...quellCache.getRedisInfo({
  getStats: true,
  getKeys: true,
  getValues: true
}))

// app.use('/redis', cors(), quellCache.getStatsFromRedis, quellCache.getRedisKeys, quellCache.getRedisValues, (req, res) => {
//   res.locals.redisStats.keys = res.locals.keys;
//   res.locals.redisStats.values = res.locals.values;
//   // console.log('redis stats: ', res.locals.redisStats);
//   return res.status(200).send(res.locals.redisStats);
// });

app.options('/clearCache', cors());
app.get('/clearCache', cors(), quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.use((req, res) =>
res.status(404).send("This is not the page you're looking for...")
);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
