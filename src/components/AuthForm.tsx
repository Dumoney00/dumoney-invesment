
import React from 'react';

const AuthForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-12 pb-24">
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">
          — Authentication Disabled —
        </h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="max-w-md mx-auto p-5 mt-8 text-center">
        <p className="text-white mb-6">
          Login and registration have been disabled for this application.
        </p>
        
        <p className="text-gray-400">
          Please contact the administrator for access.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
