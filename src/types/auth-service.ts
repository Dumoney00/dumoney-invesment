
import { User } from "./auth";

export interface AdminCredential {
  email: string;
  password: string;
}

export interface AuthService {
  user: User | null;
  isAuthenticated: boolean;
  saveUser: (updatedUser: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}
