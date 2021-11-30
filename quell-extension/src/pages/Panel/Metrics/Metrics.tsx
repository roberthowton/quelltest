import React, { useState, useEffect } from 'react';
import Trend from 'react-trend';

const Metrics = (props) => {
  const { 
    fetchTime, // time to fetch request
    cacheStatus, // whether query is added to cache
    cacheClearStatus, // whether cache is cleared
    fetchTimeInt, // array of time values at each point in fetching and caching
   } = props;

  return (
    <div id="metrics-container">
      <h3>Metrics:</h3>
      <div id="speed-metrics">
        <h2>{fetchTime}</h2>
        <div>Cache/Fetch Time: {cacheStatus}</div>
        <div>Added to Cache: {cacheClearStatus}</div>
      </div>
      <div id="speed-graph">
        <h3>Speed Graph:</h3>
        <Trend
          className="trend"
          data={fetchTimeInt}
          gradient={['#1feaea','#ffd200', '#f72047']}
          radius={0.9}
          strokeWidth={3.2}
          strokeLinecap={'round'}
        />
      </div>
    </div>
  );
};

export default Metrics;