const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const app = express();
// const QuellCache = require('../quell/quell-server/src/quell');
const QuellCache = require('@quell/server');

const PORT = 3000;

// Make sure redis is running by either:
// 1. running `redis-server` and `npm server` in this directory in a separate terminal instances, or:
// 2. run `npm run server-redis` in this directory
const REDIS_PORT = 6379;

const starWarsController = require('./controllers/starWarsController');
const schema = require('./controllers/starWarsGQL');

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

const quellCache = new QuellCache(schema, REDIS_PORT);

// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   graphiql: true
// }))

app.use(express.json());

app.use('/graphql', quellCache.query, (req, res) => {
  return res.status(200).send(res.locals.queryResponse);
});

app.get('/clearCache', quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.get('/', starWarsController.getCharacters, (req, res) =>
  res.status(200).json(res.locals.characters)
);

app.get('/species', starWarsController.getSpecies, (req, res) =>
  res.status(200).json(res.locals.species)
);

app.get('/homeworld', starWarsController.getHomeworld, (req, res) =>
  res.status(200).json(res.locals.homeworld)
);

app.get('/film', starWarsController.getFilm, (req, res) =>
  res.status(200).json(res.locals.filmData)
);

app.post('/character', starWarsController.addCharacter, (req, res) =>
  res.status(200).json({})
);

app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

module.exports = app;
