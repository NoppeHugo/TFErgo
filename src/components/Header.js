import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-gradient-to-r from-[#A294F9] to-[#6C63FF] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold">ERGOGO</div>
        <ul className="flex space-x-8 mx-auto">
          <li>
            <Link
              to="/"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-110 hover:text-[#F5EFFF]"
            >
              Calendrier
            </Link>
          </li>
          <li>
            <Link
              to="/patients"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-110 hover:text-[#F5EFFF]"
            >
              Patients
            </Link>
          </li>
          <li>
            <Link
              to="/activities"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-110 hover:text-[#F5EFFF]"
            >
              Activités
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-110 hover:text-[#F5EFFF]"
            >
              Rapports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;