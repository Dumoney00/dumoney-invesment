
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
    let migratedCount = 0;
    
    for (const user of usersToMigrate) {
      // First, create or update the user in the users table
      const userId = user.id || uuidv4();
      
      // Check if user already exists in Supabase
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
            is_admin: user.isAdmin || false,
            is_blocked: user.isBlocked || false,
            referral_code: user.referralCode,
            referral_status: user.referralStatus,
            referred_by: user.referredBy,
            level: user.level || 0
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
            is_admin: user.isAdmin || false,
            is_blocked: user.isBlocked || false,
            referral_code: user.referralCode,
            referral_status: user.referralStatus,
            referred_by: user.referredBy,
            level: user.level || 0
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error("Error updating user:", updateError);
          continue;
        }
        
        console.log(`Updated user: ${user.username} (${userId})`);
      }
      
      // Migrate bank details if they exist
      if (user.bankDetails) {
        // Check if bank details exist
        const { data: existingBankDetails, error: bankFetchError } = await supabase
          .from('bank_details')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (bankFetchError && bankFetchError.code !== 'PGRST116') {
          console.error("Error checking if bank details exist:", bankFetchError);
        }
        
        if (!existingBankDetails) {
          // Insert bank details
          const { error: bankError } = await supabase
            .from('bank_details')
            .insert({
              user_id: userId,
              account_number: user.bankDetails.accountNumber,
              account_holder_name: user.bankDetails.accountHolderName,
              ifsc_code: user.bankDetails.ifscCode,
              upi_id: user.bankDetails.upiId || ''
            });
          
          if (bankError) {
            console.error("Error inserting bank details:", bankError);
          } else {
            console.log(`Added bank details for user: ${user.username}`);
          }
        } else {
          // Update bank details
          const { error: updateBankError } = await supabase
            .from('bank_details')
            .update({
              account_number: user.bankDetails.accountNumber,
              account_holder_name: user.bankDetails.accountHolderName,
              ifsc_code: user.bankDetails.ifscCode,
              upi_id: user.bankDetails.upiId || ''
            })
            .eq('user_id', userId);
            
          if (updateBankError) {
            console.error("Error updating bank details:", updateBankError);
          } else {
            console.log(`Updated bank details for user: ${user.username}`);
          }
        }
      }
      
      // Migrate owned products to separate table
      if (user.ownedProducts && user.ownedProducts.length > 0) {
        // Delete existing owned products to avoid duplicates
        await supabase
          .from('owned_products')
          .delete()
          .eq('user_id', userId);
        
        for (const product of user.ownedProducts) {
          const { error: productError } = await supabase
            .from('owned_products')
            .insert({
              user_id: userId,
              product_id: product.productId,
              purchase_date: product.purchaseDate,
              cycle_days: product.cycleDays
            });
            
          if (productError) {
            console.error("Error inserting owned product:", productError);
          }
        }
        
        console.log(`Migrated ${user.ownedProducts.length} owned products for user ${user.username}`);
      }
      
      // Migrate transactions to separate table
      if (user.transactions && user.transactions.length > 0) {
        // Check for existing transactions to avoid duplicates
        const existingTransactionIds = new Set<string>();
        const { data: existingTransactions } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', userId);
          
        if (existingTransactions) {
          existingTransactions.forEach(tx => existingTransactionIds.add(tx.id));
        }
        
        let migratedTransactions = 0;
        
        for (const transaction of user.transactions) {
          // Skip if transaction already exists
          if (existingTransactionIds.has(transaction.id)) {
            continue;
          }
          
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
              approval_timestamp: transaction.approvalTimestamp
            });
            
          if (transError) {
            console.error("Error inserting transaction:", transError);
          } else {
            migratedTransactions++;
          }
        }
        
        console.log(`Migrated ${migratedTransactions} new transactions for user ${user.username}`);
      }
      
      // Create activity log for this migration
      try {
        await supabase
          .from('activity_logs')
          .insert({
            user_id: userId,
            username: user.username,
            activity_type: 'other',
            details: 'Data migrated from local storage to cloud database',
            ip_address: await fetchIpAddress()
          });
      } catch (activityError) {
        console.error("Error creating migration activity log:", activityError);
      }
      
      migratedCount++;
    }
    
    console.log(`Successfully migrated ${migratedCount} users to Supabase`);
    return migratedCount > 0;
  } catch (error) {
    console.error("Migration failed:", error);
    return false;
  }
};

// Helper function to get user's IP address
const fetchIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
    return null;
  }
};
