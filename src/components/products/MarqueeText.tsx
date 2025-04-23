
import React from 'react';

const MarqueeText: React.FC = () => {
  return (
    <div className="overflow-hidden bg-[#222222] py-2 mb-4">
      <div className="whitespace-nowrap animate-marquee">
        <span className="text-investment-gold mx-2">
          New oil rig investments with 6.6% daily returns • Limited mining equipment available • 
          Market update: Gold prices rise 3.1% • Highest yield: Oil Field Equipment at 7.5% daily • 
          Withdrawal time: 11:00 AM daily • New users get 5% bonus on first investment •
        </span>
      </div>
    </div>
  );
};

export default MarqueeText;
