"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ComparePage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    files.forEach(file => formData.append("cv_files", file));
    formData.append("job_title", jobTitle);
    formData.append("job_requirements", jobRequirements);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("http://localhost:8000/compare/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Comparison failed");
      const data = await response.json();
      setResults(data.comparisons);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to compare CVs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">CV Comparison Tool</h1>
      <button
    onClick={() => router.push("/dashboard")}
    className="bg-purple-600/40 border border-white/20 px-6 py-3 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all"
  >
    ← Return Home
  </button>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block mb-2 text-lg">Upload CVs (PDF/DOCX)</label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.docx"
            className="block w-full text-white"
          />
          {files.length > 0 && (
            <div className="mt-2">
              <p className="text-sm">Selected files: {files.length}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-lg">Job Requirements</label>
          <textarea
            value={jobRequirements}
            onChange={(e) => setJobRequirements(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 min-h-[100px]"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-lg">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 min-h-[100px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || files.length === 0}
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare CVs"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Comparison Results</h2>
          <div className="grid gap-6">
            {results
              .sort((a, b) => b.score - a.score)
              .map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">
                      CV #{index + 1} - Score:{" "}
                      <span
                        className={
                          result.score >= 75
                            ? "text-green-400"
                            : result.score >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                      >
                        {result.score.toFixed(1)}
                      </span>
                    </h3>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(
                          #4ade80 ${result.score * 3.6}deg,
                          #1e293b 0deg
                        )`,
                      }}
                    >
                      <span className="text-sm font-bold">
                        {result.score.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-300 mb-2">
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {result.strengths.map((strength: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-400 mr-2">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-red-300 mb-2">
                        Weaknesses
                      </h4>
                      <ul className="space-y-2">
                        {result.weaknesses.map((weakness: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-red-400 mr-2">✗</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}