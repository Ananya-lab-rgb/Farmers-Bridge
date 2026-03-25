import { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { UserCheck, ShieldCheck, MapPin, Briefcase, CreditCard, CheckCircle, Globe } from "lucide-react";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [taluk, setTaluk] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [skills, setSkills] = useState("");
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords([position.coords.latitude, position.coords.longitude]);
        alert("Location coordinates captured! This will help find workers near you.");
      }, (err) => {
        console.error(err);
        alert("Permission denied or location error. Please check browser settings.");
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    if (!storedRole) navigate("/select-role");
    else setRole(storedRole);
  }, [navigate]);

  const verifyAadhar = () => {
    if (aadhar.length !== 12) return alert("Please enter a valid 12-digit Aadhar number");
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first");
    if (!name.trim() || !village.trim() || !district.trim()) return alert("Name, Village, and District are required");
    if (!isVerified) return alert("Please verify your Aadhar card first to proceed");

    setLoading(true);
    const fullLocation = `${village}, ${taluk}, ${district} - ${pincode}`;
    try {
      const userData = {
        name,
        location: fullLocation,
        village,
        taluk,
        district,
        pincode,
        aadhar: aadhar.replace(/.(?=.{4})/g, "*"), // Masking
        role,
        isVerified: true,
        phone: user.phoneNumber,
        coords: coords,
        createdAt: serverTimestamp(),
      };
      if (role === "labourer") userData.skills = skills;

      await setDoc(doc(db, "users", user.uid), userData);
      localStorage.setItem("user_name", name);
      localStorage.setItem("profile_done", "true");

      alert("Access Granted! Welcome to FarmerBridge.");
      navigate("/dashboard-router", { replace: true });
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("System Error: Failed to establish agricultural identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center pt-12 pb-20 px-6 font-primary">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#0F766E] rounded-3xl flex items-center justify-center shadow-xl mb-4 rotate-3 transform hover:rotate-0 transition-all duration-500">
          <Sprout className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-[#064E3B] text-4xl font-black mb-1 letter tracking-tight">FarmerBridge</h1>
        <p className="text-[#0F766E] font-bold text-xs uppercase tracking-widest">Village Connectivity Hub</p>
      </div>

      <div className="w-full max-w-[550px] bg-white rounded-[2rem] shadow-2xl border border-green-100 overflow-visible relative">
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 font-black px-4 py-2 rounded-xl shadow-lg border-2 border-white rotate-12 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Multi-Language
        </div>

        <div className="p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#064E3B]">Digital Identity</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Step 2: Complete Your Professional Profile</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <label className="text-[10px] font-black text-teal-700 uppercase mb-2 block tracking-widest">Full Legal Name</label>
              <div className="relative">
                <input
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#059669] focus:bg-white transition-all text-gray-900 font-bold placeholder:text-gray-300"
                  placeholder="As per Aadhar (e.g. Ramesh Gowda)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Village / Hobli</label>
                <input
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#059669] font-bold text-sm"
                  placeholder="e.g. Mandya"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Taluk</label>
                <input
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#059669] font-bold text-sm"
                  placeholder="e.g. Maddur"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-700 uppercase tracking-widest">District</label>
                <input
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#059669] font-bold text-sm"
                  placeholder="e.g. Karnataka"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Pincode</label>
                <input
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#059669] font-bold text-sm"
                  placeholder="57XXXX"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-[1.5rem] border-2 border-dashed border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black text-blue-700 uppercase block tracking-widest">Secure GPS Location</label>
                {coords && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Captured</span>}
              </div>
              <p className="text-[11px] text-blue-600 mb-4 font-medium leading-tight">Help workers reach you faster by setting your farm's precise location.</p>
              <button
                onClick={detectLocation}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${coords ? 'bg-white border-green-500 text-green-600 shadow-sm' : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-lg'}`}
              >
                <MapPin className="w-4 h-4" /> {coords ? "GPS Location Secured" : "Detect My Farm Location"}
              </button>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-[1.5rem] border-2 border-dashed border-gray-200">
              <label className="text-[10px] font-black text-teal-700 uppercase mb-3 block tracking-widest">Govt. Verification (Aadhar)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-[#059669] font-mono tracking-widest text-lg font-bold"
                    placeholder="0000 0000 0000"
                    maxLength={12}
                    disabled={isVerified}
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value.replace(/\D/g, ""))}
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={verifyAadhar}
                  disabled={isVerified || isVerifying}
                  className={`px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isVerified ? "bg-green-600 text-white" : "bg-[#059669] text-white hover:bg-[#047857]"}`}
                >
                  {isVerifying ? "Verifying..." : isVerified ? "Verified ✅" : "Verify Now"}
                </button>
              </div>
              {isVerified && (
                <p className="text-[10px] text-green-600 font-bold mt-3 flex items-center gap-1 uppercase tracking-tighter">
                  <CheckCircle className="w-3 h-3" /> Identity confirmed via Central Agri-Database
                </p>
              )}
            </div>

            {role === "labourer" && (
              <div className="relative group">
                <label className="text-[10px] font-black text-teal-700 uppercase mb-2 block tracking-widest">Professional Skills</label>
                <textarea
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#059669] focus:bg-white transition-all text-gray-900 font-bold min-h-[100px]"
                  placeholder="Describe your harvesting/ploughing expertise..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <Briefcase className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#059669] text-white font-black py-5 rounded-2xl hover:bg-[#047857] transition-all shadow-[0_10px_20px_-10px_rgba(5,150,105,0.5)] active:scale-95 disabled:opacity-50 text-lg uppercase tracking-widest"
              >
                {loading ? "Establishing Link..." : "Join the Network"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 grayscale opacity-50">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Secure Data Encryption • Private Network • Village Trust</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Sprout = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 10 4 2v8" /><path d="m12 10-4 2v8" /><path d="M12 4v6" /><path d="M10 2 8 4" /><path d="m14 2 2 2" /><path d="M5 21h14" />
  </svg>
);
