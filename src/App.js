import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Calendar from './components/Calendar.js';
import Patients from './components/Patients.js';
import Header from './components/Header.js';
import CalendarPage from './pages/CalendarPage.js';
import PatientsPage from './pages/PatientsPage.js';
import ActivitiesPage from './pages/ActivitiesPage.js';
import ReportsPage from './pages/ReportsPage.js';
import PatientDetails from "./components/PatientDetails.js";
import AddPatientPage from './pages/AddPatientPage.js';

// Page d'accueil
const HomePage = () => (
  <div className="w-full flex-grow flex flex-col items-center">
    <Calendar className="w-full h-full" />
    <Patients className="w-full mt-4" />
  </div>
);

// **Effet d'apparition et de glissement pour la fiche patient**
const patientTransition = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.4, ease: "easeIn" } }
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendrier" element={<CalendarPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/add-patient" element={<AddPatientPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        {/* Ajout de l'effet d'apparition pour la fiche patient */}
        <Route
          path="/patient/:patientId"
          element={
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={patientTransition}
              className="w-full"
            >
              <PatientDetails />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <Header />
      <div className="p-6 space-y-12 min-h-screen flex flex-col items-center bg-gray-100">
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;