import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "@/entities/Layout.jsx";
import AuthGate from "@/auth/AuthGate.jsx";

import Dashboard from "@/pages/Dashboard.jsx";
import DashboardRouter from "@/pages/DashboardRouter.jsx";

import BrowseLaborers from "@/pages/BrowseLaborers.jsx";
import BrowseEquipment from "@/pages/BrowseEquipment.jsx";
import AddEquipment from "@/pages/AddEquipment.jsx";
import MyBookings from "@/pages/MyBookings.jsx";
import CommunityMap from "@/pages/CommunityMap.jsx";


import Profile from "@/pages/Profile.jsx";
import CompleteProfile from "@/pages/CompleteProfile.jsx";

import Feed from "@/pages/Feed.jsx";
import CreatePost from "@/pages/CreatePost.jsx";

import SelectRole from "@/pages/SelectRole.jsx";
import Auth from "@/pages/Auth.jsx";
import SeedData from "@/pages/SeedData.jsx";
import Landing from "@/pages/Landing.jsx";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/seed" element={<SeedData />} />

        {/* REDIRECT AFTER LOGIN */}
        <Route path="/dashboard-router" element={<DashboardRouter />} />

        {/* PROTECTED */}
        <Route element={<AuthGate />}>

          {/* NO SIDEBAR */}
          <Route path="/select-role" element={<SelectRole />} />

          {/* WITH SIDEBAR */}
          <Route element={<Layout />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/feed" element={<Feed />} />

            <Route path="/create-post" element={<CreatePost />} />

            <Route path="/browse-laborers" element={<BrowseLaborers />} />

            <Route path="/browse-equipment" element={<BrowseEquipment />} />

            <Route path="/add-equipment" element={<AddEquipment />} />

            <Route path="/my-bookings" element={<MyBookings />} />

            <Route path="/community-map" element={<CommunityMap />} />



            <Route path="/profile" element={<Profile />} />

            <Route path="/setup-profile" element={<CompleteProfile />} />

          </Route>

        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;
