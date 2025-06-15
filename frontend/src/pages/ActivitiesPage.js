import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityList from '../components/activities/ActivityList.js';
import ActivityForm from '../components/activities/ActivityForm.js';
import ActivityFilters from '../components/activities/ActivityFilters.js';
import Toast from '../components/Toast.js';
import { GoGoal } from "react-icons/go";
import { GiToolbox } from "react-icons/gi";


const ActivitiesPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({ name: '', description: '', objectives: [] });
  const [toastMessage, setToastMessage] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    let lastDirection = 'up';
    const threshold = 30; // pixels
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setShowFilters(true);
        return;
      }
      const scrollable = document.querySelector('.activities-scrollable');
      const scrollY = scrollable?.scrollTop || window.scrollY;
      const maxScroll = scrollable ? scrollable.scrollHeight - scrollable.clientHeight : 0;
      const diff = scrollY - lastScrollY.current;
      // Si on est en bas, ne pas réafficher le header
      if (scrollable && scrollY >= maxScroll - 2) {
        setShowFilters(false);
        lastScrollY.current = scrollY;
        return;
      }
      // Ignore les micro-mouvements
      if (Math.abs(diff) < threshold) {
        return;
      }
      if (diff > 0) {
        // Scroll vers le bas
        if (lastDirection !== 'down') {
          setShowFilters(false);
          lastDirection = 'down';
        }
      } else {
        // Scroll vers le haut
        if (lastDirection !== 'up') {
          setShowFilters(true);
          lastDirection = 'up';
        }
      }
      lastScrollY.current = scrollY;
    };
    const scrollable = document.querySelector('.activities-scrollable');
    if (scrollable) {
      scrollable.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollable) {
        scrollable.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const triggerRefresh = () => {
    setRefresh(prev => !prev);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
        <div className="max-w-[1800px] mx-auto flex flex-col gap-4 mt-3 w-full px-6">
          {/* Boutons alignés */}
          <div className="flex justify-center gap-4 w-full">  
            
            {/* Bouton aller gérer objectifs/matériel */}
            <button
              onClick={() => navigate('/manage-goals-materials')}
              className="w-10 h-10 flex items-center justify-center rounded-md transition hover:bg-gray-100"
              title="Gérer objectifs et matériel"
            >
              <GoGoal className="text-dark2GreenErgogo text-3xl" />
              <GiToolbox className="text-dark2GreenErgogo text-3xl" />
            </button>

            {/* Formulaire d'ajout d'activité */}
            <ActivityForm onCreated={triggerRefresh} showToast={showToast} />

          </div >
      </div>


      {/* Corps 3 colonnes */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto p-2 sm:p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 h-full">

          {/* Colonne 1 : Filtres */}
          <div className={`w-full md:w-[20%] min-w-[260px] mb-4 md:mb-0 transition-all duration-300 ease-in-out
            ${!showFilters && window.innerWidth < 768 ? 'h-0 min-h-0 p-0 m-0 opacity-0 pointer-events-none' : 'h-auto opacity-100'}`}
            style={{overflow: !showFilters && window.innerWidth < 768 ? 'hidden' : 'visible'}}
          >
            <div 
              className={`bg-white rounded-2xl shadow-md p-4 sticky top-16 z-20 transition-transform duration-300 ease-in-out
                ${showFilters ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
                md:static md:opacity-100 md:translate-y-0`
              }
              style={{ willChange: 'transform, opacity' }}
            >
              <ActivityFilters filters={filters} setFilters={setFilters} onCreated={refresh} />
            </div>
          </div>

          {/* Colonne 2 : Liste d’activités */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar activities-scrollable">
            <ActivityList filters={filters} refresh={refresh} />
          </div>

        </div>
      </div>

      {/* Toast notification */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default ActivitiesPage;
