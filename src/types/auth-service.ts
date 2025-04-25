
import { User } from "./auth";

export interface AdminCredential {
  email: string;
  password: string;
}

export interface AuthService {
  user: User | null;
  isAuthenticated: boolean;
  saveUser: (updatedUser: User | null) => void;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, phone: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  approveReferralBonus: (userId: string, amount: number) => Promise<boolean>;
}
