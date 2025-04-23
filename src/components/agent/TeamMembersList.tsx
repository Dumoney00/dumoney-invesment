
import React from 'react';
import { TeamMember } from '@/types/team';
import { Check, Users } from 'lucide-react';

interface TeamMembersListProps {
  members: TeamMember[];
}

const TeamMembersList: React.FC<TeamMembersListProps> = ({ members }) => {
  const activeMembersCount = members.filter(member => member.hasPurchased).length;
  
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-medium flex items-center gap-2">
          <Users className="text-investment-gold" />
          Team Members ({activeMembersCount}/{members.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {members.map((member) => (
          <div 
            key={member.id}
            className="flex items-center justify-between bg-[#333333] p-3 rounded-lg"
          >
            <div>
              <p className="text-white font-medium">{member.username}</p>
              <p className="text-gray-400 text-sm">Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
            </div>
            {member.hasPurchased ? (
              <span className="flex items-center text-green-500">
                <Check size={16} className="mr-1" />
                Active
              </span>
            ) : (
              <span className="text-yellow-500">Pending</span>
            )}
          </div>
        ))}
        
        {members.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400">No team members yet</p>
            <p className="text-sm text-gray-500">Share your invitation link to grow your team</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembersList;
