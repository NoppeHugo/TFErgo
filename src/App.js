import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';
import Patients from './components/Patients';
import Header from './components/Header';

const Activities = () => <div>Activités</div>;
const Reports = () => <div>Rapports</div>;

const App = () => {
  return (
    <Router>
      <Header />
      <div className="p-6 space-y-12 min-h-screen flex flex-col items-center bg-gray-100">
        <div className="w-full flex-grow flex flex-col items-center">
          <Calendar className="w-full h-full" />
          <Patients className="w-full mt-4" />
        </div>
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;