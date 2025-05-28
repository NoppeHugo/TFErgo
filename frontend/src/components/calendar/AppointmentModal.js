import React, { useEffect, useState, useRef } from "react";
import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import Select from "react-select";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  linkActivitiesToAppointment,
} from "../../api/appointmentAPI.js";
import { getAllPatients } from "../../api/patientAPI.js";
import { getActivities } from "../../api/activityAPI.js";
import { useQueryClient } from "@tanstack/react-query";
import Toast, { showSuccessToast, showErrorToast, showConfirmToast } from '../common/Toast.js';

const AppointmentModal = ({ event, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [patients, setPatients] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const titleInputRef = useRef();
  const patientInputRef = useRef();
  const dateInputRef = useRef();

  const [form, setForm] = useState({
    title: "",
    patientId: "",
    activityIds: [],
    description: "",
    date: "",
    duration: 60,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [pats, actsRes] = await Promise.all([
        getAllPatients(),
        getActivities(),
      ]);
      setPatients(pats);
      setActivities(actsRes.data);
    };
    fetchData();

    if (event?.id) {
      setForm({
        title: event.title.split(" - ")[0] || "",
        patientId: event.patient?.id || "",
        activityIds: event.activities?.map((a) => a.activity?.id) || [],
        description: event.description || "",
        date: event.start?.toISOString().slice(0, 16) || "",
        duration: (event.end - event.start) / 60000 || 60,
      });
    } else if (event?.date) {
      setForm((prev) => ({
        ...prev,
        date: new Date(event.date).toISOString().slice(0, 16),
      }));
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Le titre est obligatoire.';
    if (!form.patientId) errors.patientId = 'Le patient est obligatoire.';
    if (!form.date) errors.date = 'La date est obligatoire.';
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      if (errors.title && titleInputRef.current) titleInputRef.current.focus();
      else if (errors.patientId && patientInputRef.current) patientInputRef.current.focus();
      else if (errors.date && dateInputRef.current) dateInputRef.current.focus();
      setError(Object.values(errors).join(' '));
      return;
    }
    setIsSaving(true);
    setError("");
    const data = {
      ...form,
      duration: parseInt(form.duration),
    };
    try {
      if (event?.id) {
        await updateAppointment(event.id, data);
        await linkActivitiesToAppointment(event.id, form.activityIds);
        showSuccessToast(setToast, "Rendez-vous modifié avec succès.");
      } else {
        const newApt = await createAppointment(data);
        await linkActivitiesToAppointment(newApt.id, form.activityIds);
        showSuccessToast(setToast, "Rendez-vous créé avec succès.");
      }
      queryClient.invalidateQueries(["appointments", "all"]);
      setTimeout(() => onClose(), 1200);
    } catch (e) {
      showErrorToast(setToast, "Erreur lors de l'enregistrement du rendez-vous.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (event?.id) {
      showConfirmToast(setToast, (
        <span>
          Supprimer ce rendez-vous ?
          <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={async () => {
            try {
              await deleteAppointment(event.id);
              showSuccessToast(setToast, "Rendez-vous supprimé.");
              setTimeout(() => onClose(), 1200);
            } catch (err) {
              showErrorToast(setToast, "Erreur lors de la suppression.");
            }
            setToast(null);
          }}>Oui</button>
          <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setToast(null)}>Non</button>
        </span>
      ));
    }
  };

  useEffect(() => {
    // Forcer l'utilisateur à choisir une date différente de la valeur par défaut lors de la création
    if (!event?.id && event?.date) {
      setForm((prev) => ({ ...prev, date: "" }));
    }
  }, [event]);

  // Détection des modifications du formulaire
  useEffect(() => {
    if (
      form.title !== (event?.title?.split(" - ")[0] || "") ||
      form.patientId !== (event?.patient?.id || "") ||
      form.description !== (event?.description || "") ||
      form.date !== (event?.start?.toISOString().slice(0, 16) || "") ||
      form.duration !== ((event?.end - event?.start) / 60000 || 60) ||
      (event?.activities && form.activityIds.join() !== (event.activities?.map((a) => a.activity?.id).join() || ""))
    ) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [form, event]);

  // Confirmation lors d'un rafraîchissement ou fermeture d'onglet
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Confirmation lors d'une navigation interne (React Router) avec toast UX
  function useBlockerWithToast(blocker, when = true) {
    const { navigator } = React.useContext(UNSAFE_NavigationContext);
    useEffect(() => {
      if (!when) return;
      const push = navigator.push;
      navigator.push = (...args) => {
        if (blocker()) {
          showConfirmToast(setToast, (
            <span>
              Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette page ?
              <button className="ml-4 bg-red-600 text-white px-2 py-1 rounded" onClick={() => {
                navigator.push = push;
                push(...args);
                setToast(null);
              }}>Oui</button>
              <button className="ml-2 bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setToast(null)}>Non</button>
            </span>
          ));
        } else {
          push(...args);
        }
      };
      return () => {
        navigator.push = push;
      };
    }, [blocker, when, navigator]);
  }
  useBlockerWithToast(() => isDirty, isDirty);

  return (
    <>
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} type={toast.type} persistent={toast.persistent} />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-white rounded-2xl px-8 py-6 w-full max-w-[90%] md:max-w-[520px] shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {event?.id ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
          </h2>

          {error && (
            <p className="text-sm text-red-600 mb-2 bg-red-100 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Séance d’évaluation cognitive"
                ref={titleInputRef}
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition ${formErrors.title ? 'border-red-500' : ''}`}
                aria-invalid={!!formErrors.title}
                aria-describedby={formErrors.title ? 'title-error' : undefined}
              />
              {formErrors.title && <div id="title-error" className="text-red-600 text-sm mb-2">{formErrors.title}</div>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Patient</label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                ref={patientInputRef}
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition ${formErrors.patientId ? 'border-red-500' : ''}`}
                aria-invalid={!!formErrors.patientId}
                aria-describedby={formErrors.patientId ? 'patient-error' : undefined}
              >
                <option value="">-- Sélectionner un patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
              {formErrors.patientId && <div id="patient-error" className="text-red-600 text-sm mb-2">{formErrors.patientId}</div>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Activités</label>
              <Select
                isMulti
                name="activities"
                options={activities.map((a) => ({ value: a.id, label: a.name }))}
                value={activities
                  .filter((a) => form.activityIds.includes(a.id))
                  .map((a) => ({ value: a.id, label: a.name }))}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    activityIds: selected.map((opt) => opt.value),
                  }))
                }
                className="text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Préparation / description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ex : matériel à prévoir, consignes à suivre..."
                className="border rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Date & heure</label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                ref={dateInputRef}
                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition ${formErrors.date ? 'border-red-500' : ''}`}
                aria-invalid={!!formErrors.date}
                aria-describedby={formErrors.date ? 'date-error' : undefined}
              />
              {formErrors.date && <div id="date-error" className="text-red-600 text-sm mb-2">{formErrors.date}</div>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Durée</label>
              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A294F9] transition"
              >
                {[30, 45, 60, 90, 120].map((d) => (
                  <option key={d} value={d}>
                    {d} minutes
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-1 text-sm">
              {form.patientId && (
                <button
                  onClick={() => navigate(`/patient/${form.patientId}`)}
                  className="text-[#A294F9] hover:underline"
                >
                  Voir le dossier du patient
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6 items-center">
            {event?.id && (
              <button
                className="text-red-500 hover:underline text-sm"
                onClick={handleDelete}
              >
                🗑️ Supprimer
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-[#A294F9] text-[#A294F9] rounded-lg hover:bg-[#f6f4ff] transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-[#A294F9] text-white rounded-lg shadow hover:bg-[#8c7ef1] transition disabled:opacity-50"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentModal;
