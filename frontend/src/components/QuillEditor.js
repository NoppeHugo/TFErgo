import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ value, onChange, readOnly = false }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // ⚠️ Supprime l'ancienne instance de Quill avant de recréer
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = value || "";
      quillInstance.current.enable(!readOnly); // Active/désactive l'édition
      return;
    }

    // ✅ Création de Quill avec une vraie barre d'outils
    quillInstance.current = new Quill(editorRef.current, {
      theme: "snow",
      readOnly: readOnly,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });

    // ✅ Gérer les changements de texte
    quillInstance.current.on("text-change", () => {
      const newContent = quillInstance.current.root.innerHTML;
      onChange(newContent);
    });

    // ✅ Charger la valeur initiale
    quillInstance.current.root.innerHTML = value || "";

  }, [readOnly]);

  // ✅ Mettre à jour Quill si `value` change
  useEffect(() => {
    if (quillInstance.current && quillInstance.current.root.innerHTML !== value) {
      quillInstance.current.root.innerHTML = value || "";
    }
  }, [value]);

  return <div className="quill-editor" ref={editorRef} />;
};

export default QuillEditor;