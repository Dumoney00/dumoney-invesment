import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { 
  UserReferralStats, 
  ReferralRecord, 
  ReferralStatus, 
  ReferralTier 
} from '@/types/referrals';
import { 
  generateMockReferralStats, 
  referralTiers, 
  approveReferral, 
  rejectReferral, 
  bulkApproveReferrals, 
  generateMockUserReferralStats, 
  generateMockReferrals, 
  isReferralOverdue 
} from '@/services/referralService';

// Format currency helper
const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString()}`;
};

// Format date helper
const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const AdminReferralsPanel: React.FC = () => {
  const { user, approveReferralBonus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('agents');
  const [userStats, setUserStats] = useState<UserReferralStats[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);

  // Load mock data
  useEffect(() => {
    setUserStats(generateMockUserReferralStats());
    setReferrals(generateMockReferrals());
  }, []);

  // Filter referrals based on search term, status, and date
  const filteredReferrals = referrals.filter(referral => {
    // Search filter
    const searchMatch = 
      referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === 'all' || referral.status === statusFilter;
    
    // Date filter
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const createdDate = new Date(referral.dateCreated);
      const now = new Date();
      
      if (dateFilter === 'today') {
        dateMatch = createdDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        dateMatch = createdDate >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        dateMatch = createdDate >= oneMonthAgo;
      }
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  // Filter users based on search term
  const filteredUserStats = userStats.filter(stat => 
    stat.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle approve referral
  const handleApproveReferral = async (referralId: string) => {
    if (!user?.isAdmin) return;
    
    setLoading(true);
    try {
      const referral = referrals.find(r => r.id === referralId);
      if (!referral) return;
      
      const success = await approveReferral(
        referralId,
        user.id,
        user.username,
        undefined
      );
      
      if (success) {
        // Update local state
        setReferrals(prev => prev.map(r => {
          if (r.id === referralId) {
            return {
              ...r,
              status: 'approved' as ReferralStatus,
              dateUpdated: new Date().toISOString(),
              adminId: user.id,
              adminName: user.username
            };
          }
          return r;
        }));
        
        // Update user stats
        updateUserStatsAfterApproval(referral.referrerId);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle reject referral
  const handleRejectReferral = async () => {
    if (!user?.isAdmin || !selectedReferral) return;
    
    setLoading(true);
    try {
      const success = await rejectReferral(
        selectedReferral.id,
        user.id,
        user.username,
        rejectReason
      );
      
      if (success) {
        // Update local state
        setReferrals(prev => prev.map(r => {
          if (r.id === selectedReferral.id) {
            return {
              ...r,
              status: 'rejected' as ReferralStatus,
              dateUpdated: new Date().toISOString(),
              adminId: user.id,
              adminName: user.username,
              adminComment: rejectReason
            };
          }
          return r;
        }));
      }
    } finally {
      setLoading(false);
      setRejectDialogOpen(false);
      setSelectedReferral(null);
      setRejectReason('');
    }
  };

  // Open reject dialog
  const openRejectDialog = (referral: ReferralRecord) => {
    setSelectedReferral(referral);
    setRejectDialogOpen(true);
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (!user?.isAdmin || selectedReferrals.length === 0) return;
    
    setLoading(true);
    try {
      const success = await bulkApproveReferrals(
        selectedReferrals,
        user.id,
        user.username
      );
      
      if (success) {
        // Update local state
        setReferrals(prev => prev.map(r => {
          if (selectedReferrals.includes(r.id) && r.status === 'pending') {
            // Track which referrer's stats need updating
            const referrerId = r.referrerId;
            
            // Update the referral
            const updated = {
              ...r,
              status: 'approved' as ReferralStatus,
              dateUpdated: new Date().toISOString(),
              adminId: user.id,
              adminName: user.username
            };
            
            // Update the referrer stats
            updateUserStatsAfterApproval(referrerId);
            
            return updated;
          }
          return r;
        }));
        
        // Clear selection
        setSelectedReferrals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update user stats after approval
  const updateUserStatsAfterApproval = (referrerId: string) => {
    setUserStats(prev => prev.map(stat => {
      if (stat.userId === referrerId) {
        // Get the updated stats for this user
        const updatedApproved = stat.approvedReferrals + 1;
        const updatedPending = stat.pendingReferrals - 1;
        
        // Find the appropriate tier for the new approval count
        const appropriateTier = referralTiers.find(tier => 
          updatedApproved >= tier.minReferrals && 
          (tier.maxReferrals === null || updatedApproved <= tier.maxReferrals)
        ) || referralTiers[0];
        
        return {
          ...stat,
          approvedReferrals: updatedApproved,
          pendingReferrals: updatedPending,
          level: appropriateTier.level,
          // We'd also update bonus amounts here in a real implementation
        };
      }
      return stat;
    }));
  };

  // Toggle referral selection
  const toggleReferralSelection = (referralId: string) => {
    setSelectedReferrals(prev => {
      if (prev.includes(referralId)) {
        return prev.filter(id => id !== referralId);
      } else {
        return [...prev, referralId];
      }
    });
  };

  // Calculate total statistics for the summary cards
  const totalAgents = userStats.length;
  const totalReferred = userStats.reduce((sum, r) => sum + r.totalReferrals, 0);
  const totalActiveReferrals = userStats.reduce((sum, r) => sum + r.approvedReferrals, 0);
  const totalPendingBonus = userStats.reduce((sum, r) => sum + r.pendingBonus, 0);
  const totalBonusPaid = userStats.reduce((sum, r) => sum + r.totalBonus, 0);
  const pendingReferralCount = referrals.filter(r => r.status === 'pending').length;
  const overdueReferralCount = referrals.filter(r => 
    r.status === 'pending' && isReferralOverdue(r.dateCreated)
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Agents</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{totalAgents}</h3>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users size={24} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{totalReferred}</h3>
                <p className="text-xs text-gray-500">{totalActiveReferrals} approved referrals</p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Users size={24} className="text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Bonus</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalPendingBonus)}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    {pendingReferralCount} pending
                  </Badge>
                  {overdueReferralCount > 0 && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 ml-2">
                      {overdueReferralCount} overdue
                    </Badge>
                  )}
                </div>
              </div>
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <AlertTriangle size={24} className="text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bonus Paid</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalBonusPaid)}</h3>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <TrendingUp size={24} className="text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Agents and Referrals */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Referral Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-[#1A1F2C]/80 mb-6 p-1 rounded-lg">
              <TabsTrigger 
                value="agents" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Agents
              </TabsTrigger>
              <TabsTrigger 
                value="referrals" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Referral History
              </TabsTrigger>
            </TabsList>

            {/* Search and filter bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
                />
              </div>
              
              {activeTab === 'referrals' && (
                <>
                  <div className="flex-1 flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReferralStatus | 'all')}>
                      <SelectTrigger className="bg-[#1A1F2C] border-[#33374D] text-white w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as 'all' | 'today' | 'week' | 'month')}>
                      <SelectTrigger className="bg-[#1A1F2C] border-[#33374D] text-white w-[140px]">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    disabled={selectedReferrals.length === 0 || loading}
                    onClick={handleBulkApprove}
                  >
                    <Check size={16} className="mr-1" />
                    Bulk Approve ({selectedReferrals.length})
                  </Button>
                </>
              )}
            </div>
            
            {/* Agents tab content */}
            <TabsContent value="agents" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#1A1F2C]/50">
                    <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                      <TableHead className="text-gray-400">Agent ID</TableHead>
                      <TableHead className="text-gray-400">Username</TableHead>
                      <TableHead className="text-gray-400">Level</TableHead>
                      <TableHead className="text-gray-400">Total Referrals</TableHead>
                      <TableHead className="text-gray-400">Active Referrals</TableHead>
                      <TableHead className="text-gray-400">Active Since</TableHead>
                      <TableHead className="text-gray-400 text-right">Pending Bonus</TableHead>
                      <TableHead className="text-gray-400 text-right">Total Earned</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserStats.map(user => (
                      <TableRow key={user.userId} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                        <TableCell className="text-gray-300 font-mono">{user.userId.substring(0, 8)}</TableCell>
                        <TableCell className="text-gray-300">{user.username}</TableCell>
                        <TableCell>
                          {user.level === 'bronze' && (
                            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Bronze
                            </Badge>
                          )}
                          {user.level === 'silver' && (
                            <Badge className="bg-gray-400/20 text-gray-300 border border-gray-400/30">
                              Silver
                            </Badge>
                          )}
                          {user.level === 'gold' && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                              Gold
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300">{user.totalReferrals}</TableCell>
                        <TableCell className="text-gray-300">{user.approvedReferrals}</TableCell>
                        <TableCell className="text-gray-300">{formatDate(user.activeSince)}</TableCell>
                        <TableCell className="text-right text-gray-300">
                          {formatCurrency(user.pendingBonus)}
                        </TableCell>
                        <TableCell className="text-right text-gray-300">
                          {formatCurrency(user.totalBonus)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                            onClick={() => {/* Navigate to agent details */}}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredUserStats.length === 0 && (
                      <TableRow className="border-[#33374D]">
                        <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                          No agents found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Referrals tab content */}
            <TabsContent value="referrals" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#1A1F2C]/50">
                    <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                      <TableHead className="text-gray-400 w-[30px]">
                        <input 
                          type="checkbox" 
                          className="rounded bg-[#1A1F2C] border-[#33374D] text-[#8B5CF6]"
                          onChange={() => {
                            // Select/deselect all pending referrals
                            if (selectedReferrals.length > 0) {
                              setSelectedReferrals([]);
                            } else {
                              const pendingIds = filteredReferrals
                                .filter(r => r.status === 'pending')
                                .map(r => r.id);
                              setSelectedReferrals(pendingIds);
                            }
                          }}
                          checked={selectedReferrals.length > 0 && selectedReferrals.length === filteredReferrals.filter(r => r.status === 'pending').length}
                        />
                      </TableHead>
                      <TableHead className="text-gray-400">Referral ID</TableHead>
                      <TableHead className="text-gray-400">Referrer</TableHead>
                      <TableHead className="text-gray-400">Referred User</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400 text-right">Bonus Amount</TableHead>
                      <TableHead className="text-gray-400">Admin Notes</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map(referral => (
                      <TableRow 
                        key={referral.id} 
                        className={`border-[#33374D] hover:bg-[#1A1F2C]/70 ${isReferralOverdue(referral.dateCreated) && referral.status === 'pending' ? 'bg-red-900/10' : ''}`}
                      >
                        <TableCell>
                          {referral.status === 'pending' && (
                            <input 
                              type="checkbox" 
                              className="rounded bg-[#1A1F2C] border-[#33374D] text-[#8B5CF6]"
                              checked={selectedReferrals.includes(referral.id)}
                              onChange={() => toggleReferralSelection(referral.id)}
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">{referral.id}</TableCell>
                        <TableCell className="text-gray-300">{referral.referrerName}</TableCell>
                        <TableCell className="text-gray-300">{referral.referredName}</TableCell>
                        <TableCell className="text-gray-300">
                          {formatDate(referral.dateCreated)}
                          {referral.status !== 'pending' && (
                            <div className="text-xs text-gray-500">
                              Updated: {formatDate(referral.dateUpdated)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {referral.status === 'pending' && (
                            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {isReferralOverdue(referral.dateCreated) ? 'Overdue' : 'Pending'}
                            </Badge>
                          )}
                          {referral.status === 'approved' && (
                            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                              Approved
                            </Badge>
                          )}
                          {referral.status === 'rejected' && (
                            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                              Rejected
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-gray-300">
                          {formatCurrency(referral.bonusAmount)}
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          {referral.adminComment}
                          {referral.adminName && (
                            <div className="text-xs text-gray-500">
                              By: {referral.adminName}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {referral.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                  onClick={() => handleApproveReferral(referral.id)}
                                  disabled={loading}
                                >
                                  <Check size={16} className="mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                  onClick={() => openRejectDialog(referral)}
                                  disabled={loading}
                                >
                                  <X size={16} className="mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredReferrals.length === 0 && (
                      <TableRow className="border-[#33374D]">
                        <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                          No referrals found matching your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-[#222B45] border-[#33374D] text-white">
          <DialogHeader>
            <DialogTitle>Reject Referral</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please provide a reason for rejection. This will be visible to the referrer.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            className="bg-[#1A1F2C] border-[#33374D] text-white"
          />
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="border-[#33374D] text-gray-300 hover:bg-[#1A1F2C]"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleRejectReferral}
              disabled={!rejectReason.trim() || loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <X size={16} className="mr-1" />
              Reject Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReferralsPanel;
