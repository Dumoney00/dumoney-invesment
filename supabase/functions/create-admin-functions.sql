
-- Create an RPC function for admin dashboard to access transaction summary data
CREATE OR REPLACE FUNCTION public.get_admin_transaction_summary()
RETURNS SETOF admin_transaction_summary AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.admin_transaction_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to this function for authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_transaction_summary() TO authenticated;

-- Create function to manually add an admin user to admin_users table
CREATE OR REPLACE FUNCTION add_admin_user(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  INSERT INTO public.admin_users (email)
  VALUES (email_address)
  ON CONFLICT (email) DO NOTHING;
  RETURN 'Admin user added successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to add our admin user
SELECT add_admin_user('dvenkatkaka001@gmail.com');

-- Grant execute permission
GRANT EXECUTE ON FUNCTION add_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION add_admin_user TO service_role;
