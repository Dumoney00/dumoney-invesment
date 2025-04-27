
import React from 'react';

const ChartGradients = () => {
  return (
    <defs>
      <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.5}/>
        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#F97316" stopOpacity={0.5}/>
        <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/>
        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
      </linearGradient>
    </defs>
  );
};

export default ChartGradients;
