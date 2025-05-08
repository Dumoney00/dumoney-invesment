
-- Create an RPC function for admin dashboard to access transaction summary data
CREATE OR REPLACE FUNCTION public.get_admin_transaction_summary()
RETURNS SETOF admin_transaction_summary AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.admin_transaction_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to this function for authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_transaction_summary() TO authenticated;
