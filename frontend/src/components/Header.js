import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const [therapist, setTherapist] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3001/auth/me', {
      credentials: 'include'
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        console.log(data)
        if (data) setTherapist(data)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('http://localhost:3001/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    navigate('/login')
  }

  return (
    <nav className="bg-[#A294F9] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link to="/" className="text-white text-3xl font-bold">
          ERGOGO
        </Link>

        <ul className="flex space-x-8 mx-auto">
          <li><Link to="/calendrier" className="text-white text-3xl hover:scale-125 transition">Calendrier</Link></li>
          <li><Link to="/patients" className="text-white text-3xl hover:scale-125 transition">Patients</Link></li>
          <li><Link to="/activities" className="text-white text-3xl hover:scale-125 transition">Activités</Link></li>
          <li><Link to="/reports" className="text-white text-3xl hover:scale-125 transition">Rapports</Link></li>
        </ul>

        {/* Nom du thérapeute + menu de déconnexion */}
        {therapist && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white font-semibold px-4 py-2 rounded hover:bg-[#8d7cf9] transition"
            >
              {therapist.name}
              
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
