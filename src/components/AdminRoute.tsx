import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const checkAdminAccess = async () => {
      if (authLoading) {
        return;
      }

      if (!user || !supabase) {
        if (active) {
          setIsAdmin(false);
        }
        return;
      }

      if (active) {
        setIsAdmin(null);
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (error) {
        console.error("Unable to verify admin access:", error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data?.role === "super_admin");
    };

    void checkAdminAccess();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  if (authLoading || (user && isAdmin === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
