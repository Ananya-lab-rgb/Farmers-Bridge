import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";
import { db, auth } from "@/firebase";
import { RefreshCw, Calendar, CheckCircle2, Clock, XCircle, User, Phone, Trash2 } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return setLoading(false);

      const storedRole = localStorage.getItem("user_role");
      let q;

      if (storedRole === "farmer") {
        q = query(
          collection(db, "bookings"),
          where("farmerId", "==", user.uid)
        );
      } else if (storedRole === "labourer") {
        q = query(
          collection(db, "bookings"),
          where("laborerId", "==", user.uid)
        );
      } else if (storedRole === "equipment_owner") {
        q = query(
          collection(db, "bookings"),
          where("ownerId", "==", user.uid)
        );
      } else {
        // Fallback for safety
        q = query(
          collection(db, "bookings"),
          where("laborerId", "==", user.uid)
        );
      }

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firebase Timestamp to JS Date if necessary
        const ts = data.timestamp?.seconds ? data.timestamp.seconds * 1000 : (data.timestamp || Date.now());
        return { id: doc.id, ...data, timestamp: ts };
      });

      console.log(`Fetched ${list.length} bookings for role: ${storedRole}`);

      // Filter based on showDeleted state
      const filtered = list.filter(b => {
        const isDeleted = b.isDeleted === true;
        return showDeleted ? isDeleted : !isDeleted;
      });

      console.log(`Showing ${filtered.length} ${showDeleted ? 'deleted' : 'active'} records`);

      // Client-side sorting
      const sortedList = filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setBookings(sortedList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for auth state changes to ensure user is loaded
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setRole(localStorage.getItem("user_role"));
        fetchBookings();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [showDeleted]);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const removeBooking = async (id) => {
    if (window.confirm("Archive this activity? You can find it in the 'Deleted History' section.")) {
      try {
        await updateDoc(doc(db, "bookings", id), { isDeleted: true });
        fetchBookings();
      } catch (error) {
        console.error(error);
        alert("System error archiving record");
      }
    }
  };

  const restoreBooking = async (id) => {
    try {
      await updateDoc(doc(db, "bookings", id), { isDeleted: false });
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Error restoring record");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {showDeleted ? "Deleted Booking History" : (role === "farmer" ? "My Recent Activity" : "Professional Requests")}
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {showDeleted ? "Viewing archived and removed records" : `Manage your ${role === "farmer" ? "bookings and rentals" : "service requests"}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleted(!showDeleted)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${showDeleted
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"
                  }`}
              >
                {showDeleted ? "View Active Log" : "View Deleted History"}
              </button>
              <button
                onClick={fetchBookings}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors group"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {loading && bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-semibold animate-pulse">Synchronizing records...</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Calendar className="w-16 h-16 mx-auto text-gray-100 mb-4" />
                <p className="text-lg font-bold text-gray-400">No {showDeleted ? "deleted items" : "activity"} yet</p>
                <p className="text-sm text-gray-400">
                  {showDeleted ? "Archived records will appear here." : "When you book a service or receive a request, it will appear here."}
                </p>
              </div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className={`p-6 hover:bg-gray-50 transition-colors ${showDeleted ? "opacity-75 grayscale-[0.5]" : ""}`}>
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded flex items-center justify-center text-white shrink-0 shadow-sm ${showDeleted ? "bg-gray-400" : "bg-[#0a66c2]"}`}>
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 uppercase">
                            {role === "farmer"
                              ? (b.laborerName || b.equipmentName || "Unknown Resource")
                              : (b.farmerName || "Farmer")}
                          </h4>
                          {showDeleted && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-gray-100 text-gray-500 border border-gray-200">
                              Archived
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${b.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                            b.status === "accepted" ? "bg-green-50 text-green-700 border-green-200" :
                              b.status === "completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> <span className="font-semibold text-gray-700">{role === "farmer" ? "Provider ID" : "Farmer"}:</span> {role === "farmer" ? (b.laborerId ? b.laborerId.slice(0, 8) + "..." : "Rental Item") : (b.farmerName || "Anonymous")}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> <span className="font-semibold text-gray-700">Contact:</span> {role === "farmer" ? (b.laborerPhone || "Direct Contact") : (b.farmerPhone || "9845XXXXXX")}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> <span className="font-semibold text-gray-700">Logged:</span> {new Date(b.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                          {(b.workDescription || b.description) && (
                            <p className="text-sm text-gray-500 col-span-full mt-2 italic bg-gray-50 p-2 rounded border border-gray-100 italic">
                              "{b.workDescription || b.description}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {showDeleted ? (
                      <button
                        onClick={() => restoreBooking(b.id)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-3 h-3" /> Restore
                      </button>
                    ) : (
                      <>
                        {role !== "farmer" && b.status === "pending" && (
                          <div className="flex gap-2 w-full md:w-auto pt-4 md:pt-0">
                            <button
                              onClick={() => updateStatus(b.id, "accepted")}
                              className="flex-1 md:flex-none bg-green-600 text-white font-bold px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Accept
                            </button>
                            <button
                              onClick={() => updateStatus(b.id, "rejected")}
                              className="flex-1 md:flex-none bg-white text-red-600 border border-red-600 font-bold px-4 py-2 rounded text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" /> Decline
                            </button>
                          </div>
                        )}

                        {b.status === "accepted" && (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-bold uppercase tracking-wider">Scheduled</span>
                            </div>
                            <button
                              onClick={() => removeBooking(b.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {b.status === "rejected" && (
                          <button
                            onClick={() => removeBooking(b.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {b.status === "completed" && (
                          <button
                            onClick={() => removeBooking(b.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        {b.status === "pending" && role === "farmer" && (
                          <button
                            onClick={() => removeBooking(b.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          End of Activity Log
        </div>

      </div>
    </div>
  );
}
