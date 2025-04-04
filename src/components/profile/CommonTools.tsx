
import React from 'react';
import { Wallet, User, MessageCircle, HelpCircle, Info, Download } from 'lucide-react';

interface ToolItem {
  icon: React.ElementType;
  label: string;
  link?: string;
}

const CommonTools: React.FC = () => {
  const tools: ToolItem[] = [
    { icon: Wallet, label: 'Envelope' },
    { icon: User, label: 'Account' },
    { icon: MessageCircle, label: 'History' },
    { icon: HelpCircle, label: 'Guide' },
    { icon: Info, label: 'About us' },
    { icon: MessageCircle, label: 'App Reviews' },
    { icon: Download, label: 'Download App' },
  ];
  
  return (
    <div className="mb-6">
      <h3 className="text-investment-gold text-lg font-medium mb-4">Common tool</h3>
      
      <div className="space-y-4">
        {tools.map((tool, index) => (
          <div key={index} className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-investment-gold">
                <tool.icon size={24} />
              </div>
              <span className="text-white">{tool.label}</span>
            </div>
            <span className="text-gray-400">&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonTools;
