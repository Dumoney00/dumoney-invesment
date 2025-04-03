
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import AccountDetails from '@/components/AccountDetails';
import TransactionHistory from '@/components/TransactionHistory';
import OtpVerification from '@/components/OtpVerification';
import { toast } from '@/hooks/use-toast';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  if (!isAuthenticated || !user) {
    navigate('/auth');
    return null;
  }
  
  const handlePhoneVerificationComplete = () => {
    setShowOtpVerification(false);
    toast({
      title: "Phone Verified",
      description: "Your phone number has been successfully verified"
    });
  };
  
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4 relative">
        <Button 
          variant="ghost" 
          className="absolute left-2 top-3 text-gray-300 hover:text-white p-1"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-white text-xl text-center font-medium">— Account —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-6">
        {showOtpVerification ? (
          <OtpVerification 
            phoneNumber={user.phone || ''}
            onVerificationComplete={handlePhoneVerificationComplete}
            onCancel={() => setShowOtpVerification(false)}
          />
        ) : (
          <>
            {/* Phone verification banner */}
            <div className="bg-[#222222] rounded-lg p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-investment-gold font-medium">Verify Your Phone Number</p>
                <p className="text-gray-400 text-sm">Add an extra layer of security</p>
              </div>
              <Button 
                className="bg-investment-gold hover:bg-investment-gold/90"
                onClick={() => setShowOtpVerification(true)}
              >
                Verify
              </Button>
            </div>
            
            <Tabs defaultValue="details" className="mb-6">
              <TabsList className="w-full grid grid-cols-2 bg-[#222222]">
                <TabsTrigger value="details" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
                  Details
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <AccountDetails />
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <TransactionHistory />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Account;
