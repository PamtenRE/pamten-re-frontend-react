"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import AIEnhanceButton from "@/components/candidate/AIEnhanceButton";

interface RichTextEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  sectionName?: string;
  rows?: number;
  className?: string;
  modules?: any; // ✅ Add this line
  formats?: string[];
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here...",
  minHeight = "180px",
  maxHeight = "500px",
  sectionName = "Description",
}: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [enhanceText, setEnhanceText] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false, // ✅ prevents SSR rendering
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose prose-sm dark:prose-invert min-h-[180px] p-4 text-gray-900 dark:text-white",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setEnhanceText(editor.getText());
    },
  });

  // Keep editor in sync when external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value]);

  const applyEnhancement = (enhancedText: string) => {
    if (!editor) return;
    editor.commands.setContent(`<p>${enhancedText}</p>`);
    onChange(`<p>${enhancedText}</p>`);
  };

  if (!isClient) return null; // 🧠 Render nothing on server

  return (
    <div
      className="rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f0f12] shadow-sm overflow-hidden"
      style={{ minHeight, maxHeight }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-zinc-900/50">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${
            editor?.isActive("bold") ? "bg-gray-200 dark:bg-zinc-700" : ""
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${
            editor?.isActive("italic") ? "bg-gray-200 dark:bg-zinc-700" : ""
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${
            editor?.isActive("underline") ? "bg-gray-200 dark:bg-zinc-700" : ""
          }`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${
            editor?.isActive("bulletList") ? "bg-gray-200 dark:bg-zinc-700" : ""
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${
            editor?.isActive("orderedList")
              ? "bg-gray-200 dark:bg-zinc-700"
              : ""
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 ${
            editor?.isActive("blockquote") ? "bg-gray-200 dark:bg-zinc-700" : ""
          }`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url) editor?.chain().focus().setLink({ href: url }).run();
          }}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700"
        >
          <Link2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="overflow-y-auto" />
    </div>
  );
}
