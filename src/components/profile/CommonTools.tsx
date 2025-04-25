
import React from 'react';
import { Wallet, User, MessageCircle, HelpCircle, Info, Download, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ToolItem {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

const CommonTools: React.FC = () => {
  const navigate = useNavigate();

  const handleDownloadApp = () => {
    // Using the direct APK download URL
    const apkUrl = 'https://8182cd2c-297a-44b5-b0a1-c773f5531117.lovableproject.com/dumoney-investment.apk';
    
    // Create an invisible iframe for download
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Start download
    iframe.src = apkUrl;
    
    // Remove iframe after a delay
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
    
    toast({
      title: "Download Started",
      description: "Your APK download will begin shortly. Once downloaded, open the file to install the app.",
    });
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const tools: ToolItem[] = [
    { icon: Wallet, label: 'Envelope' },
    { icon: User, label: 'Account' },
    { icon: MessageCircle, label: 'History' },
    { icon: HelpCircle, label: 'Guide' },
    { icon: Info, label: 'About us' },
    { icon: MessageCircle, label: 'App Reviews' },
    { 
      icon: Download, 
      label: 'Download App',
      onClick: handleDownloadApp 
    },
    {
      icon: Shield,
      label: 'Admin Login',
      onClick: handleAdminLogin
    },
  ];
  
  return (
    <div className="mb-6">
      <h3 className="text-investment-gold text-lg font-medium mb-4">Common tool</h3>
      
      <div className="space-y-4">
        {tools.map((tool, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full bg-[#222222] hover:bg-[#2a2a2a] rounded-lg p-4 flex items-center justify-between"
            onClick={tool.onClick}
          >
            <div className="flex items-center gap-3">
              <div className="text-investment-gold">
                <tool.icon size={24} />
              </div>
              <span className="text-white">{tool.label}</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommonTools;
