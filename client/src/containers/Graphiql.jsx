import React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { Quellify, lokiClientCache } from '../../../quell/quell-client/src/Quellify';
import { data } from 'browserslist';

const Graphiql = () => {
  const fetcher = createGraphiQLFetcher({
    url: '/graphql',
  });

  const debugFetcher = async (graphQLParams) => {
    const results = await fetcher(graphQLParams);
    console.log({results});
    return results;
  }

  const mutationMap = {
    addPerson: 'Person'
  };

  const map = {
    person: 'Person',
    people: 'Person'
  };

  const queryTypeMap = {
    person: 'Person',
    people: 'Person'
  };

  const qfetcher = async ({ query } = graphQLParams) => {
    console.log({query})
    const results = await Quellify(
      '/graphql',
      query,
      mutationMap,
      map,
      queryTypeMap
    )

    return results;
  };

  return (
    <div className="graphiql">
      <GraphiQL fetcher={qfetcher} />
    </div>
  );
};

export default Graphiql;
