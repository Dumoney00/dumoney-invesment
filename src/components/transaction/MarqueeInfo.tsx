
import React from 'react';

const MarqueeInfo: React.FC = () => {
  return (
    <div className="overflow-hidden bg-[#222222] py-2 mb-4">
      <div className="whitespace-nowrap animate-marquee">
        <span className="text-investment-gold mx-2">
          Withdrawal time: 11:00 AM to 11:30 AM, Monday to Friday • No withdrawals on weekends • 
          Market update: Oil prices up 2.3% • New mining equipment available! •
          USD/INR: 73.45 • BTC: ₹4,721,865 • ETH: ₹262,970 • Daily returns averaging 8.2% •
        </span>
      </div>
    </div>
  );
};

export default MarqueeInfo;
