import React from "react";
import { MapPin, Star, Briefcase, ShieldCheck } from "lucide-react";

export default function LaborerCard({ laborer = {}, onBook }) {
  const name = laborer.name || "Skilled Professional";
  const location = laborer.location || "Location not specified";
  const skillsArray = laborer.skills?.split(",").map(s => s.trim()) || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Identity */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-[#0a66c2] flex items-center justify-center text-3xl font-bold text-white shadow-inner group-hover:scale-105 transition-transform">
            {name[0]?.toUpperCase()}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#0a66c2] transition-colors uppercase tracking-tight">
                {name}
              </h4>
              <p className="text-[#0a66c2] text-sm font-semibold flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3.5 h-3.5" /> Certified Farm Specialist
              </p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 text-[10px] font-bold ring-1 ring-green-200 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> Verified
            </div>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-gray-400" /> {location}
          </p>

          <div className="flex flex-wrap gap-2 py-1">
            {skillsArray.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-50 mt-2">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pricing Plan</p>
              <div className="text-gray-900 mt-1">
                <span className="text-lg font-black">₹220</span>
                <span className="text-[10px] text-gray-500 font-bold italic ml-1">/ DAY</span>
              </div>
            </div>
            <button
              onClick={() => onBook?.(laborer)}
              className="bg-white text-[#0a66c2] border-2 border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white px-8 py-2 rounded-full font-bold transition-all shadow-sm hover:shadow"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
