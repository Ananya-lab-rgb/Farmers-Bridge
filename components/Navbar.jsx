import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
  Home,
  Users,
  Briefcase,
  Bell,
  UserCircle,
  LogOut,
  Search,
  PlusSquare,
  Map,
  Sprout
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("user_role");

  const logout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { label: "Feed", icon: Home, path: "/feed" },
    { label: "Laborers", icon: Users, path: "/browse-laborers", show: role === "farmer" },
    { label: "Map", icon: Map, path: "/community-map" },
    { label: "Tools", icon: Briefcase, path: "/browse-equipment" },
    { label: "Bookings", icon: Bell, path: "/my-bookings" },
    { label: "Create", icon: PlusSquare, path: "/create-post" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E8E8] px-6 h-16 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

        {/* Left: Brand & Search */}
        <div className="flex items-center gap-6">
          <Link to="/feed" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-xl flex items-center justify-center shadow-lg shadow-green-100 group-hover:scale-105 transition-transform">
              <Sprout className="text-white w-5 h-5" />
            </div>
            <span className="hidden lg:block font-bold text-[#1A2E1A] tracking-tight">Farmer<span className="text-[#2E7D32]">Bridge</span></span>
          </Link>

          <div className="hidden md:flex items-center bg-[#F1F3F4] px-4 py-2 rounded-xl group focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2E7D32]/20 transition-all border border-transparent focus-within:border-[#2E7D32]/30">
            <Search className="w-4 h-4 text-[#5F6368]" />
            <input
              type="text"
              placeholder="Search ecosystem..."
              className="bg-transparent border-none outline-none text-sm ml-3 w-48 lg:w-64 text-[#1A2E1A] placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Right: Nav items */}
        <div className="flex items-center gap-1 lg:gap-4">
          {navItems.filter(item => item.show !== false).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center h-14 w-14 lg:w-20 group transition-all ${location.pathname === item.path ? "text-[#2E7D32]" : "text-[#5F6368] hover:text-[#2E7D32]"
                }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:-translate-y-0.5 ${location.pathname === item.path ? "fill-[#2E7D32]/10" : ""
                }`} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter hidden lg:block">{item.label}</span>
              {location.pathname === item.path && (
                <div className="absolute bottom-0 left-2 right-2 h-1 bg-[#2E7D32] rounded-t-full" />
              )}
            </Link>
          ))}

          <div className="h-8 w-[1px] bg-gray-200 mx-2" />

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center h-14 w-14 lg:w-20 group transition-all ${location.pathname === "/profile" ? "text-[#2E7D32]" : "text-[#5F6368] hover:text-[#2E7D32]"
              }`}
          >
            <UserCircle className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter hidden lg:block">Me</span>
          </Link>

          <button
            onClick={logout}
            className="flex flex-col items-center justify-center h-14 w-14 lg:w-20 text-[#5F6368] hover:text-red-500 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter hidden lg:block">Sign Out</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
