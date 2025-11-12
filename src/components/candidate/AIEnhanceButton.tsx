"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface AIEnhanceButtonProps {
  sectionName: string;
  text: string;
  onEnhance: (enhancedText: string) => void;
}

export default function AIEnhanceButton({
  sectionName,
  text,
  onEnhance,
}: AIEnhanceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [enhancedOptions, setEnhancedOptions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  const handleEnhance = async () => {
    const cleanInput = (text || "").trim();
    if (!cleanInput) {
      toast.error("Please enter some text before enhancing.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/enhance-section`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionName,
            textToEnhance: cleanInput,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to enhance text");
      const data = await res.json();

      const options: string[] =
        data?.enhancedVersions?.length > 0
          ? data.enhancedVersions
          : [data?.enhancedText || cleanInput];

      if (!options.length) {
        toast.error("No enhanced versions generated.");
        return;
      }

      setEnhancedOptions(options);
      setSelectedVersion("");
      setShowModal(true);
      toast.success("✨ AI-enhanced suggestions ready!");
    } catch (err) {
      console.error("❌ Enhancement failed:", err);
      toast.error("Failed to enhance text. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyEnhancement = (version: string) => {
    // 🧼 Clean up raw HTML tags and lists before applying
    const cleaned = version
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\n\s*\n/g, "\n")
      .replace(/•/g, "• ")
      .trim();

    onEnhance(cleaned);
    setShowModal(false);
    toast.success("✅ Applied AI-enhanced version!");
  };

  return (
    <>
      {/* ✨ Enhance Button */}
      <button
        onClick={handleEnhance}
        disabled={loading}
        className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        {loading ? "Enhancing..." : "Enhance"}
      </button>

      {/* 💬 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-3xl p-6 relative border border-gray-300 dark:border-gray-700">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ✨ AI-Generated Suggestions
            </h2>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
              {enhancedOptions.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-xl ${
                    selectedVersion === option
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "dark:border-gray-700 dark:bg-zinc-800 bg-gray-50"
                  }`}
                  onClick={() => setSelectedVersion(option)}
                >
                  <div
                    className="text-gray-800 dark:text-gray-200 prose prose-sm dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: option }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-400 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => applyEnhancement(selectedVersion)}
                disabled={!selectedVersion}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              >
                Apply Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
