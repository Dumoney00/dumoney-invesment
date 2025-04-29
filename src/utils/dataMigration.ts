
import { User, TransactionRecord, UserOwnedProduct } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "./toastUtils";

// This function will migrate all data from localStorage to Supabase
export const migrateLocalStorageToSupabase = async () => {
  try {
    // Check if migration has already been done
    const migrationComplete = localStorage.getItem('supabaseMigrationComplete');
    if (migrationComplete === 'true') {
      console.log("Migration already completed");
      return { success: true, message: "Migration already completed" };
    }
    
    // Get all users from localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    const currentUser = localStorage.getItem('investmentUser');
    
    if (!storedUsers && !currentUser) {
      console.log("No data to migrate");
      return { success: true, message: "No data to migrate" };
    }
    
    let users: User[] = [];
    
    // Parse stored users if available
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
    
    // Add current user if available and not already in the list
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser) as User;
      if (!users.some(u => u.id === parsedUser.id)) {
        users.push(parsedUser);
      }
    }
    
    console.log(`Migrating ${users.length} users to Supabase...`);
    
    // For each user, create an auth user and a profile
    for (const user of users) {
      // Generate a random password for the user
      // In a real scenario, you would need to handle this differently
      const password = Math.random().toString(36).substring(2, 10);
      
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password,
          options: {
            data: {
              username: user.username,
              phone: user.phone
            }
          }
        });
        
        if (authError) {
          console.error(`Error creating auth user for ${user.email}:`, authError);
          continue;
        }
        
        const userId = authData.user?.id;
        if (!userId) {
          console.error(`No user ID returned for ${user.email}`);
          continue;
        }
        
        // Update user profile with additional data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            balance: user.balance,
            withdrawal_balance: user.withdrawalBalance,
            total_deposit: user.totalDeposit,
            total_withdraw: user.totalWithdraw,
            daily_income: user.dailyIncome,
            investment_quantity: user.investmentQuantity,
            last_income_collection: user.lastIncomeCollection,
            is_admin: user.isAdmin || false,
            is_blocked: user.isBlocked || false,
            referral_code: user.referralCode,
            referral_status: user.referralStatus,
            referred_by: user.referredBy,
            level: user.level
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error(`Error updating user profile for ${user.email}:`, updateError);
          continue;
        }
        
        // Migrate owned products
        if (user.ownedProducts && user.ownedProducts.length > 0) {
          const ownedProductsToInsert = user.ownedProducts.map((product: UserOwnedProduct) => ({
            user_id: userId,
            product_id: product.productId,
            purchase_date: product.purchaseDate,
            cycle_days: product.cycleDays
          }));
          
          const { error: productError } = await supabase
            .from('owned_products')
            .insert(ownedProductsToInsert);
          
          if (productError) {
            console.error(`Error migrating owned products for ${user.email}:`, productError);
          }
        }
        
        // Migrate transactions
        if (user.transactions && user.transactions.length > 0) {
          const transactionsToInsert = user.transactions.map((transaction: TransactionRecord) => ({
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
          }));
          
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert(transactionsToInsert);
          
          if (transactionError) {
            console.error(`Error migrating transactions for ${user.email}:`, transactionError);
          }
        }
        
        console.log(`Successfully migrated user ${user.email}`);
        
      } catch (error) {
        console.error(`Error migrating user ${user.email}:`, error);
      }
    }
    
    // Mark migration as complete
    localStorage.setItem('supabaseMigrationComplete', 'true');
    
    return { success: true, message: `Successfully migrated ${users.length} users to Supabase` };
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, message: "Migration failed", error };
  }
};

// Admin function to trigger migration
export const triggerDataMigration = async () => {
  try {
    showToast("Migration Started", "Data migration to Supabase has started. This may take a few moments...");
    
    const result = await migrateLocalStorageToSupabase();
    
    if (result.success) {
      showToast("Migration Complete", result.message);
    } else {
      showToast("Migration Failed", result.message, "destructive");
    }
    
    return result;
  } catch (error) {
    console.error("Error triggering migration:", error);
    showToast("Migration Failed", "An unexpected error occurred", "destructive");
    return { success: false, message: "An unexpected error occurred", error };
  }
};
