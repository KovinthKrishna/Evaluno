"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StartInterview() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [qaItems, setQaItems] = useState<any[]>([]);
  const [originalItems, setOriginalItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const router = useRouter();

  const [completedSteps, setCompletedSteps] = useState({
    cv: false,
    jobTitle: false,
    jobRequirements: false,
    jobDescription: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decoded = jwtDecode<{ username: string; user_id: string }>(token);
    setUsername(decoded.username);
    setUserId(decoded.user_id);
  }, []);

  useEffect(() => {
    setCompletedSteps({
      cv: !!file,
      jobTitle: jobTitle.trim().length > 0,
      jobRequirements: jobRequirements.trim().length > 0,
      jobDescription: jobDescription.trim().length > 0,
    });
  }, [file, jobTitle, jobRequirements, jobDescription]);

  const handleGenerate = async () => {
    if (!file) return alert("Please upload a CV file.");
    const formData = new FormData();
    formData.append("cv_file", file);
    formData.append("user_id", userId);
    formData.append("job_title", jobTitle);
    formData.append("job_requirements", jobRequirements);
    formData.append("job_description", jobDescription);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/interview/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to generate Q&A");
      const data = await response.json();
      setQaItems(data.items);
      setOriginalItems(data.items);
    } catch (error) {
      alert("Error generating interview Q&A");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterByType = (type: string) => {
    const filtered = originalItems.filter((item) => item.type === type);
    setQaItems(filtered);
  };

  const generateByType = async (type: string) => {
    if (!file) return alert("Upload a CV first");
    const formData = new FormData();
    formData.append("cv_file", file);
    formData.append("user_id", userId);
    formData.append("job_title", jobTitle);
    formData.append("job_requirements", jobRequirements);
    formData.append("job_description", jobDescription);
    formData.append("type", type);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/interview/generate-type", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setQaItems(data.items);
      setOriginalItems(data.items);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate questions for type: " + type);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b0033] via-[#2a0059] to-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {username} 👋</h1>
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-8 px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:shadow transition-all"
      >
        ← Back to Home
      </button>

      {/* Step Progress Bar */}
      <div className="relative flex justify-between items-center mb-12 px-4 sm:px-12">
        {["Upload CV", "Job Title", "Requirements", "Description"].map((label, index) => {
          const key = Object.keys(completedSteps)[index] as keyof typeof completedSteps;
          const isCompleted = completedSteps[key];
          const isCurrent = step === index + 1;
          const isLast = index === 3;
          return (
            <div key={index} className="flex-1 relative flex flex-col items-center z-10">
              {!isLast && (
                <div className="absolute top-5 left-1/2 w-full h-1 z-0">
                  <div
                    className={`h-full transition-all duration-300 ${
                      completedSteps[Object.keys(completedSteps)[index + 1] as keyof typeof completedSteps]
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : "bg-white/20"
                    }`}
                    style={{ transform: "translateX(0%)", width: "100%" }}
                  />
                </div>
              )}
              <div
                className={`w-12 h-12 z-10 flex items-center justify-center rounded-full border border-white/30 shadow-md transition-all duration-300
                  ${isCompleted
                    ? "bg-green-500 text-white shadow-green-400/40"
                    : isCurrent
                    ? "bg-purple-600 text-white shadow-purple-500/30 scale-105"
                    : "bg-white/10 text-white/70"}`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <div className="mt-2 text-xs sm:text-sm text-center text-white/80 w-24">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Step Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl shadow-purple-900/30 space-y-4"
      >
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-2">Step 1: Upload your CV</h2>
            <label className="cursor-pointer w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all shadow-md">
              <svg className="w-10 h-10 text-white/60 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              <span className="text-white/70 text-center text-sm">
                {file ? `Selected File: ${file.name}` : "Click or drag your CV here (.pdf or .docx)"}
              </span>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setStep(2)}
              disabled={!file}
              className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">Step 2: Job Details</h2>
            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 backdrop-blur"
            />
            <textarea
              placeholder="Job Requirements"
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 backdrop-blur"
            />
            <textarea
              placeholder="Job Description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 backdrop-blur"
            />
            <div className="flex gap-4 mt-4">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition-all">
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
              >
                {loading ? "Generating..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Q&A Section */}
      {qaItems.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Interview Q&A</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {["all", "technical", "behavioral", "project", "scenario"].map((type) => (
              <button
                key={type}
                onClick={() => type === "all" ? setQaItems(originalItems) : filterByType(type)}
                className="bg-white/10 px-4 py-1.5 rounded-md text-sm hover:bg-white/20 hover:scale-[1.02] border border-white/10 transition-all"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
            {["technical", "behavioral", "project", "scenario"].map((type) => (
              <button
                key={type}
                onClick={() => generateByType(type)}
                className="bg-white/10 px-4 py-1.5 rounded-md text-sm hover:bg-white/20 hover:scale-[1.02] border border-white/10 transition-all"
              >
                Generate {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            {qaItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/20 shadow-xl backdrop-blur-lg hover:bg-white/10 transition-all"
              >
                <h3 className="text-lg font-semibold text-purple-300">Q: {item.question}</h3>
                <p className="mt-2 text-base text-white/90">A: {item.answer}</p>
                <div className="mt-4 text-sm px-3 py-1 rounded-full bg-purple-900/30 text-white/90 shadow shadow-purple-900/20 inline-block">
                  <strong>Difficulty:</strong> {item.difficulty}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
