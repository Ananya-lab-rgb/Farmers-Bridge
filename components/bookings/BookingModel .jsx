import React, { useState, useEffect } from "react";
import { base } from "@/api/base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export default function BookingModal({ bookingType, item, onClose }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    duration_hours: "",
    work_description: "",
    location: "",
    farmer_notes: ""
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base.auth.me().then(setUser).catch(() => {});
  }, []);

  const calculateTotal = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    if (bookingType === 'laborer') {
      const hours = parseFloat(formData.duration_hours) || (days * 8);
      return hours * (item.hourly_rate || 0);
    } else {
      return days * (item.daily_rate || 0);
    }
  };

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => base.entities.Booking.create(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success("Booking request sent successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to create booking. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to make a booking");
      return;
    }

    const bookingData = {
      booking_type: bookingType,
      farmer_id: user.id,
      ...(bookingType === 'laborer' 
        ? { laborer_profile_id: item.id }
        : { equipment_id: item.id }
      ),
      ...formData,
      total_amount: calculateTotal(),
      status: "pending"
    };

    createBookingMutation.mutate(bookingData);
  };

  const totalAmount = calculateTotal();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ color: '#3D2E2A' }}>
            Book {bookingType === 'laborer' ? 'Laborer' : 'Equipment'}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8F5F0' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#3D2E2A' }}>
            {bookingType === 'laborer' ? item.user?.full_name : item.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {bookingType === 'laborer' ? item.user?.location : item.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {bookingType === 'laborer' 
                ? `$${item.hourly_rate}/hour`
                : `$${item.daily_rate}/day`
              }
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {bookingType === 'laborer' && (
            <div>
              <Label htmlFor="duration_hours">Estimated Hours per Day</Label>
              <Input
                id="duration_hours"
                type="number"
                placeholder="e.g., 8"
                value={formData.duration_hours}
                onChange={(e) => setFormData({...formData, duration_hours: e.target.value})}
              />
            </div>
          )}

          <div>
            <Label htmlFor="work_description">Work Description *</Label>
            <Textarea
              id="work_description"
              required
              placeholder="Describe the work needed..."
              value={formData.work_description}
              onChange={(e) => setFormData({...formData, work_description: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="location">Work Location *</Label>
            <Input
              id="location"
              required
              placeholder="Farm address or location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="farmer_notes">Additional Notes</Label>
            <Textarea
              id="farmer_notes"
              placeholder="Any special requirements or instructions..."
              value={formData.farmer_notes}
              onChange={(e) => setFormData({...formData, farmer_notes: e.target.value})}
              rows={2}
            />
          </div>

          <div 
            className="p-4 rounded-lg border-2"
            style={{ 
              backgroundColor: '#FEF3C7', 
              borderColor: '#F4A261'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold" style={{ color: '#3D2E2A' }}>
                Estimated Total:
              </span>
              <span className="text-2xl font-bold" style={{ color: '#F4A261' }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Final amount may vary based on actual work completed
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createBookingMutation.isPending}
              className="text-white"
              style={{ backgroundColor: bookingType === 'laborer' ? '#0F766E' : '#E07A5F' }}
            >
              {createBookingMutation.isPending ? 'Sending...' : 'Send Booking Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}