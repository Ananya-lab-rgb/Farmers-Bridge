import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import Navbar from "@/components/Navbar";
import { MapPin, Briefcase, Camera, Pencil, ShieldCheck, Globe, CheckCircle } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    role: "",
    skills: "",
    coords: null
  });
  const [loading, setLoading] = useState(true);

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          coords: [position.coords.latitude, position.coords.longitude]
        }));
        alert("Location coordinates captured! Click 'Save Profile' to finalize.");
      }, (err) => {
        console.error(err);
        alert("Permission denied or location error. Please check browser settings.");
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setFormData(snap.data());
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), formData);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center font-bold text-gray-400">Loading your profile...</div>;

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-blue-700 to-blue-500 relative">
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center text-4xl font-bold text-white bg-[#0a66c2]">
                {formData.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={saveProfile}
                className="bg-[#0a66c2] text-white font-bold px-6 py-1.5 rounded-full hover:bg-[#004182] transition-colors shadow-sm"
              >
                Save Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <input
                    className="text-2xl font-bold text-gray-900 border-none p-0 outline-none w-full focus:ring-0 placeholder:text-gray-300"
                    placeholder="Your Full Name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <p className="text-gray-600 font-medium flex items-center gap-1.5 mt-1">
                    <Briefcase className="w-4 h-4" /> {formData.role?.charAt(0).toUpperCase() + formData.role?.slice(1)} at FarmerBridge Community
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4" /> {formData.location || "Earth"} • <span className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">Contact Info</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" /> Professional Summary
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-gray-600 text-sm">
                    "Serving the agricultural community with dedication and professional expertise. Looking to connect with value-driven partners."
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" /> Regional Expertise
                    </h3>
                    <button
                      onClick={detectLocation}
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded border transition-all ${formData.coords ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                    >
                      {formData.coords ? (
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Coordinates Set</span>
                      ) : (
                        "Update My Coordinates"
                      )}
                    </button>
                  </div>
                  <input
                    className="w-full bg-[#f3f2ef] border-transparent rounded px-3 py-2 text-sm focus:bg-white focus:border-blue-600 outline-none transition-all font-medium"
                    placeholder="Enter your location/region"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  {formData.coords && (
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      Precise GPS: {formData.coords[0].toFixed(4)}, {formData.coords[1].toFixed(4)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {formData.role === "labourer" && (
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 border-dashed">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-4 flex items-center justify-between">
                      Skills & Endorsements
                      <Pencil className="w-3 h-3 text-gray-400 cursor-pointer" />
                    </h4>
                    <textarea
                      className="w-full min-h-[100px] bg-transparent border-none outline-none text-sm text-gray-600 font-medium resize-none placeholder:text-gray-300"
                      placeholder="Tractor Driving, Harvesting, Organic Farming..."
                      value={formData.skills || ""}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                  </div>
                )}

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <h4 className="font-bold text-blue-800 text-[10px] uppercase tracking-widest mb-2">Network Strength</h4>
                  <div className="flex gap-1 mb-2">
                    <div className="h-1 flex-1 bg-blue-600 rounded"></div>
                    <div className="h-1 flex-1 bg-blue-600 rounded"></div>
                    <div className="h-1 flex-1 bg-blue-200 rounded"></div>
                    <div className="h-1 flex-1 bg-blue-200 rounded"></div>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold">Intermmediate • Connect with more owners!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
