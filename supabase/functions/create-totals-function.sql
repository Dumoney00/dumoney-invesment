
-- Create an RPC function for the admin dashboard to get transaction totals
CREATE OR REPLACE FUNCTION public.get_transaction_totals()
RETURNS json AS $$
BEGIN
  RETURN json_build_object(
    'total_deposits', COALESCE(
      (SELECT SUM(amount) 
      FROM transactions 
      WHERE type = 'deposit' AND status = 'completed'), 
      0
    ),
    'total_withdrawals', COALESCE(
      (SELECT SUM(amount) 
      FROM transactions 
      WHERE type = 'withdraw' AND status = 'completed'), 
      0
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to this function for authenticated users
GRANT EXECUTE ON FUNCTION public.get_transaction_totals() TO authenticated;
