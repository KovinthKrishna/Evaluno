"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = jwtDecode<{ username: string }>(token);
    setUsername(decoded.username);

    const hour = new Date().getHours();
    let greet = "Hello";
    if (hour < 12) greet = "Good Morning";
    else if (hour < 18) greet = "Good Afternoon";
    else greet = "Good Evening";

    setGreeting(`${greet}, ${decoded.username}!`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white font-sans p-6">
      <h1 className="text-3xl font-bold mb-6 h-12">{greeting}</h1>

      <motion.button
        onClick={() => router.push("/start-interview")}
        className="bg-purple-600/40 border border-white/20 px-6 py-3 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all"
        whileHover={{ scale: 1.05 }}
      >
        Start Interview
      </motion.button>
    </div>
  );
}
