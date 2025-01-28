import React, { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const generateCalendarDays = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const startDayOfWeek = startOfMonth.getDay();
    const endDayOfWeek = endOfMonth.getDay();

    const prevMonthDays = [];
    const startDatePrevMonth = new Date(startOfMonth);
    startDatePrevMonth.setDate(startDatePrevMonth.getDate() - (startDayOfWeek || 7) + 1);
    for (let i = 0; i < (startDayOfWeek || 7) - 1; i++) {
      prevMonthDays.push(new Date(startDatePrevMonth.setDate(startDatePrevMonth.getDate() + 1)));
    }

    const currentMonthDays = [];
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      currentMonthDays.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    const nextMonthDays = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    const startDateNextMonth = new Date(endOfMonth);
    startDateNextMonth.setDate(startDateNextMonth.getDate() + 1);
    for (let i = 0; i < remainingDays; i++) {
      nextMonthDays.push(new Date(startDateNextMonth.setDate(startDateNextMonth.getDate() + 1)));
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const calendarDays = generateCalendarDays(currentDate);

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(today);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <button
          className="text-[#A294F9] font-bold hover:underline"
          onClick={() => handleMonthChange(-1)}
        >
          &lt; Mois précédent
        </button>
        <h2
          className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-[#A294F9]"
          onClick={resetToToday}
        >
          {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </h2>
        <button
          className="text-[#A294F9] font-bold hover:underline"
          onClick={() => handleMonthChange(1)}
        >
          Mois suivant &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-bold text-gray-600">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          return (
            <div
              key={index}
              className={`p-2 text-center rounded-lg ${
                isToday
                  ? "bg-[#A294F9] text-white font-bold"
                  : isCurrentMonth
                  ? "bg-white text-gray-800 border border-gray-300"
                  : "bg-gray-100 text-gray-400"
              } hover:bg-blue-100 cursor-pointer`}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;