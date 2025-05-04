
import { User } from "@/types/auth";
import { addProductToUser, removeProductFromUser, addTransactionToUser } from "@/utils/userUtils";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { showToast } from "@/utils/toastUtils";
import { useActivityLogger } from './useActivityLogger';
import { investmentData } from "@/data/investments";

/**
 * Hook for managing product-related transactions
 */
export const useProductTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const { logActivity } = useActivityLogger(user);

  const addOwnedProduct = async (productId: number, price: number) => {
    if (user) {
      const updatedUser = addProductToUser(user, productId, price);
      
      try {
        await supabase
          .from('transactions')
          .insert({
            id: uuidv4(),
            user_id: user.id,
            type: 'purchase',
            amount: price,
            status: 'completed',
            details: `Purchased product ID: ${productId}`,
            product_id: productId
          });
          
        // Also add to owned_products table
        const product = updatedUser.ownedProducts.find(p => p.productId === productId);
        if (product) {
          await supabase
            .from('owned_products')
            .insert({
              user_id: user.id,
              product_id: productId,
              purchase_date: product.purchaseDate,
              cycle_days: product.cycleDays
            });
        }
      } catch (error) {
        console.error('Failed to record purchase transaction:', error);
      }
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Purchased product ID: ${productId}`
      });
      
      // Log activity
      await logActivity('purchase', `Purchased product ID: ${productId}`, price);
      
      saveUser(userWithTransaction);
    }
  };
  
  const sellOwnedProduct = async (productId: number, sellPrice: number) => {
    if (!user) return false;
    
    const productExists = user.ownedProducts.some(product => product.productId === productId);
    
    if (!productExists) {
      showToast(
        "Sale Failed",
        "You don't own this product",
        "destructive"
      );
      return false;
    }
    
    const updatedUser = removeProductFromUser(user, productId, sellPrice);
    
    try {
      await supabase
        .from('transactions')
        .insert({
          id: uuidv4(),
          user_id: user.id,
          type: 'sale',
          amount: sellPrice,
          status: 'completed',
          details: `Sold product ID: ${productId}`,
          product_id: productId
        });
        
      // Also remove from owned_products
      await supabase
        .from('owned_products')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } catch (error) {
      console.error('Failed to record sale transaction:', error);
    }
    
    const userWithTransaction = addTransactionToUser(updatedUser, {
      type: "sale",
      amount: sellPrice,
      status: "completed",
      details: `Sold product ID: ${productId}`
    });
    
    // Log activity
    await logActivity('sale', `Sold product ID: ${productId}`, sellPrice);
    
    saveUser(userWithTransaction);
    return true;
  };

  return {
    addOwnedProduct,
    sellOwnedProduct
  };
};
