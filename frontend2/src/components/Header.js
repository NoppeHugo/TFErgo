import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-[#A294F9] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Lien vers la page d'accueil avec "ERGOGO" */}
        <Link to="/" className="text-white text-3xl font-bold">
          ERGOGO
        </Link>
        <ul className="flex space-x-8 mx-auto">
          <li>
            <Link
              to="/calendrier"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-125 hover:text-[#F5EFFF] hover:brightness-125"
            >
              Calendrier
            </Link>
          </li>
          <li>
            <Link
              to="/patients"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-125 hover:text-[#F5EFFF] hover:brightness-125"
            >
              Patients
            </Link>
          </li>
          <li>
            <Link
              to="/activities"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-125 hover:text-[#F5EFFF] hover:brightness-125"
            >
              Activités
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className="inline-block text-white text-3xl transition duration-300 transform hover:scale-125 hover:text-[#F5EFFF] hover:brightness-125"
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
