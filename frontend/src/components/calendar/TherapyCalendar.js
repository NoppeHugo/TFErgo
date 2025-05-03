import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../../api/appointmentAPI.js";
import AppointmentModal from "./AppointmentModal.js";
import AppointmentDetailsModal from "./AppointmentDetailsModal.js";
import { FiMove } from "react-icons/fi";

const DraggableAppointment = ({ apt, onClick }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: apt.id,
    data: apt,
  });

  return (
    <div
      ref={setNodeRef}
      className="text-[0.7rem] bg-[#788B84] px-1 py-0.5 rounded my-0.5 w-full truncate whitespace-nowrap cursor-default flex items-center justify-between gap-1"
    >
      <div
        className="flex-grow truncate cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(apt);
        }}
      >
        {new Date(apt.date).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })} – {apt.title}
      </div>

      {/* zone de drag */}
      <div
        {...listeners}
        {...attributes}
        className="p-1 text-white hover:text-gray-300 cursor-grab"
        onClick={(e) => e.stopPropagation()} // évite conflit click
      >
        <FiMove size={12} />
      </div>
    </div>
  );
};

const AppointmentPreview = ({ apt }) => (
  <div className="text-[0.7rem] bg-[#788B84] px-1 py-0.5 rounded my-0.5 w-[120px] shadow-md">
    {new Date(apt.date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })} – {apt.title}
  </div>
);

const CalendarDay = ({ day, appointments, isToday, isCurrentMonth, onClick, activeId, onAppointmentClick }) => {
  const { setNodeRef } = useDroppable({ id: day.toDateString() });

  return (
    <motion.div
      ref={setNodeRef}
      className={`p-1 text-left rounded-lg text-xs sm:text-sm cursor-pointer transition-all relative flex flex-col h-[185px] overflow-y-auto ${
        isToday
          ? "bg-[#B1BBB6] text-white font-bold"
          : isCurrentMonth
          ? "bg-white text-gray-800 border"
          : "bg-gray-100 text-gray-400"
      } hover:bg-blue-100`}
      onClick={() => onClick(day)}
    >
      <div className="font-semibold text-right pr-1">{day.getDate()}</div>
      <div className="flex-grow overflow-hidden space-y-0.5">
        {appointments.slice(0, 6).map((apt) => (
          <DraggableAppointment
            key={apt.id}
            apt={apt}
            isDragging={apt.id === activeId}
            onClick={onAppointmentClick}
          />
        ))}
        {appointments.length > 6 && (
          <div className="text-[0.65rem] italic text-gray-500">
            +{appointments.length - 6} autres
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TherapyCalendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeDragItem, setActiveDragItem] = useState(null);

  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor));
  const yearMonth = currentDate.toISOString().slice(0, 7);

  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["appointments", yearMonth],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/appointments/month/${yearMonth}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data.map((apt) => ({ ...apt, start: new Date(apt.date) }));
    },
  });

  const generateCalendarDays = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

    const days = [];
    for (let i = 0; i < 28; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    setCalendarDays(days);
  };

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const closeModals = () => {
    setSelectedDate(null);
    setSelectedAppointment(null);
    refetch();
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveDragItem(null);
    if (!active || !over) return;

    const dragged = active.data.current;
    const draggedDate = new Date(dragged.date || dragged.start);
    const dropTarget = new Date(over.id);

    const newDate = new Date(
      dropTarget.getFullYear(),
      dropTarget.getMonth(),
      dropTarget.getDate(),
      draggedDate.getHours(),
      draggedDate.getMinutes(),
      draggedDate.getSeconds()
    );

    if (draggedDate.toDateString() !== newDate.toDateString()) {
      await updateAppointment(dragged.id, {
        ...dragged,
        date: newDate.toISOString(),
      });
      refetch();
    }
  };

  return (
    <motion.div className="p-6 bg-white rounded-2xl w-full h-full min-h-[80vh] max-h-[80vh] overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-4 py-2 rounded-lg">
        <button
          onClick={() => handleMonthChange(-1)}
          className="text-[#A294F9] p-2 rounded-full hover:bg-[#eae7fd]"
        >
          <FiChevronLeft size={20} />
        </button>
        <h2
          className="text-xl sm:text-2xl font-semibold text-gray-800 cursor-pointer hover:text-[#A294F9]"
          onClick={() => setCurrentDate(today)}
        >
          {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </h2>
        <button
          onClick={() => handleMonthChange(1)}
          className="text-[#A294F9] p-2 rounded-full hover:bg-[#eae7fd]"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-bold text-gray-600 text-xs sm:text-base">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActiveDragItem(active.data.current)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-7 gap-1 mt-2" style={{ maxHeight: "calc(100% - 100px)", overflowY: "auto" }}>
          {calendarDays.map((day, index) => {
            const isToday = day.toDateString() === today.toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const dayAppointments = appointments
              .filter((apt) => new Date(apt.start).toDateString() === day.toDateString())
              .sort((a, b) => new Date(a.start) - new Date(b.start));

            return (
              <CalendarDay
                key={index}
                day={day}
                appointments={dayAppointments}
                isToday={isToday}
                isCurrentMonth={isCurrentMonth}
                onClick={handleDateClick}
                onAppointmentClick={setSelectedAppointment}
                activeId={activeDragItem?.id}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragItem ? <AppointmentPreview apt={activeDragItem} /> : null}
        </DragOverlay>
      </DndContext>

      {selectedDate && <AppointmentModal event={{ date: selectedDate }} onClose={closeModals} />}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={closeModals}
          onEdit={(apt) => {
            setSelectedAppointment(null);
            setSelectedDate(new Date(apt.date));
          }}
        />
      )}
    </motion.div>
  );
};

export default TherapyCalendar;
