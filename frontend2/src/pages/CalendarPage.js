import React from 'react';
import Calendar from '../components/Calendar.js';

const CalendarPage = () => {
  return (
    <div className="w-full flex-grow flex flex-col items-center">
      <div className="w-full h-full">
        <Calendar />
      </div>
    </div>
  );
};

export default CalendarPage;