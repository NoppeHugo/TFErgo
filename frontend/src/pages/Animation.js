// src/components/Animation.js
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from './logo.png'; 

const Animation = ({ onFinish }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onFinish();
    }, 2500); // ⏱️ Durée totale de l'animation
    return () => clearTimeout(timer);
  }, [onFinish]);

  return show ? (
    <motion.div
      className="fixed inset-0 bg-[#f2eef3] z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <motion.img
        src={logo}
        alt="Ergogo Logo"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-64 h-64 mb-4"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 text-xl text-gray-700 font-semibold"
      >
        ERGOGO letsgo yoyo !!
      </motion.div>
    </motion.div>
  ) : null;
};

export default Animation;
