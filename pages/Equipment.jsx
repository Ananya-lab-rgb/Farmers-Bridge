import React from "react";
import { useParams } from "react-router-dom";

export default function Equipment() {
  const { id } = useParams();
  return (
    <div style={{ padding: 20 }}>
      <h1>Equipment Details</h1>
      <p>Equipment ID: {id}</p>
    </div>
  );
}
