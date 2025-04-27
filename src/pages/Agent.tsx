
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import AgentStats from '@/components/agent/AgentStats';
import InvitationSection from '@/components/agent/InvitationSection';
import InviteBanner from '@/components/agent/InviteBanner';

const Agent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">Agent Center</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        {/* Simple Stats Card */}
        <div className="mb-6">
          <AgentStats />
        </div>

        {/* Invitation Method */}
        <div className="mb-6">
          <InvitationSection />
        </div>
        
        {/* Invitation Banner */}
        <InviteBanner 
          onCopyInvite={() => {
            const invitationSection = document.querySelector('button[class*="bg-yellow-500"]') as HTMLButtonElement;
            if (invitationSection) {
              invitationSection.click();
            }
          }}
          isAuthenticated={isAuthenticated}
        />
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Agent;
