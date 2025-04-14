import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CalendarPage from './pages/CalendarPage.js';
import PatientsPage from './pages/PatientsPage.js';
import ActivitiesPage from './pages/ActivitiesPage.js';
import ReportsPage from './pages/ReportsPage.js';
import PatientDetails from "./components/PatientDetails.js";
import AddPatientPage from './pages/AddPatientPage.js';
import PatientLayout from './components/PatientLayout.js'; // Import du layout patient
import Header from './components/Header.js';
import './index.css';
import LoginPage from './pages/LoginPage.js';
import RequireAuth from './components/RequireAuth.js';
import ActivityDetailsPage from './components/activities/ActivityDetailsPage.js';

// Page d'accueil
const HomePage = () => (
  <div className="w-full flex-grow flex flex-col items-center">
    <CalendarPage className="w-full h-full" />
    <PatientsPage className="w-full mt-4" />
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
        <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/calendrier" element={<RequireAuth><CalendarPage /></RequireAuth>} />
        <Route path="/patients" element={<RequireAuth><PatientsPage /></RequireAuth>} />
        <Route path="/add-patient" element={<RequireAuth><AddPatientPage /></RequireAuth>} />
        <Route path="/activities" element={<RequireAuth><ActivitiesPage /></RequireAuth>} />
        <Route path="/activities/:id" element={<RequireAuth><ActivityDetailsPage /></RequireAuth>} /> {/* ✅ déplacé ici */}
        <Route path="/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />

        {/* Layout pour les pages patients */}
        <Route path="/patient/*" element={<RequireAuth><PatientLayout /></RequireAuth>}>
          <Route
            path=":patientId"
            element={
              <RequireAuth><motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={patientTransition}
                className="w-full"
              >
                <PatientDetails />
              </motion.div></RequireAuth>
            }
          />
          <Route path=":patientId/notes" element={<RequireAuth><PatientsPage /></RequireAuth>} />
          <Route path=":patientId/donnees" element={<RequireAuth><PatientsPage /></RequireAuth>} />
          <Route path=":patientId/dossier" element={<RequireAuth><PatientsPage /></RequireAuth>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-grow overflow-hidden">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
};

export default App;