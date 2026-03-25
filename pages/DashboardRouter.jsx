import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const profileDone = localStorage.getItem("profile_done");

    if (!role) {
      navigate("/select-role", { replace: true });
      return;
    }

    if (!profileDone) {
      navigate("/setup-profile", { replace: true });
      return;
    }

    // Default to feed for all roles (LinkedIn style)
    navigate("/feed", { replace: true });

  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef]">
      <p className="text-gray-500 font-semibold animate-pulse">Entering FarmerBridge...</p>
    </div>
  );
}

