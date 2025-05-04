
import { User, TransactionRecord } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const fetchUserFromSupabase = async (userId: string) => {
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user from Supabase:", error);
      return null;
    }
    
    // When processing user data from Supabase
    if (userData) {
      // Map Supabase user data to our User type
      const user = mapDbUserToAppUser(userData);
      
      // Get owned products for this user
      const { data: ownedProducts } = await supabase
        .from('owned_products')
        .select('*')
        .eq('user_id', userId);
        
      if (ownedProducts) {
        user.ownedProducts = ownedProducts.map(p => ({
          productId: p.product_id,
          purchaseDate: p.purchase_date,
          cycleDays: p.cycle_days
        }));
      }
      
      // Get bank details for this user
      const { data: bankDetails } = await supabase
        .from('bank_details')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (bankDetails) {
        user.bankDetails = {
          accountNumber: bankDetails.account_number,
          accountHolderName: bankDetails.account_holder_name,
          ifscCode: bankDetails.ifsc_code,
          upiId: bankDetails.upi_id || '' 
        };
      }
      
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user from Supabase:", error);
    return null;
  }
};

export const mapDbUserToAppUser = (dbUser: any): any => {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    phone: dbUser.phone,
    balance: dbUser.balance,
    withdrawalBalance: dbUser.withdrawal_balance || 0,
    totalDeposit: dbUser.total_deposit || 0,
    totalWithdraw: dbUser.total_withdraw || 0,
    dailyIncome: dbUser.daily_income || 0,
    investmentQuantity: dbUser.investment_quantity || 0,
    profilePicture: dbUser.profile_picture || '',
    ownedProducts: [],
    transactions: [],
    bankDetails: null,
    referralCode: dbUser.referral_code,
    referredBy: dbUser.referred_by,
    password: '',
    isAdmin: dbUser.is_admin || false,
    isBlocked: dbUser.is_blocked || false
  };
};

export const migrateLocalStorageToSupabase = async (localUser: any) => {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', localUser.id)
      .single();
    
    if (existingUser) {
      console.log("User already exists in Supabase, skipping migration.");
      return null;
    }
    
    // When migrating user data to Supabase
    if (localUser) {
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: localUser.id,
            username: localUser.username,
            email: localUser.email,
            phone: localUser.phone,
            balance: localUser.balance,
            profile_picture: localUser.profilePicture || '',
            referral_code: localUser.referralCode,
            referred_by: localUser.referredBy
          }
        ]);
      
      if (userError) {
        console.error("Error migrating user to Supabase:", userError);
        return null;
      }
      
      // Migrate owned products if they exist
      if (localUser.ownedProducts && localUser.ownedProducts.length > 0) {
        for (const product of localUser.ownedProducts) {
          const { error: productError } = await supabase
            .from('owned_products')
            .insert([
              {
                user_id: localUser.id,
                product_id: product.productId,
                cycle_days: product.cycleTimeRemaining,
                purchase_date: product.purchaseDate
              }
            ]);
          
          if (productError) {
            console.error("Error migrating owned product:", productError);
          }
        }
      }
      
      // Migrate bank details if they exist
      if (localUser.bankDetails) {
        const { error: bankError } = await supabase
          .from('bank_details')
          .insert([
            {
              user_id: localUser.id,
              account_number: localUser.bankDetails.accountNumber,
              account_holder_name: localUser.bankDetails.accountHolderName,
              ifsc_code: localUser.bankDetails.ifscCode,
              upi_id: localUser.bankDetails.upiId || ''
            }
          ]);
        
        if (bankError) {
          console.error("Error migrating bank details:", bankError);
        }
      }
      
      return localUser;
    }
  } catch (error) {
    console.error("Migration error:", error);
    return null;
  }
};

// Add the missing functions
export const createTransactionRecord = (transactionData: Omit<TransactionRecord, "id" | "timestamp">): TransactionRecord => {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    ...transactionData
  };
};

// Add function to find user by email or phone
export const findUserByEmailOrPhone = (emailOrPhone: string): User | null => {
  try {
    const storedUsers = localStorage.getItem('investmentUsers');
    if (!storedUsers) return null;
    
    const users = JSON.parse(storedUsers);
    return users.find((u: any) => u.email === emailOrPhone || u.phone === emailOrPhone) || null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};
