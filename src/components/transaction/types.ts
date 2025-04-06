
export interface TransactionFormValues {
  amount: number;
  paymentMethod: "upi" | "card" | "bank" | "paytm";
  accountDetails: string;
}
