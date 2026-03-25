import React from "react";
import { useParams } from "react-router-dom";

export default function Booking() {
  const { id } = useParams();
  return (
    <div style={{ padding: 20 }}>
      <h1>Booking Page</h1>
      <p>Booking ID: {id}</p>
    </div>
  );
}
