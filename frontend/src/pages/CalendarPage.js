import React from 'react';
import Calendar from '../components/calendar/TherapyCalendar.js';
import TodayAppointments from "../components/calendar/TodayAppointments.js";
import { motion } from 'framer-motion';

const CalendarPage = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row flex-grow justify-center items-start gap-6 px-4 py-6">
      
      {/* Colonne principale : le calendrier */}
      <div className="w-full lg:w-3/4 max-w-5xl">
        <motion.div
          className="bg-white p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}>
        <Calendar />
        </motion.div>
      </div>

      {/* Colonne secondaire : les rdvs du jour */}
      <div className="w-full lg:w-[300px] mt-6 lg:mt-0 flex-shrink-0">
        <motion.div
          className="bg-white p-4 sticky top-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <TodayAppointments />
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarPage;
