
import { v4 as uuidv4 } from 'uuid';
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export const migrateLocalStorageToSupabase = async (): Promise<boolean> => {
  try {
    console.log("Starting migration from localStorage to Supabase");
    
    // Get all users from localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    const currentUser = localStorage.getItem('investmentUser');
    
    if (!storedUsers && !currentUser) {
      console.log("No local data found to migrate");
      return false;
    }
    
    let usersToMigrate: User[] = [];
    
    if (storedUsers) {
      usersToMigrate = JSON.parse(storedUsers);
    }
    
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser) as User;
      if (!usersToMigrate.some(u => u.id === parsedUser.id)) {
        usersToMigrate.push(parsedUser);
      }
    }
    
    if (usersToMigrate.length === 0) {
      console.log("No users to migrate");
      return false;
    }
    
    console.log(`Found ${usersToMigrate.length} users to migrate`);
    
    // Migrate each user to Supabase
    for (const user of usersToMigrate) {
      // First, create or update the user in the users table
      const userId = user.id || uuidv4();
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error checking if user exists:", fetchError);
        continue;
      }
      
      // If user doesn't exist, insert them
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: user.username,
            email: user.email,
            phone: user.phone,
            balance: user.balance,
            withdrawal_balance: user.withdrawalBalance,
            total_deposit: user.totalDeposit,
            total_withdraw: user.totalWithdraw,
            daily_income: user.dailyIncome,
            investment_quantity: user.investmentQuantity,
            owned_products: user.ownedProducts || [],
            transactions: user.transactions || [],
            last_income_collection: user.lastIncomeCollection,
            is_admin: user.isAdmin || false,
            is_blocked: user.isBlocked || false,
            referral_code: user.referralCode,
            referral_status: user.referralStatus,
            referred_by: user.referredBy,
            level: user.level || 0,
            bank_details: user.bankDetails,
            upi_id: user.upiId
          });
        
        if (insertError) {
          console.error("Error inserting user:", insertError);
          continue;
        }
        
        console.log(`Created user: ${user.username} (${userId})`);
      } else {
        // If user exists, update them
        const { error: updateError } = await supabase
          .from('users')
          .update({
            username: user.username,
            email: user.email,
            phone: user.phone,
            balance: user.balance,
            withdrawal_balance: user.withdrawalBalance,
            total_deposit: user.totalDeposit,
            total_withdraw: user.totalWithdraw,
            daily_income: user.dailyIncome,
            investment_quantity: user.investmentQuantity,
            owned_products: user.ownedProducts || [],
            transactions: user.transactions || [],
            last_income_collection: user.lastIncomeCollection,
            is_admin: user.isAdmin || false,
            is_blocked: user.isBlocked || false,
            referral_code: user.referralCode,
            referral_status: user.referralStatus,
            referred_by: user.referredBy,
            level: user.level || 0,
            bank_details: user.bankDetails,
            upi_id: user.upiId
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error("Error updating user:", updateError);
          continue;
        }
        
        console.log(`Updated user: ${user.username} (${userId})`);
      }
      
      // Migrate transactions to separate table
      if (user.transactions && user.transactions.length > 0) {
        for (const transaction of user.transactions) {
          const { error: transError } = await supabase
            .from('transactions')
            .insert({
              id: transaction.id || uuidv4(),
              user_id: userId,
              type: transaction.type,
              amount: transaction.amount,
              timestamp: transaction.timestamp,
              status: transaction.status,
              details: transaction.details,
              product_id: transaction.productId,
              product_name: transaction.productName,
              withdrawal_time: transaction.withdrawalTime,
              approved_by: transaction.approvedBy,
              approval_timestamp: transaction.approvalTimestamp,
            });
            
          if (transError) {
            console.error("Error inserting transaction:", transError);
          }
        }
        
        console.log(`Migrated ${user.transactions.length} transactions for user ${user.username}`);
      }
    }
    
    console.log("Migration complete");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  }
};
