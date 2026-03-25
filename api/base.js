// Fake backend for FarmerBridge project

export const base = {
  // -----------------------------
  // AUTH
  // -----------------------------
  auth: {
    me: () =>
      Promise.resolve({
        id: "user-1",
        full_name: "Ravi",
        email: "Ravi@mail.com",
        user_type: "farmer",
      }),

    logout: () => console.log("Logged out"),
  },

  // -----------------------------
  // ENTITIES (Fake Database)
  // -----------------------------
  entities: {
    // -----------------------------
    // USERS
    // -----------------------------
    User: {
      data: [
        { id: "user-1", full_name: "Ravi", user_type: "farmer" },
        { id: "u2", full_name: "Laborer John", user_type: "laborer" },
        { id: "u3", full_name: "Owner Michael", user_type: "equipment_owner" },

        // Additional users for new laborers
        { id: "u4", full_name: "Laborer Ravi", user_type: "laborer" },
        { id: "u5", full_name: "Laborer Meena", user_type: "laborer" },
      ],

      list() {
        return Promise.resolve(this.data);
      },

      filter(query) {
        return Promise.resolve(
          this.data.filter((item) =>
            Object.keys(query).every((k) => item[k] === query[k])
          )
        );
      },
    },

    // -----------------------------
    // LABORER PROFILES
    // -----------------------------
    LaborerProfile: {
      data: [
        {
          id: "l1",
          user_id: "u2",
          skills: ["harvesting", "ploughing"],
          hourly_rate: 200,
          is_active: true,
        },
        {
          id: "l2",
          user_id: "u4",
          skills: ["sowing", "watering"],
          hourly_rate: 180,
          is_active: true,
        },
        {
          id: "l3",
          user_id: "u5",
          skills: ["harvesting"],
          hourly_rate: 220,
          is_active: true,
        },
      ],

      list() {
        return Promise.resolve(this.data);
      },

      filter(query) {
        return Promise.resolve(
          this.data.filter((item) =>
            Object.keys(query).every((k) => item[k] === query[k])
          )
        );
      },
    },

    // -----------------------------
    // EQUIPMENT
    // -----------------------------
    Equipment: {
      data: [
        {
          id: "e1",
          owner_id: "u3",
          name: "Tractor 5050D",
          equipment_type: "tractor",
          daily_rate: 2500,
          is_active: true,
        },
        {
          id: "e2",
          owner_id: "u3",
          name: "John Deere Harvester X",
          equipment_type: "harvester",
          daily_rate: 4500,
          is_active: true,
        },
        {
          id: "e3",
          owner_id: "u3",
          name: "Plough Max Pro",
          equipment_type: "plough",
          daily_rate: 1200,
          is_active: true,
        },
      ],

      list() {
        return Promise.resolve(this.data);
      },

      filter(query) {
        return Promise.resolve(
          this.data.filter((item) =>
            Object.keys(query).every((k) => item[k] === query[k])
          )
        );
      },
    },

    // -----------------------------
    // BOOKINGS
    // -----------------------------
    Booking: {
      data: [
        {
          id: "b1",
          booking_type: "laborer",
          farmer_id: "user-1",
          laborer_profile_id: "l1",
          status: "confirmed",
          start_date: "2025-01-15",
          end_date: "2025-01-16",
          location: "Field A, Karnataka",
          duration_hours: 8,
          total_amount: 1500,
          work_description: "Harvesting sugarcane",
          farmer_notes: "Bring equipment",
        },

        {
          id: "b2",
          booking_type: "equipment",
          farmer_id: "user-1",
          equipment_id: "e1",
          status: "pending",
          start_date: "2025-02-10",
          end_date: "2025-02-12",
          location: "Field B, Karnataka",
          total_amount: 5000,
          work_description: "Ploughing field",
          farmer_notes: "Need Tractor at 6 AM",
        },
      ],

      list() {
        return Promise.resolve(this.data);
      },

      filter(query) {
        return Promise.resolve(
          this.data.filter((item) =>
            Object.keys(query).every((k) => item[k] === query[k])
          )
        );
      },

      create(data) {
        const newItem = { id: "b" + (this.data.length + 1), ...data };
        this.data.push(newItem);
        return Promise.resolve(newItem);
      },
    },
  },
};

