"use client";

import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";

interface RichTextEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  modules?: any; // ✅ Add this line
  formats?: string[];
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your job description here...",
}: RichTextEditorProps) {
  const { quill, quillRef } = useQuill({
    placeholder,
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link", "clean"],
      ],
    },
  });

  useEffect(() => {
    if (!quill) return;

    /** ✅ Replace Quill’s built-in paste handler */
    const Clipboard = quill.getModule("clipboard");

    (Clipboard as any).addMatcher(Node.ELEMENT_NODE, (node: any) => {
      const text = node.textContent || "";
      return quill.clipboard.convert({ text });
    });

    /** ✅ Also intercept browser paste event */
    quill.root.addEventListener("paste", (e: ClipboardEvent) => {
      e.preventDefault();
      const plainText = e.clipboardData?.getData("text/plain") || "";
      const range = quill.getSelection(true);
      quill.insertText(range?.index || 0, plainText, "user");
    });

    /** 🔄 Keep editor value in sync with parent */
    quill.on("text-change", () => {
      onChange(quill.root.innerHTML);
    });

    /** 🧠 Initialize existing value */
    if (value && quill.root.innerHTML !== value) {
      quill.root.innerHTML = value;
    }
  }, [quill, value, onChange]);

  return (
    <div className="rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f12] overflow-hidden shadow-md">
      <div
        ref={quillRef}
        className="min-h-[250px] max-h-[500px] overflow-y-auto p-3 text-black dark:text-white"
      />
    </div>
  );
}
