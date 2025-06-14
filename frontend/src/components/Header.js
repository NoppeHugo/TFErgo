import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import API from "../api/api.js";


const Header = () => {
  const [therapist, setTherapist] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation(); 

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const res = await API.get('/auth/me');
        setTherapist(res.data);
      } catch (err) {
        // pas connecté ou erreur
      }
    };
    fetchTherapist();
  }, []);
  

  const handleLogout = async () => {
    await API.post('/auth/logout');
    navigate('/login')
  }

  return (
    <nav className="bg-[#AE99B2] px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold tracking-wider">
          ERGOGO
        </Link>
        {/* Menu burger mobile */}
        <button
          className="md:hidden text-white text-2xl ml-2 focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        {/* Liens navigation */}
        <ul className="hidden md:flex space-x-6">
          {[
            { to: '/calendrier', label: 'Calendrier' },
            { to: '/patients', label: 'Patients' },
            { to: '/activities', label: 'Activités' },
            { to: '/reports', label: 'Rapports' },
          ].map((item) => {
            const isActive = location.pathname.startsWith(item.to); // 🔥 Comparaison actuelle
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`text-sm font-medium uppercase tracking-wide px-3 py-1 rounded-md transition duration-200 ${
                    isActive
                      ? 'bg-white/30 text-white font-bold'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
        {/* Menu mobile déroulant */}
        {menuOpen && (
          <ul className="absolute top-16 left-0 w-full bg-[#AE99B2] flex flex-col items-center py-4 z-50 md:hidden shadow-lg animate-fade-in">
            {[
              { to: '/calendrier', label: 'Calendrier' },
              { to: '/patients', label: 'Patients' },
              { to: '/activities', label: 'Activités' },
              { to: '/reports', label: 'Rapports' },
            ].map((item) => (
              <li key={item.to} className="w-full text-center py-2">
                <Link
                  to={item.to}
                  className="block text-white text-lg font-medium py-2 w-full hover:bg-white/20"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {/* Profil utilisateur */}
        {therapist && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-white font-medium hover:underline transition"
            >
              {therapist.name}
              <FiChevronDown />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
