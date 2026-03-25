import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";

import {
  LayoutDashboard,
  Users,
  Wrench,
  CalendarCheck,
  User,
  LogOut,
  Sprout,
  Newspaper,
  Map,
  Star
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // fetch logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Would you like to logout?")) {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const userName = localStorage.getItem("user_name") || "Member";

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Find Labourers", url: "/browse-laborers", icon: Users },
    { title: "Find Equipment", url: "/browse-equipment", icon: Wrench },
    { title: "Interactive Map", url: "/community-map", icon: Map },
    { title: "My Bookings", url: "/my-bookings", icon: CalendarCheck },
    { title: "Feed", url: "/feed", icon: Newspaper },
    { title: "My Profile", url: "/profile", icon: User },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b p-6 border-gray-100 bg-teal-800 text-white">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Sprout className="w-6 h-6 text-teal-800" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-lg leading-none tracking-tight">FarmerBridge</h2>
                <p className="text-[9px] text-teal-100 uppercase tracking-widest font-bold mt-1">Direct Field Network</p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400 font-bold px-4 py-2 uppercase text-[10px] tracking-widest">Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link
                          to={item.url}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${location.pathname === item.url ? "bg-teal-50 text-teal-700 shadow-sm border border-teal-100" : "hover:bg-gray-50 text-gray-600"}`}
                        >
                          <item.icon className={`w-4 h-4 ${location.pathname === item.url ? "text-teal-700" : "text-gray-400"}`} />
                          <span className={`${location.pathname === item.url ? "font-bold" : "font-medium"} text-sm`}>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-6 border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm uppercase">
                  {userName[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 leading-none">{userName}</span>
                  <span className="text-[9px] text-teal-600 font-bold uppercase mt-1.5 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-teal-600" /> Verified Member
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <header className="md:hidden border-b p-4 bg-white flex items-center justify-between sticky top-0 z-50">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-teal-700" />
              <h1 className="font-bold text-teal-900 text-sm uppercase tracking-tight">FarmerBridge</h1>
            </div>
          </header>
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
