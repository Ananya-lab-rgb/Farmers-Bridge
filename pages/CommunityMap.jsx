import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Map as MapIcon, Users, Wrench, MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet with Webpack/Vite
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

export default function CommunityMap() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const equipmentSnap = await getDocs(collection(db, "equipment"));

                const userLocs = usersSnap.docs
                    .map(doc => ({ id: doc.id, type: "user", ...doc.data() }))
                    .filter(u => u.coords && Array.isArray(u.coords));

                const equipLocs = equipmentSnap.docs
                    .map(doc => ({ id: doc.id, type: "equipment", ...doc.data() }))
                    .filter(e => e.coords && Array.isArray(e.coords));

                setLocations([...userLocs, ...equipLocs]);
            } catch (error) {
                console.error("Error fetching map coordinates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <MapIcon className="w-6 h-6 text-teal-700" /> State Network Hub
                            </h1>
                            <p className="text-sm text-gray-500 font-medium tracking-tight">Viewing all active nodes across Karnataka</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                <div className="w-3 h-3 rounded-full bg-blue-600" />
                                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Labourers</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                <div className="w-3 h-3 rounded-full bg-green-600" />
                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Farmers</span>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                                <div className="w-3 h-3 rounded-full bg-amber-600" />
                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Equipment</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden h-[70vh] relative z-0">
                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100/50 animate-pulse">
                                <MapIcon className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Live Coordinates...</p>
                            </div>
                        ) : (
                            <MapContainer center={KARNATAKA_CENTER} zoom={7} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {locations.map((loc) => (
                                    <Marker
                                        key={`mark-${loc.type}-${loc.id}`}
                                        position={loc.coords}
                                        icon={L.divIcon({
                                            html: `<div class="flex flex-col items-center" style="transform: translate(-50%, -100%);">
                                                     <div class="bg-white px-2 py-0.5 rounded shadow-md text-[10px] font-bold border ${loc.type === 'user' ? (loc.role === 'farmer' ? 'border-green-200' : 'border-blue-200') : 'border-amber-200'} mb-1 whitespace-nowrap text-gray-800">
                                                       ${loc.name}
                                                     </div>
                                                     <div class="w-4 h-4 rounded-full ${loc.type === 'user' ? (loc.role === 'farmer' ? 'bg-green-600' : 'bg-blue-600') : 'bg-amber-600'} border-2 border-white shadow-sm"></div>
                                                   </div>`,
                                            className: '',
                                            iconSize: [0, 0],
                                        })}
                                    >
                                        <Popup>
                                            <div className="p-1 min-w-[150px]">
                                                <h4 className="font-bold text-gray-950 uppercase text-sm mb-1">{loc.name}</h4>
                                                <p className="text-[10px] font-bold text-teal-700 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {loc.location}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-widest">
                                                    {loc.type === "user" ? loc.role : "Equipment"}
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
