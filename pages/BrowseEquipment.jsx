import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Search, MapPin, Star, Wrench, ShieldCheck, Map as MapIcon, Globe, Languages, Mic, Keyboard, X, Tractor } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BookingModal from "@/components/bookings/BookingModal.jsx";

// Leaflet Icon fix
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const KARNATAKA_CENTER = [15.3173, 75.7139];

export default function BrowseEquipment() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eqSnap = await getDocs(collection(db, "equipment"));
        const eList = eqSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEquipmentList(eList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEquipment = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return equipmentList.filter((eq) => {
      const name = (eq.name || "").toLowerCase();
      const location = (eq.location || "").toLowerCase();
      const type = (eq.type || "").toLowerCase();

      const matchesSearch = name.includes(q) || location.includes(q);
      const matchesType = selectedType === "all" || type.includes(selectedType.toLowerCase());
      return matchesSearch && matchesType;
    });
  }, [equipmentList, searchQuery, selectedType]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-6">

        <header className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-700 flex items-center justify-center text-white">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Equipment Store</h1>
              <p className="text-xs font-medium text-gray-500">Rent machinery and equipment</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search tractors, harvesters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-700/5 focus:border-amber-700 transition-all font-bold"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none cursor-pointer focus:border-amber-700 transition-all"
            >
              <option value="all">All Types</option>

              {["Tractor", "Harvester", "Plough", "Seeder"].map(s => (
                <option key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>
        </header>



        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 flex flex-col gap-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-56 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                {filteredEquipment.length === 0 ? (
                  <div className="col-span-full bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 text-gray-400 font-bold">
                    No results found for current search.
                  </div>
                ) : (
                  filteredEquipment.map(eq => (
                    <div key={eq.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-amber-700/30 transition-all group shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-3xl text-amber-700 border border-amber-100 flex-shrink-0">
                          <Tractor className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 uppercase truncate leading-tight">{eq.name}</h3>
                          <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5" /> {eq.location}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="bg-green-50 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-green-100 uppercase tracking-widest flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-100 uppercase">
                          {eq.type || 'Machinery'}
                        </span>
                        <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-100 uppercase">
                          {eq.brand || 'Verified Owner'}
                        </span>
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Rate</span>
                          <span className="text-lg font-black text-gray-900">₹{eq.rate || eq.daily_rate}<small className="text-[10px] ml-0.5">/day</small></span>
                        </div>
                        <button
                          onClick={() => { setSelectedEquipment(eq); setShowBookingModal(true); }}
                          className="bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-800 transition-all active:scale-95 shadow-md shadow-amber-700/10"
                        >
                          Rent Now
                        </button>

                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="xl:col-span-4 sticky top-10 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm h-[600px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-amber-700" /> Logistics Map
                </h3>

              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 relative z-0">
                <MapContainer center={KARNATAKA_CENTER} zoom={7} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {equipmentList.filter(eq => Array.isArray(eq.coords)).map(eq => (
                    <Marker
                      key={`mark-${eq.id}`}
                      position={eq.coords}
                      icon={L.divIcon({
                        html: `<div class="flex flex-col items-center" style="transform: translate(-50%, -100%);">
                                 <div class="bg-white px-2 py-0.5 rounded shadow-md text-[10px] font-bold border border-amber-200 mb-1 whitespace-nowrap text-gray-800">
                                   ${eq.name}
                                 </div>
                                 <div class="w-4 h-4 rounded-full bg-amber-700 border-2 border-white shadow-sm"></div>
                               </div>`,
                        className: '',
                        iconSize: [0, 0],
                      })}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="font-bold uppercase text-amber-700 text-xs">{eq.name}</div>
                          <div className="text-[9px] text-gray-500 font-bold">{eq.location}</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          bookingType="equipment"
          item={selectedEquipment}
          onClose={() => { setShowBookingModal(false); setSelectedEquipment(null); }}
        />
      )}
    </div>
  );
}
