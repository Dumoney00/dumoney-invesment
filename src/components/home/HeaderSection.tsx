
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";

const HeaderSection: React.FC = () => {
  return (
    <>
      <header className="bg-[#333333] py-4 relative">
        <h1 className="text-xl text-center font-bold text-yellow-500">DUMONEY INVEST</h1>
      </header>
      <div className="bg-investment-yellow h-2"></div>
    </>
  );
};

export default HeaderSection;
