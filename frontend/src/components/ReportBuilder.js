import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ToggleSwitch from "./ToggleSwitch.js";

const sectionLabels = {
  patientInfo: "Données client",
  contacts: "Références & Contacts",
  medicalData: "Données de Santé",
  motif: "Motif d’intervention",
  diagnostic: "Diagnostic",
  comptesRendus: "Comptes rendus",
  appointments: "Rendez-vous",
  synthese: "Synthèse",
};

const initialOrder = Object.keys(sectionLabels);

const ReportBuilder = ({ patientId }) => {
  const [order, setOrder] = useState(initialOrder);
  const [enabledSections, setEnabledSections] = useState(
    Object.fromEntries(initialOrder.map((id) => [id, true]))
  );

  useEffect(() => {
    setOrder(initialOrder);
    setEnabledSections(Object.fromEntries(initialOrder.map((id) => [id, true])));
  }, [patientId]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newOrder = Array.from(order);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setOrder(newOrder);
  };

  const handleToggle = (id) => {
    setEnabledSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGenerate = async () => {
    const selectedSections = order.filter((id) => enabledSections[id]);

    try {
      const res = await axios.post(
        `http://localhost:3001/reports/${patientId}`,
        { selectedSections },
        {
          responseType: "blob",
          withCredentials: true,
          headers: { Accept: "application/pdf" },
        }
      );

      let fileName = "rapport_patient.pdf";
      const disposition = res.headers["content-disposition"];
      if (disposition?.includes("filename=")) {
        const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/);
        if (match?.[1]) fileName = decodeURIComponent(match[1]);
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur génération PDF :", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4">🧾 Générer un rapport patient</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {order.map((id, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded"
                    >
                      <span>{sectionLabels[id]}</span>
                      <ToggleSwitch
                        checked={enabledSections[id]}
                        onChange={() => handleToggle(id)}
                        size={55}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={handleGenerate}
        className="mt-6 px-4 py-2 bg-dark2GreenErgogo text-white rounded hover:brightness-110"
      >
        Générer le PDF
      </button>
    </div>
  );
};

export default ReportBuilder;