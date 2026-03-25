import React, { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { Database, CheckCircle, AlertTriangle, MapPin } from "lucide-react";

export default function SeedData() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const seedDatabase = async () => {
        setLoading(true);
        setStatus("Cleaning up legacy records & Generating Karnataka-specific demo data...");
        try {
            // 0. Cleanup unwanted data (Likitha and Anu - Move to Archive)
            const bookingsSnap = await getDocs(collection(db, "bookings"));
            for (const bDoc of bookingsSnap.docs) {
                const data = bDoc.data();
                const names = [data.laborerName, data.farmerName, data.equipmentName].map(n => (n || "").toLowerCase());
                if (names.some(n => n.includes("likitha") || n.includes("anu"))) {
                    // Soft-delete: Move to history archive instead of deleting
                    await setDoc(doc(db, "bookings", bDoc.id), { isDeleted: true }, { merge: true });
                    console.log(`Archived unwanted booking: ${bDoc.id}`);
                }
            }

            // 1. Create Demo Laborers (Stored in users collection)
            const laborers = [
                { uid: "demo_lab_ka_1", name: "Manjunath Gowda", location: "Merlapadavu, Mangaluru", role: "labourer", skills: "Tobacco harvesting, Pepper climbing", phone: "+91 9111111111", coords: [12.8718, 74.9317], rate: 450 },
                { uid: "demo_lab_ka_2", name: "Shivappa Nayaka", location: "Valachil, Mangaluru", role: "labourer", skills: "Arecanut peeling, Paddy harvesting", phone: "+91 9222222222", coords: [12.8687, 74.9255], rate: 500 },
                { uid: "demo_lab_ka_3", name: "Basavaraj Patil", location: "Adyar, Mangaluru", role: "labourer", skills: "Cotton picking, Tractor driving", phone: "+91 9333333333", coords: [12.8680, 74.9150], rate: 550 },
                { uid: "demo_lab_ka_4", name: "Kushal Kumar", location: "Mangaluru, Karnataka", role: "labourer", skills: "Coconut plucking, Fishing nets maintenance", phone: "+91 9444444444", coords: [12.9141, 74.8560], rate: 600 },
                { uid: "demo_lab_ka_5", name: "Anatha", location: "Ballari, Karnataka", role: "labourer", skills: "Mining logistics, Groundnut harvesting", phone: "+91 9555555555", coords: [15.1394, 76.9214], rate: 480 },
                { uid: "demo_lab_ka_6", name: "Somanna", location: "Chamarajanagar, Karnataka", role: "labourer", skills: "Silk rearing, Turmeric processing", phone: "+91 9666666666", coords: [11.9261, 76.9437], rate: 420 },
                { uid: "demo_lab_ka_7", name: "Sunil Verma", location: "Arkula, Mangaluru", role: "labourer", skills: "Coconut climbing, Arecanut processing", phone: "+91 9845012345", coords: [12.8700, 74.9500], rate: 480 },
            ];

            // 1b. Create Demo Farmers
            const farmers = [
                { uid: "demo_farmer_ka_1", name: "Kariappa", location: "Kodagu, Karnataka", role: "farmer", phone: "+91 9777777777", coords: [12.3375, 75.8069] },
                { uid: "demo_farmer_ka_2", name: "Ramesh Hegde", location: "Sirsi, Karnataka", role: "farmer", phone: "+91 9888888888", coords: [14.6195, 74.8441] },
                { uid: "demo_farmer_ka_3", name: "Chennappa", location: "Mandya, Karnataka", role: "farmer", phone: "+91 9999999999", coords: [12.5218, 76.8951] },
            ];

            const allUsers = [...laborers, ...farmers];

            for (const user of allUsers) {
                await setDoc(doc(db, "users", user.uid), {
                    ...user,
                    createdAt: serverTimestamp(),
                    profile_done: true
                });
            }

            // 2. Create Demo Equipment
            const equipment = [
                { name: "Swaraj 744 FE", type: "tractor", rate: 2100, location: "Tumakuru, Karnataka", brand: "Swaraj", isActive: true, coords: [13.3392, 77.1003] },
                { name: "Mahindra Yuvo 575", type: "tractor", rate: 2300, location: "Davangere, Karnataka", brand: "Mahindra", isActive: true, coords: [14.4644, 75.9218] },
                { name: "John Deere 5105", type: "tractor", rate: 2600, location: "Belagavi, Karnataka", brand: "John Deere", isActive: true, coords: [15.8497, 74.4977] },
                { name: "Power Tiller Kubota", type: "other", rate: 1200, location: "Chikkamagaluru, Karnataka", brand: "Kubota", isActive: true, coords: [13.3161, 75.7720] },
                { name: "New Holland 3630", type: "tractor", rate: 2800, location: "Vijayapur, Karnataka", brand: "New Holland", isActive: true, coords: [16.8302, 75.7100] },
                { name: "Kartar Combine", type: "harvester", rate: 4500, location: "Raichur, Karnataka", brand: "Kartar", isActive: true, coords: [16.2120, 77.3439] },
            ];

            for (const eq of equipment) {
                await addDoc(collection(db, "equipment"), {
                    ...eq,
                    ownerId: "demo_owner_ka_1",
                    timestamp: serverTimestamp()
                });
            }

            // 3. Create Demo Posts
            const posts = [
                { content: "Arecanut season is starting in Mangaluru! Any experienced climbers available for next week?", authorName: "Shivappa Nayaka", authorRole: "labourer", authorId: "demo_lab_ka_2" },
                { content: "Coffee picking machines available for rent in Chikkamagaluru region. DM for details.", authorName: "Estate Owner", authorRole: "equipment_owner", authorId: "demo_owner_ka_1" },
                { content: "The rains in Kodagu are helping the black pepper vines. Expected good yield this year.", authorName: "Kariappa", authorRole: "farmer", authorId: "demo_farmer_ka_1" },
                { content: "New tractor subsidies are now live for Ballari district farmers. Check the local office.", authorName: "Anatha", authorRole: "labourer", authorId: "demo_lab_ka_5" },
            ];

            for (const post of posts) {
                await addDoc(collection(db, "posts"), {
                    ...post,
                    timestamp: serverTimestamp(),
                    likes: Math.floor(Math.random() * 30),
                    comments: []
                });
            }

            // 4. Create Demo Bookings (Booking History)
            const demoBookings = [
                {
                    farmerId: "demo_farmer_ka_1",
                    farmerName: "Kariappa",
                    farmerPhone: "+91 9777777777",
                    laborerId: "demo_lab_ka_5",
                    laborerName: "Anatha",
                    laborerPhone: "+91 9555555555",
                    ownerId: "demo_lab_ka_5",
                    status: "accepted",
                    timestamp: Date.now() - (3600000 * 24 * 2), // 2 days ago
                    workDescription: "Groundnut harvesting in Kodagu"
                },
                {
                    farmerId: "demo_farmer_ka_2",
                    farmerName: "Ramesh Hegde",
                    farmerPhone: "+91 9888888888",
                    laborerId: "demo_lab_ka_2",
                    laborerName: "Shivappa Nayaka",
                    laborerPhone: "+91 9222222222",
                    ownerId: "demo_lab_ka_2",
                    status: "pending",
                    timestamp: Date.now() - 3600000, // 1 hour ago
                    workDescription: "Arecanut peeling request"
                },
                {
                    farmerId: "demo_farmer_ka_3",
                    farmerName: "Chennappa",
                    farmerPhone: "+91 9999999999",
                    laborerId: "demo_lab_ka_1",
                    laborerName: "Manjunath Gowda",
                    laborerPhone: "+91 9111111111",
                    ownerId: "demo_lab_ka_1",
                    status: "completed",
                    timestamp: Date.now() - (3600000 * 24 * 5), // 5 days ago
                    workDescription: "Paddy harvesting assistance"
                },
                {
                    farmerId: "demo_farmer_ka_1",
                    farmerName: "Kariappa",
                    farmerPhone: "+91 9777777777",
                    laborerId: "demo_lab_ka_5",
                    laborerName: "Anatha",
                    laborerPhone: "+91 9555555555",
                    status: "rejected",
                    timestamp: Date.now() - (3600000 * 24 * 10), // 10 days ago
                    workDescription: "Old cancelled request for Coconut plucking",
                    isDeleted: true
                }
            ];

            for (const booking of demoBookings) {
                await addDoc(collection(db, "bookings"), {
                    ...booking,
                    createdAt: serverTimestamp()
                });
            }

            setStatus("Success! Karnataka-focused demo records and booking history added.");
        } catch (error) {
            console.error(error);
            setStatus("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f2ef]">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 text-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Karnataka Data Seeder</h1>
                    <p className="text-gray-600 mb-8">
                        Populate your app with demo users and equipment from Mysore, Hubli, Mangalore, and other Karnataka regions.
                    </p>

                    <button
                        onClick={seedDatabase}
                        disabled={loading}
                        className="w-full bg-[#0F766E] text-white font-bold py-4 rounded-full hover:bg-[#0D5E58] transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Adding Karnataka Data..." : "Seed Karnataka Dataset"}
                    </button>

                    {status && (
                        <div className={`mt-8 p-4 rounded-lg flex items-center gap-3 ${status.includes("Error") ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}>
                            {status.includes("Success") ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <p className="text-sm font-bold">{status}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
