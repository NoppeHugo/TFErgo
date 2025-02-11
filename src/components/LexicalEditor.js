import React, { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const editorConfig = {
  namespace: "MyEditor", // Identifiant unique pour ton éditeur
  theme: {
    // Personnalise tes classes ici, par exemple :\n    paragraph: "my-paragraph-class",
  },
  onError: (error) => {
    console.error("Lexical Error:", error);
  },
};

const LexicalEditor = ({ value, onChange, readOnly }) => {
  const editorRef = useRef(null);

  // Si l'éditeur est en mode lecture seule, on s'assure que le contenu affiché correspond à "value"
  useEffect(() => {
    if (editorRef.current && readOnly) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, readOnly]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container border p-3 rounded bg-gray-50">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              ref={editorRef}
              className="min-h-[150px] outline-none"
              onInput={handleInput}
            />
          }
          placeholder={<div className="text-gray-400">Écrivez ici...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
