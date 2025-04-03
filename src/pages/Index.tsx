
import React, { useState, useEffect } from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { Flame, Volume2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const investmentData = [
  {
    id: 1,
    title: "Catalytic Reforming Reactor #1",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 250.00,
    dailyIncome: 50.00,
    viewCount: 6351,
  },
  {
    id: 2,
    title: "Catalytic Reforming Reactor #2",
    image: "https://images.unsplash.com/photo-1579784265015-1272f5d28154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 800.00,
    dailyIncome: 60.00,
    viewCount: 1730,
  },
  {
    id: 3,
    title: "Catalytic Reforming Reactor #3",
    image: "https://images.unsplash.com/photo-1525093127870-67be6104d8a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1400.00,
    dailyIncome: 108.00,
    viewCount: 4677,
  },
  {
    id: 4,
    title: "Catalytic Reforming Reactor #4",
    image: "https://images.unsplash.com/photo-1578256420811-3a73e8286fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 5000.00,
    dailyIncome: 417.00,
    viewCount: 4329,
  },
];

// Activity feed data
const activityFeed = [
  { id: 1, username: "User 01******1565", amount: 9042.00 },
  { id: 2, username: "User 01******4154", amount: 8146.00 },
  { id: 3, username: "User 01******7823", amount: 4822.00 },
  { id: 4, username: "User 01******9974", amount: 6331.00 },
  { id: 5, username: "User 01******2246", amount: 7510.00 },
];

const Index: React.FC = () => {
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 4);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [copySuccess, setCopySuccess] = useState(false);
  
  // Handle product purchase
  const handleProductPurchase = (product: typeof investmentData[0]) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    navigate('/products');
  };
  
  // Copy invitation code
  const handleCopyInvite = () => {
    if (isAuthenticated && user) {
      const inviteCode = user.id;
      navigator.clipboard.writeText(inviteCode)
        .then(() => {
          setCopySuccess(true);
          toast({
            title: "Copied!",
            description: "Invitation code copied to clipboard"
          });
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          toast({
            title: "Failed to copy",
            description: "Please try again",
            variant: "destructive"
          });
        });
    } else {
      navigate('/auth');
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Product List —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      {/* Account Balance Section */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-2xl">$</span>
            <span className="text-white font-bold text-2xl">{user?.balance?.toFixed(2) || "0.00"}</span>
          </div>
          <p className="text-white text-sm">Account balance</p>
        </div>
        
        <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white text-2xl">$</span>
            <span className="text-white font-bold text-2xl">{user?.totalDeposit?.toFixed(2) || "0.00"}</span>
          </div>
          <p className="text-white text-sm">Total Deposit</p>
        </div>
      </div>
      
      {/* Registration Banner */}
      <div className="px-4 mb-4">
        {!isAuthenticated ? (
          <div className="bg-black border border-investment-gold rounded-full p-3 flex items-center">
            <Volume2 className="text-investment-gold mr-2" size={24} />
            <div className="text-white flex-1">
              <span>Tap to register on CLR Energy app</span>
              <span className="text-investment-gold ml-2">👑</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-blue-400"
              onClick={() => navigate('/auth')}
            >
              <ExternalLink size={18} />
            </Button>
          </div>
        ) : (
          <div className="bg-black border border-investment-gold rounded-full p-3 flex items-center">
            <Volume2 className="text-investment-gold mr-2" size={24} />
            <span className="text-white">Welcome, {user.username}! Earn daily income with our products.</span>
          </div>
        )}
      </div>
      
      {/* Banner Image */}
      <div className="px-4 mb-6">
        <div className="relative w-full overflow-hidden rounded-xl">
          <img 
            src="/lovable-uploads/07ba0101-cb9b-416e-9796-7014c2aa2302.png"
            alt="Join us banner" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h3 className="text-4xl font-bold text-white mb-2">JOIN US</h3>
            <p className="text-white text-lg">
              Develop new energy with us and create a better future together
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 px-6 mb-6">
        <div className="flex flex-col items-center" onClick={() => navigate('/deposit')}>
          <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
            <img src="/lovable-uploads/e64e27ed-2f37-48aa-a277-fd7ad33b2e87.png" alt="Deposit" className="w-10 h-10" />
          </div>
          <span className="text-white text-sm">Deposit</span>
        </div>
        
        <div className="flex flex-col items-center" onClick={() => navigate('/withdraw')}>
          <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
            <img src="/lovable-uploads/6efabb52-cf50-45d0-b356-7f37c5c2003a.png" alt="Withdraw" className="w-10 h-10" />
          </div>
          <span className="text-white text-sm">Withdraw</span>
        </div>
        
        <div className="flex flex-col items-center" onClick={() => navigate('/profile')}>
          <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
            <img src="/lovable-uploads/5e66b3aa-94e1-4704-ab30-f3f9bbaec223.png" alt="Account" className="w-10 h-10" />
          </div>
          <span className="text-white text-sm">Account</span>
        </div>
        
        <div className="flex flex-col items-center" onClick={() => navigate('/guide')}>
          <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
            <img src="/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png" alt="Guide" className="w-10 h-10" />
          </div>
          <span className="text-white text-sm">Guide</span>
        </div>
      </div>
      
      {/* Invitation Banner */}
      <div className="px-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg text-white font-medium mb-1">Invite friends to earn money</h3>
              <p className="text-gray-400 text-sm">The more invites, the more rewards you get!</p>
            </div>
            <Button 
              className="bg-investment-gold hover:bg-investment-gold/90"
              onClick={handleCopyInvite}
            >
              {copySuccess ? "Copied!" : "Invite Now"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* In Progress Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Flame className="text-investment-gold" size={24} />
            <h2 className="text-white text-xl font-bold">In Progress</h2>
          </div>
          <div className="text-investment-gold">
            {formatDate(currentDate)} to {formatDate(endDate)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {investmentData.map(item => (
            <InvestmentCard 
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              dailyIncome={item.dailyIncome}
              viewCount={item.viewCount}
              onInvest={() => handleProductPurchase(item)}
            />
          ))}
        </div>
      </div>
      
      {/* Activity Feed */}
      <div className="p-4">
        <h2 className="text-center text-gray-400 mb-4 text-lg">— Dynamic info —</h2>
        
        <div className="space-y-4">
          {activityFeed.map((activity) => (
            <div key={activity.id} className="bg-[#222222] p-4 rounded-lg flex items-center">
              <div className="h-10 w-10 rounded-full bg-investment-gold/20 flex items-center justify-center mr-4">
                <span className="text-investment-gold text-2xl">✓</span>
              </div>
              <div className="flex-1 text-white">
                <p>
                  <span className="text-white">{activity.username}</span> successfully
                  <br />
                  recharge <span className="text-investment-gold">${activity.amount.toLocaleString()}</span>
                </p>
              </div>
              <div className="h-12 w-12 ml-2">
                <img 
                  src={Math.random() > 0.5 ? 
                    "/lovable-uploads/6efabb52-cf50-45d0-b356-7f37c5c2003a.png" :
                    "/lovable-uploads/e64e27ed-2f37-48aa-a277-fd7ad33b2e87.png"
                  } 
                  alt="Activity icon" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Index;
