import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base } from "@/api/base";

export default function ProviderBookings() {
  const qc = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base.auth.me().then(setUser).catch(()=>{});
  }, []);

  // fetch bookings where laborer_id equals the labour profile id for this user
  const { data: myProfiles = [], isLoading: profileLoading } = useQuery({
    queryKey: ["laborer-profile", user?.id],
    enabled: !!user,
    queryFn: () => base.entities.LaborerProfile.filter({ user_id: user.id }),
    initialData: [],
  });

  const profile = myProfiles[0] ?? null;
  const profileId = profile?.id;

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["provider-bookings", profileId],
    enabled: !!profileId,
    queryFn: () => base.entities.Booking.filter({ laborer_id: profileId }),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => base.entities.Booking.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries(["provider-bookings", profileId]);
      qc.invalidateQueries(["my-bookings"]);
    },
  });

  const handleChangeStatus = (id, status) => {
    if (!confirm(`Set status to ${status}?`)) return;
    updateMutation.mutate({ id, status });
  };

  if (!user) return <div className="p-6">Please log in to see bookings.</div>;
  if (!profile) return <div className="p-6">You need to create a labour profile first (Profile → Create).</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Bookings for your profile</h2>

      {bookingsLoading ? <div>Loading bookings…</div> : bookings.length === 0 ? (
        <div>No bookings yet.</div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="p-4 border rounded bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{b.booking_type === "laborer" ? "Labor Booking" : "Equipment Booking"}</div>
                  <div className="text-sm text-gray-600">{b.work_description}</div>
                  <div className="text-sm text-gray-500 mt-1">Date: {new Date(b.start_date).toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Farmer: {b.farmer_id}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded text-sm ${b.status === "pending" ? "bg-yellow-100 text-yellow-800" : b.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {b.status}
                  </div>

                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={()=>handleChangeStatus(b.id, "confirmed")} className="px-3 py-1 bg-green-600 text-white rounded">Confirm</button>
                      <button onClick={()=>handleChangeStatus(b.id, "rejected")} className="px-3 py-1 border rounded">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
