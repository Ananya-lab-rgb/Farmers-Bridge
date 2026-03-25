import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Users, CalendarCheck, User, PlusSquare, ArrowRight, LayoutDashboard, Database, Shield } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setUserProfile(snap.data());
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCF7] flex items-center justify-center font-bold text-[#2E7D32] animate-pulse">
      Initialising Secure Ecosystem...
    </div>
  );

  const actions = [
    { title: "Social Feed", icon: PlusSquare, link: "/feed", desc: "Share updates and view active agricultural trends." },
    { title: "Find Workers", icon: Users, link: "/browse-laborers", desc: "Find and book verified skilled professionals." },
    { title: "Tools & Equipment", icon: Database, link: "/browse-equipment", desc: "Rent high-performance farm machinery." },
    { title: "My Activity", icon: CalendarCheck, link: "/my-bookings", desc: "Manage your rentals and service requests." },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF7]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold uppercase tracking-widest mb-4">
              <Shield className="w-3 h-3" /> System Verified
            </div>
            <h1 className="text-4xl font-extrabold text-[#1A2E1A] tracking-tight">
              Control <span className="text-[#2E7D32]">Center</span>
            </h1>
            <p className="text-[#4A4A4A] font-medium mt-2 flex items-center gap-2">
              Welcome back, <span className="text-[#2E7D32] font-extrabold">{userProfile?.name}</span> •
              <span className="bg-[#1A2E1A] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter ml-1">
                {userProfile?.role}
              </span>
            </p>
          </div>

          <div className="hidden lg:flex gap-4">
            <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#4A4A4A] uppercase tracking-widest leading-none">Security Level</p>
                <p className="text-sm font-extrabold text-[#1A2E1A] mt-1">Tier 1 Professional</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, idx) => (
            <Link key={idx} to={action.link} className="group">
              <div className="bg-white rounded-[2rem] border border-transparent p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(46,125,50,0.08)] hover:border-[#2E7D32]/20 transition-all h-full flex flex-col group-hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-[#F1F3F4] flex items-center justify-center mb-6 group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-300">
                  <action.icon className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-xl text-[#1A2E1A] mb-3">{action.title}</h3>
                <p className="text-sm text-[#4A4A4A] font-medium leading-relaxed mb-8">
                  {action.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[#2E7D32] text-xs font-extrabold uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                  Open Portal <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-[#1A2E1A] rounded-[2.5rem] p-10 lg:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32] rounded-full mix-blend-overlay filter blur-[60px] opacity-20"></div>

          <div className="flex-1 relative z-10">
            <h4 className="text-2xl lg:text-3xl font-bold text-white mb-4">Cultivate your reputation</h4>
            <p className="text-[#C5E1A5] font-medium max-w-xl leading-relaxed">
              Keep your professional profile updated and engage with the community to increase your visibility. Verified professionals get 75% more booking requests in their local district.
            </p>
          </div>
          <Link to="/profile" className="relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto bg-[#2E7D32] text-white font-extrabold px-10 py-5 rounded-2xl hover:bg-[#1B5E20] transition-all shadow-xl shadow-green-900/20 active:scale-95">
              Refine My Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
