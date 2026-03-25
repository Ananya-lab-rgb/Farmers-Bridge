import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Search, MapPin, Star, UserCheck, Map as MapIcon, Globe, Languages, Mic, Keyboard, X, Users } from "lucide-react";
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

const getDistance = (coords1, coords2) => {
  if (!coords1 || !coords2) return Infinity;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


export default function BrowseLaborers() {
  const [laborers, setLaborers] = useState([]);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedLaborer, setSelectedLaborer] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserCoords(userDoc.data().coords);
          }
        }

        const snapshot = await getDocs(collection(db, "users"));
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLaborers(list.filter(user => user.role === "labourer"));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLaborers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = laborers.filter(l => {
      const name = (l.name || "").toLowerCase();
      const location = (l.location || "").toLowerCase();
      const skills = (l.skills || "").toLowerCase();
      const matchesSearch = name.includes(q) || location.includes(q) || skills.includes(q);
      const matchesSkill = selectedSkill === "all" || skills.includes(selectedSkill.toLowerCase());
      return matchesSearch && matchesSkill;
    });

    if (userCoords) {
      list = list.sort((a, b) => {
        const distA = getDistance(userCoords, a.coords);
        const distB = getDistance(userCoords, b.coords);
        return distA - distB;
      });
    }

    return list;
  }, [laborers, searchQuery, selectedSkill, userCoords]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-6">

        <header className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Workers</h1>
              <p className="text-xs font-medium text-gray-500">Connect with skilled workers in your area</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search by name, village, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-700/5 focus:border-teal-700 transition-all font-bold"
              />
            </div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none cursor-pointer focus:border-teal-700 transition-all"
            >
              <option value="all">All Skills</option>

              {["Harvesting", "Ploughing", "Sowing", "Tractor"].map(s => (
                <option key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>
        </header>



        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 flex flex-col gap-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                {filteredLaborers.length === 0 ? (
                  <div className="col-span-full bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 text-gray-400 font-bold">
                    No results found for current search.
                  </div>
                ) : (
                  filteredLaborers.map(laborer => (
                    <div key={laborer.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-teal-700/30 transition-all group shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center text-xl font-black text-teal-700 border border-teal-100 uppercase flex-shrink-0">
                          {laborer.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 uppercase truncate leading-tight">{laborer.name}</h3>
                          <p className="text-xs font-bold text-teal-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {laborer.location || "Local"}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="bg-amber-50 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-widest flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-700" /> Verified
                            </span>
                            {userCoords && laborer.coords && (
                              <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-widest flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" /> {getDistance(userCoords, laborer.coords).toFixed(1)} km away
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(laborer.skills || "").split(",").filter(Boolean).map((s, idx) => (
                          <span key={idx} className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-100 uppercase">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Daily Rate</span>
                          <span className="text-lg font-black text-gray-900">₹{laborer.rate || "450"}<small className="text-[10px] ml-0.5">/day</small></span>
                        </div>
                        <button
                          onClick={() => { setSelectedLaborer(laborer); setShowModal(true); }}
                          className="bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-800 transition-all active:scale-95 shadow-md shadow-teal-700/10"
                        >
                          Book Now
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
                  <MapIcon className="w-4 h-4 text-teal-700" /> Regional View
                </h3>

              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 relative z-0">
                <MapContainer center={KARNATAKA_CENTER} zoom={7} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {laborers.filter(l => Array.isArray(l.coords)).map(l => (
                    <Marker
                      key={`mark-${l.id}`}
                      position={l.coords}
                      icon={L.divIcon({
                        html: `<div class="flex flex-col items-center" style="transform: translate(-50%, -100%);">
                                 <div class="bg-white px-2 py-0.5 rounded shadow-md text-[10px] font-bold border border-teal-200 mb-1 whitespace-nowrap text-gray-800">
                                   ${l.name}
                                 </div>
                                 <div class="w-4 h-4 rounded-full bg-teal-700 border-2 border-white shadow-sm"></div>
                               </div>`,
                        className: '',
                        iconSize: [0, 0],
                      })}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="font-bold uppercase text-teal-700 text-xs">{l.name}</div>
                          <div className="text-[9px] text-gray-500 font-bold">{l.location}</div>
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

      {showModal && (
        <BookingModal
          bookingType="laborer"
          item={selectedLaborer}
          onClose={() => { setShowModal(false); setSelectedLaborer(null); }}
        />
      )}
    </div>
  );
}
