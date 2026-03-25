import React from "react";
import { MapPin, Star, Settings, ShieldCheck } from "lucide-react";

export default function EquipmentCard({ equipment, onBook }) {
  const equipmentImage = equipment.images?.[0] ||
    `https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
      <div className="h-40 bg-[#e8ebee] flex items-center justify-center relative overflow-hidden">
        <img
          src={equipmentImage}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-gray-700 border border-gray-200 uppercase tracking-widest shadow-sm">
          {equipment.equipment_type || "Machinery"}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-3">
        <div>
          <h4 className="font-bold text-gray-900 group-hover:text-[#0a66c2] transition-colors uppercase truncate tracking-tight">
            {equipment.name}
          </h4>
          <p className="text-[10px] text-[#0a66c2] font-bold uppercase tracking-widest mt-1">
            {equipment.brand || "Industrial Grade"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {equipment.location}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-orange-500">
              <Star className="w-3 h-3 fill-orange-500" />
              <span className="text-[11px] font-bold">4.8</span>
            </div>
            <span className="text-[11px] text-gray-400 font-bold">•</span>
            <span className="text-[11px] text-gray-500 font-bold uppercase">{equipment.total_bookings || 12} Rentals</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rate (Per Day)</p>
            <p className="text-lg font-black text-gray-900 leading-none mt-1">₹{equipment.daily_rate || equipment.rate}</p>
          </div>
          <button
            onClick={() => onBook(equipment)}
            className="bg-[#0a66c2] text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-[#004182] transition-colors shadow-sm"
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
}
