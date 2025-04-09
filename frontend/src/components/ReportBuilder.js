import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

const sectionLabels = {
  patientInfo: "Données client",
  contacts: "Références & Contacts",
  medicalData: "Données de Santé",
  motif: "Motif d’intervention",
  diagnostic: "Diagnostic",
  comptesRendus: "Comptes rendus",
  synthese: "Synthèse",
};

const initialSections = Object.keys(sectionLabels);

const SortableItem = ({ id, enabled, onToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    marginBottom: "8px",
    background: "#f3f4f6",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>{sectionLabels[id]}</span>
      <input type="checkbox" checked={enabled} onChange={() => onToggle(id)} />
    </div>
  );
};

const ReportBuilder = ({ patientId }) => {
  const [sections, setSections] = useState(initialSections);
  const [enabledSections, setEnabledSections] = useState(new Set(initialSections));

  const handleToggle = (key) => {
    const updated = new Set(enabledSections);
    updated.has(key) ? updated.delete(key) : updated.add(key);
    setEnabledSections(updated);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id);
      const newIndex = sections.indexOf(over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const handleGenerate = async () => {
    try {
      const selected = sections.filter((s) => enabledSections.has(s));
      const res = await axios.post(
        `http://localhost:3001/reports/${patientId}`,
        { selectedSections: selected },
        {
          responseType: "blob",
          withCredentials: true,
          headers: { Accept: "application/pdf" },
        }
      );
      let fileName = "rapport_patient.pdf";
      const disposition = res.headers["content-disposition"];
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
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
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          {sections.map((id) => (
            <SortableItem key={id} id={id} enabled={enabledSections.has(id)} onToggle={handleToggle} />
          ))}
        </SortableContext>
      </DndContext>
      <button
        onClick={handleGenerate}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Générer le PDF
      </button>
    </div>
  );
};

export default ReportBuilder;
