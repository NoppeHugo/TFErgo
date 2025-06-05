// src/components/Animation.js
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from '../img/Ergogo.png';

const Animation = ({ onFinish, message = "Bienvenue sur Ergogo" }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return show ? (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-[#f2eef3] to-[#e0e7ff] z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay: 1.1 }}
      role="dialog"
      aria-label="Chargement de l'application"
    >
      <motion.img
        src={logo}
        alt="Logo Ergogo"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-2 drop-shadow-xl max-w-[200px] max-h-[200px]"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-1 text-base md:text-lg text-gray-700 font-semibold text-center"
      >
        {message}
      </motion.div>
      <div className="mt-4">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </motion.div>
  ) : null;
};

export default Animation;
