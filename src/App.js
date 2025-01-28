import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';
import Patients from './components/Patients';
import Header from './components/Header';
import CalendarPage from './pages/CalendarPage';
import PatientsPage from './pages/PatientsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ReportsPage from './pages/ReportsPage';

// Page d'accueil
const HomePage = () => (
  <div className="w-full flex-grow flex flex-col items-center">
    <Calendar className="w-full h-full" />
    <Patients className="w-full mt-4" />
  </div>
);

const App = () => {
  return (
    <Router>
      {/* Header global toujours visible */}
      <Header />

      {/* Routes pour le contenu */}
      <div className="p-6 space-y-12 min-h-screen flex flex-col items-center bg-gray-100">
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<HomePage />} />

          {/* Routes pour les pages dédiées */}
          <Route path="/calendrier" element={<CalendarPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
