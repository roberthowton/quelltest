import React from 'react';
import Graphiql from './Graphiql.jsx';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

const Main = () => {
  const fetcher = createGraphiQLFetcher({
    url: '/graphql',
  });

  return (
    <div className="main">
      <Graphiql fetcher={fetcher} />
    </div>
  );
};

export default Main;
