import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, DollarSign, Calendar as CalendarIcon, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";

export default function BookingModal({ bookingType, item, onClose }) {
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    duration_hours: "8",
    work_description: "",
    location: item?.location || "",
    farmer_notes: ""
  });
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (days <= 0) return 0;

    if (bookingType === "laborer") {
      const hours = parseFloat(formData.duration_hours) || 8;
      const rate = item?.hourly_rate || 220; // Default rate if missing
      return days * hours * rate;
    } else {
      const rate = item?.daily_rate || item?.rate || 0;
      return days * rate;
    }
  };

  const totalAmount = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Login required");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      const profile = snap.data();

      if (!profile) {
        toast.error("Complete profile first");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        farmerId: user.uid,
        farmerName: profile.name || "",
        farmerPhone: profile.phone || "",
        laborerId: bookingType === "laborer" ? item.id : null,
        laborerName: bookingType === "laborer" ? item.name : null,
        ownerId: bookingType === "equipment" ? item.ownerId : (bookingType === "laborer" ? item.id : null),
        equipmentName: bookingType !== "laborer" ? item.name : null,
        bookingType,
        startDate: formData.start_date,
        endDate: formData.end_date,
        hoursPerDay: formData.duration_hours,
        description: formData.work_description,
        location: formData.location,
        notes: formData.farmer_notes,
        totalAmount,
        status: "pending",
        timestamp: Date.now(),
        createdAt: serverTimestamp()
      });

      toast.success("Professional request sent!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[95vh] overflow-y-auto rounded-xl p-0 border-none shadow-2xl">

        <DialogHeader className="p-6 border-b border-gray-100 bg-gray-50 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {bookingType === "laborer" ? <Briefcase className="w-5 h-5 text-[#0a66c2]" /> : <CalendarIcon className="w-5 h-5 text-[#0a66c2]" />}
            Confirm Rental
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Item Banner */}
          <div className="mb-8 bg-[#f3f2ef] p-4 rounded-lg flex items-center justify-between border border-gray-200 border-dashed">
            <div>
              <h3 className="font-bold text-gray-900 uppercase">
                {bookingType === "laborer" ? item?.name : item?.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-bold mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item?.location}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ₹{bookingType === "laborer" ? (item?.hourly_rate || 220) : (item?.daily_rate || item?.rate)} / {bookingType === "laborer" ? "hr" : "day"}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded bg-white shadow-sm flex items-center justify-center text-[#0a66c2] text-xl font-bold">
              {item?.name?.[0]?.toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Date</Label>
                <Input
                  type="date"
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#0a66c2] focus:bg-white"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End Date</Label>
                <Input
                  type="date"
                  required
                  className="bg-gray-50 border-gray-200 focus:border-[#0a66c2] focus:bg-white"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            {bookingType === "laborer" && (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Standard Work Hours / Day</Label>
                <Input
                  type="number"
                  className="bg-gray-50 border-gray-200 focus:border-[#0a66c2] focus:bg-white"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Specifications</Label>
              <Textarea
                required
                className="bg-gray-50 border-gray-200 focus:border-[#0a66c2] focus:bg-white min-h-[80px]"
                placeholder="Describe the tasks to be performed..."
                value={formData.work_description}
                onChange={(e) => setFormData({ ...formData, work_description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site Address</Label>
              <Input
                required
                className="bg-gray-50 border-gray-200 focus:border-[#0a66c2] focus:bg-white"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="p-4 rounded-xl bg-[#e8ebee] border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimated Commitment</p>
                <p className="text-2xl font-black text-gray-900 leading-none mt-1">₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Payment at Site</p>
                <p className="text-[9px] text-gray-500 font-medium italic mt-1">Subject to completion of work</p>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-gray-50">
              <button
                type="button"
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || totalAmount === 0}
                className="bg-[#0a66c2] text-white font-bold px-8 py-2 rounded-full hover:bg-[#004182] transition-colors shadow flex items-center gap-2 disabled:bg-gray-300"
              >
                {loading ? "Processing..." : "Confirm Request"}
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
