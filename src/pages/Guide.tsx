
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Guide: React.FC = () => {
  const navigate = useNavigate();

  const guideItems = [
    {
      id: 1,
      title: "Getting Started",
      content: "Create an account and complete your profile to begin investing in energy products."
    },
    {
      id: 2,
      title: "Deposit Funds",
      content: "Add funds to your account using our secure deposit system."
    },
    {
      id: 3,
      title: "Choose Investment Products",
      content: "Browse our catalog of energy investment products and select the ones that fit your goals."
    },
    {
      id: 4,
      title: "Collect Daily Income",
      content: "Earn daily returns from your investments, which can be collected once every 24 hours."
    },
    {
      id: 5,
      title: "Withdraw Earnings",
      content: "Transfer your earnings to your bank account or other payment methods."
    },
    {
      id: 6,
      title: "Invite Friends",
      content: "Earn additional rewards by inviting friends to join our platform."
    },
    {
      id: 7,
      title: "Customer Support",
      content: "Contact our support team if you need assistance with any aspect of the platform."
    }
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4 relative">
        <Button 
          variant="ghost" 
          className="absolute left-2 top-3 text-gray-300 hover:text-white p-1"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} />
        </Button>
        <h1 className="text-white text-xl text-center font-medium">— Guide —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      {/* Guide Icon */}
      <div className="flex justify-center my-8">
        <div className="h-20 w-20 bg-[#222222] rounded-full flex items-center justify-center">
          <HelpCircle className="text-investment-gold" size={40} />
        </div>
      </div>
      
      {/* Guide Content */}
      <div className="px-4">
        <h2 className="text-white text-xl font-bold mb-6 text-center">How to use the platform</h2>
        
        <div className="space-y-4 mb-8">
          {guideItems.map(item => (
            <div key={item.id} className="bg-[#222222] rounded-lg p-4">
              <h3 className="text-investment-gold font-medium mb-2">{item.id}. {item.title}</h3>
              <p className="text-gray-300 text-sm">{item.content}</p>
            </div>
          ))}
        </div>
        
        {/* FAQ Section */}
        <h2 className="text-white text-xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="bg-[#222222] rounded-lg p-4">
            <h3 className="text-investment-gold font-medium mb-2">How safe are my investments?</h3>
            <p className="text-gray-300 text-sm">
              Our platform employs industry-standard security measures to protect your investments. All transactions are encrypted and we maintain strict compliance with financial regulations.
            </p>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4">
            <h3 className="text-investment-gold font-medium mb-2">How do I earn daily income?</h3>
            <p className="text-gray-300 text-sm">
              Each investment product generates a fixed daily return. Simply visit the Investing page once every 24 hours to collect your earnings.
            </p>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4">
            <h3 className="text-investment-gold font-medium mb-2">What payment methods are supported?</h3>
            <p className="text-gray-300 text-sm">
              We support various payment methods including bank transfers, credit/debit cards, and selected cryptocurrencies.
            </p>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-4">
            <h3 className="text-investment-gold font-medium mb-2">How does the referral program work?</h3>
            <p className="text-gray-300 text-sm">
              You can earn commissions when people you invite make investments. You'll receive different percentages based on the level of referral: 20% for first-level, 15% for second-level, and 10% for third-level referrals.
            </p>
          </div>
        </div>
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Guide;
