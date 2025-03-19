import React from "react";
import { Outlet } from "react-router-dom";
import PatientSidebar from "../components/PatientSidebar.js";

const PatientLayout = () => {
  return (
    <div className="flex w-full h-full">
      {/* Sidebar avec liste des patients */}
      <div className="flex-shrink-0 w-64 h-full bg-gray-100 p-4 shadow-lg overflow-y-auto custom-scrollbar">
        <PatientSidebar />
      </div>

      {/* Contenu dynamique (détails, notes, données, dossier, etc.) */}
      <div className="flex-grow p-6 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;