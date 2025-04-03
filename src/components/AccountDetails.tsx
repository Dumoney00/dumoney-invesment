
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from 'lucide-react';

const AccountDetails: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!username || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (updateUserProfile) {
        updateUserProfile({ username, email, phone });
        
        toast({
          title: "Profile Updated",
          description: "Your account details have been updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="username" className="text-gray-300 mb-1 block">Username</label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="text-gray-300 mb-1 block">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="text-gray-300 mb-1 block">Phone Number</label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      
      <Button 
        className="w-full bg-investment-gold hover:bg-investment-gold/90"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : "Save Changes"}
      </Button>
    </div>
  );
};

export default AccountDetails;
