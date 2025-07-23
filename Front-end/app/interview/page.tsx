"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Interview() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [greeting, setGreeting] = useState("");
  const [typedGreeting, setTypedGreeting] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);

  const [jobTitle, setJobTitle] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [qaItems, setQaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [completedSteps, setCompletedSteps] = useState({
    cv: false,
    jobTitle: false,
    jobRequirements: false,
    jobDescription: false,
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode<{ username: string; user_id: string }>(token);
    setUsername(decoded.username);
    setUserId(decoded.user_id);

    const hour = new Date().getHours();
    let greet = "Hello";
    if (hour < 12) greet = "Good Morning";
    else if (hour < 18) greet = "Good Afternoon";
    else greet = "Good Evening";
    const fullGreeting = `${greet}, ${decoded.username}!`;
    setGreeting(fullGreeting);
  }, []);

  useEffect(() => {
    setCompletedSteps({
      cv: !!file,
      jobTitle: jobTitle.trim().length > 0,
      jobRequirements: jobRequirements.trim().length > 0,
      jobDescription: jobDescription.trim().length > 0,
    });
  }, [file, jobTitle, jobRequirements, jobDescription]);

  const totalSteps = 4;
  const stepsCompleted = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = (stepsCompleted / totalSteps) * 100;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedGreeting(greeting.slice(0, i));
      i++;
      if (i > greeting.length) clearInterval(timer);
    }, 75);
    return () => clearInterval(timer);
  }, [greeting]);

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
    } catch (error) {
      alert("Error generating interview Q&A");
      console.error(error);
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white font-sans p-6">
      <h1 className="text-3xl font-bold mb-6 h-12">
        <span className="typing">{typedGreeting}</span>
      </h1>
      <div className="flex space-x-6 mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-purple-600/40 border border-white/20 px-6 py-3 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all"
        >
          ← Return Home
        </button>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600/40 border border-white/20 px-6 py-3 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all"
          >
            Start Interview
          </button>
        )}
      </div>



      {/* Step Progress Indicator */}
      <div className="flex justify-between items-center mb-10">
        {[
          { label: "Upload CV", key: "cv" },
          { label: "Job Title", key: "jobTitle" },
          { label: "Requirements", key: "jobRequirements" },
          { label: "Description", key: "jobDescription" },
        ].map((stepItem, index) => {
          const isCompleted = completedSteps[stepItem.key as keyof typeof completedSteps];
          const isCurrent = step === index + 1;

          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full z-10
            ${isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-purple-500 text-white"
                      : "bg-white/20 text-white border border-white/30"
                  }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Label */}
              <div className="mt-2 text-xs text-center text-white/90 w-24">{stepItem.label}</div>

              {/* Line Connector */}
              {index < 3 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${completedSteps[Object.keys(completedSteps)[index + 1] as keyof typeof completedSteps]
                    ? "bg-green-400"
                    : "bg-white/20"
                    }`}
                  style={{ transform: "translateX(50%)", width: "100%" }}
                ></div>
              )}
            </div>
          );
        })}
      </div>


      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-6 shadow-xl space-y-4"
        >
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold mb-2">Step 1: Upload your CV</h2>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block mb-4 text-white"
              />
              <button
                onClick={() => setStep(2)}
                disabled={!file}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
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
                className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-purple-400 mb-4"
              />
              <textarea
                placeholder="Job Requirements"
                value={jobRequirements}
                onChange={(e) => setJobRequirements(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-purple-400 mb-4"
              />
              <textarea
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {loading ? "Generating..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {qaItems.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">🎯 Generated Q&A:</h2>
          {qaItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4 p-5 rounded-xl border border-white/20 shadow-lg bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all"
            >
              <p className="text-lg font-medium text-purple-200">Q: {item.question}</p>
              <p className="mt-1 text-sm text-white/90">A: {item.answer}</p>
              <p className="mt-2 text-xs text-white/60">Difficulty: <span className="italic">{item.difficulty}</span></p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
