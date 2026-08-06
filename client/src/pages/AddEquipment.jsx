import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useNavigate } from "react-router-dom";
import { Wrench, MapPin, IndianRupee, Info, PlusCircle } from "lucide-react";
import VoiceInput from "@/components/ui/VoiceInput";
import SpeakButton from "@/components/ui/SpeakButton";

export default function AddEquipment() {
    const [name, setName] = useState("");
    const [type, setType] = useState("tractor");
    const [rate, setRate] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdd = async () => {
        const user = auth.currentUser;
        if (!user) return alert("Login first");
        if (!name || !rate || !location) return alert("Please fill all fields");

        setLoading(true);
        try {
            await addDoc(collection(db, "equipment"), {
                ownerId: user.uid,
                name,
                type,
                rate: Number(rate),
                location,
                isActive: true,
                timestamp: serverTimestamp(),
                brand: "Verified Owner",
                coords: [12.9716, 77.5946] // Using a default loc for map visibility
            });

            alert("Equipment listed successfully");
            navigate("/browse-equipment");
        } catch (error) {
            console.error("Error listing equipment:", error);
            alert("Failed to list equipment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-12">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    <div className="bg-amber-700 px-8 py-8 text-white flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2 uppercase tracking-tight">
                                <PlusCircle className="w-6 h-6" /> Grow Business
                            </h2>
                            <p className="text-amber-100/80 text-sm mt-1 font-medium">Add your machinery to the regional marketplace</p>
                        </div>
                        <SpeakButton textToSpeak="Please fill out the form to add your machinery. Specify the machine name, category, rent per day, and location. Click publish record when you are done." />
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Machine Name</label>
                            <VoiceInput
                                className="w-full"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Swaraj 855 FE"
                                icon={Wrench}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Category</label>
                            <select
                                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition-all text-gray-900 font-bold appearance-none cursor-pointer"
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <option value="tractor">Tractor</option>
                                <option value="harvester">Harvester</option>
                                <option value="plough">Plough</option>
                                <option value="seeder">Seeder</option>
                                <option value="sprayer">Sprayer</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Rent / Day</label>
                                <VoiceInput
                                    type="number"
                                    className="w-full"
                                    value={rate}
                                    onChange={e => setRate(e.target.value)}
                                    placeholder="e.g. 1500"
                                    icon={IndianRupee}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Village/City</label>
                                <VoiceInput
                                    className="w-full"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="Location name"
                                    icon={MapPin}
                                />
                            </div>
                        </div>

                        <div className="bg-amber-50/50 p-4 rounded-xl flex gap-3 border border-amber-100">
                            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight leading-relaxed">
                                Machines listed here must have valid service papers. You will receive notifications when a farmer books your machinery.
                            </p>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="w-full bg-amber-700 text-white font-bold py-4 rounded-xl hover:bg-amber-800 transition-all shadow-lg shadow-amber-700/10 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
                        >
                            Publish Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
