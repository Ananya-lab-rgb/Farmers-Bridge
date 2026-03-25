import React from "react";
import { useNavigate } from "react-router-dom";
import { Tractor, UserRound, HardHat } from "lucide-react";

export default function SelectRole() {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    localStorage.setItem("user_role", role);
    navigate("/setup-profile", { replace: true });
  };

  const roles = [
    { id: "farmer", title: "Farmer", desc: "Hire laborers and rent equipment", icon: Tractor, color: "bg-green-100 text-green-600" },
    { id: "labourer", title: "Laborer", desc: "Find work and provide skills", icon: HardHat, color: "bg-blue-100 text-blue-600" },
    { id: "equipment_owner", title: "Owner", desc: "List and manage your equipment", icon: UserRound, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How do you want to use FarmerBridge?</h1>
        <p className="text-gray-600 mb-8 font-medium">Choose the role that best fits your needs. You can always change this later.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => chooseRole(r.id)}
              className="group flex flex-col items-center p-6 border-2 border-transparent hover:border-[#0a66c2] hover:bg-blue-50 bg-gray-50 rounded-xl transition-all text-center"
            >
              <div className={`p-4 rounded-full ${r.color} mb-4 group-hover:scale-110 transition-transform`}>
                <r.icon className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{r.title}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
