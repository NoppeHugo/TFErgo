import React from "react";
import { Outlet } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar.js";

const PatientLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar avec liste des patients */}
      <PatientSidebar />

      {/* Contenu dynamique (détails, notes, données, dossier, etc.) */}
      <div className="ml-64 p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
