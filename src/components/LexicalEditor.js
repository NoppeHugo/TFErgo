import React, { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, COMMAND_PRIORITY_EDITOR } from "lexical";
import { createCommand } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { $isTextNode } from "lexical";

// ✅ Création des commandes personnalisées pour la couleur et la taille de police
const APPLY_TEXT_COLOR_COMMAND = createCommand("APPLY_TEXT_COLOR_COMMAND");
const APPLY_FONT_SIZE_COMMAND = createCommand("APPLY_FONT_SIZE_COMMAND");

const editorConfig = {
  namespace: "MyEditor",
  theme: {
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
  },
  onError: (error) => {
    console.error("Lexical Error:", error);
  },
};

// ✅ Plugin pour gérer les styles (gras, italique, soulignement, taille et couleur)
const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  // Appliquer une commande native (gras, italique, souligné)
  const applyFormatCommand = (command) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  // Appliquer la couleur du texte via une commande personnalisée
  const applyTextColor = (color) => {
    editor.dispatchCommand(APPLY_TEXT_COLOR_COMMAND, color);
  };

  // Appliquer la taille du texte via une commande personnalisée
  const applyFontSize = (size) => {
    editor.dispatchCommand(APPLY_FONT_SIZE_COMMAND, size);
  };

  return (
    <div className="flex space-x-2 p-2 border-b bg-gray-100 rounded-t">
      {/* ✅ Gras, Italique, Soulignement */}
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => applyFormatCommand("bold")}>B</button>
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => applyFormatCommand("italic")}>I</button>
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => applyFormatCommand("underline")}>U</button>

      {/* ✅ Couleur du texte */}
      <input
        type="color"
        className="ml-2"
        onChange={(e) => applyTextColor(e.target.value)}
      />

      {/* ✅ Taille du texte */}
      <select
        className="ml-2 border px-2 py-1"
        onChange={(e) => applyFontSize(`${e.target.value}px`)}
      >
        <option value="12">Petit</option>
        <option value="16">Normal</option>
        <option value="20">Grand</option>
        <option value="24">Très grand</option>
      </select>
    </div>
  );
};

// ✅ Plugin pour gérer les commandes personnalisées (Couleur et Taille)
const TextStylePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) return;

    // Commande pour changer la couleur du texte
    editor.registerCommand(
      APPLY_TEXT_COLOR_COMMAND,
      (color) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { color });
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    // Commande pour changer la taille du texte
    editor.registerCommand(
      APPLY_FONT_SIZE_COMMAND,
      (size) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { fontSize: size });
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
};

// ✅ Composant principal de l'éditeur Lexical avec gestion des styles
const LexicalEditor = ({ value, onChange, readOnly }) => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="border rounded bg-white shadow-lg">
        {!readOnly && <ToolbarPlugin />}
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[150px] p-3 outline-none bg-gray-50" />}
          placeholder={<div className="text-gray-400 p-3">Écrivez ici...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <TextStylePlugin /> {/* ✅ Plugin pour appliquer la couleur et la taille */}
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              onChange(editorState);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;
