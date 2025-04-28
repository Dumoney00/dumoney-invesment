
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import TransactionHistory from "@/components/admin/TransactionHistory";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <TransactionHistory />
      </main>
    </div>
  );
};

export default AdminDashboard;
