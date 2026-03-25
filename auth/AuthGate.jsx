import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export default function AuthGate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const role = localStorage.getItem("user_role");
  const profileDone = localStorage.getItem("profile_done");

  // Prevent infinite redirects
  if (!role && location.pathname !== "/select-role") {
    return <Navigate to="/select-role" replace />;
  }

  if (role && !profileDone && location.pathname !== "/setup-profile") {
    return <Navigate to="/setup-profile" replace />;
  }

  return <Outlet />;
}

