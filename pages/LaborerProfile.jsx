
import React from "react";

import { useParams } from "react-router-dom";



export default function LaborerProfile() {

  const { id } = useParams();



  return (

    <div style={{ padding: 20 }}>

      <h1>Laborer Profile</h1>

      <p>Laborer ID: {id}</p>

    </div>

  );

} 