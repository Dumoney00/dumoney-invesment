
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { User, Wallet, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Mine —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
            <User size={32} className="text-gray-300" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Guest User</h2>
            <p className="text-gray-400">ID: 28573901</p>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="space-y-4">
          <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="text-investment-gold" />
              <span className="text-white">Wallet</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-investment-gold" />
              <span className="text-white">Notifications</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="text-investment-gold" />
              <span className="text-white">Settings</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="text-investment-gold" />
              <span className="text-white">Help Center</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="text-investment-gold" />
              <span className="text-white">Logout</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
        </div>
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Profile;
