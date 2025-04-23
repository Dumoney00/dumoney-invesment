
export interface TeamMember {
  id: string;
  username: string;
  joinDate: string;
  hasPurchased: boolean;
}

export interface TeamStats {
  totalPeople: number;
  activePeople: number; // people who have purchased a plan
  teamInvestment: number;
}
