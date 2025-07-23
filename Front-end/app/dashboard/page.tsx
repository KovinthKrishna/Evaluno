"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");
  const [typedGreeting, setTypedGreeting] = useState("");

  const router = useRouter();

  const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/");
};


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

    const fullGreeting = `${greet}, ${decoded.username}!`;
    setGreeting(fullGreeting);
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedGreeting(greeting.slice(0, i));
      i++;
      if (i > greeting.length) clearInterval(timer);
    }, 75);
    return () => clearInterval(timer);
  }, [greeting]);

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bganimate.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Logout Button - Top Right Corner */}
<button
  onClick={handleLogout}
  className="absolute top-4 right-4 z-20 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md text-sm"
>
  Logout
</button>


      {/* Main content */}
      <div className="relative z-10 min-h-screen backdrop-blur-md bg-black/40 px-6 py-12 flex flex-col items-center justify-start space-y-10">
        
        {/* Header Box */}
        <div className="w-full max-w-5xl p-6 rounded-2xl shadow-lg space-y-6 bg-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{typedGreeting}</h1>
              <p className="text-sm text-gray-300">Welcome back!</p>
            </div>
            <button
              onClick={() => router.push("/settings")}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm"
            >
              Settings
            </button>
               
          </div>

          

          {/* Subscription Panel */}
          <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between shadow-md">
            <div>
              <h2 className="text-lg font-medium">Subscription Plan</h2>
              <p className="text-sm text-gray-300">
                You are on the <span className="text-green-400 font-semibold">Free</span> plan
              </p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 text-sm rounded-md shadow">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Function Buttons - OUTSIDE box */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/start-interview")}
            className="bg-purple-600/40 border border-white/20 px-6 py-5 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all text-lg font-medium"
          >
            Start Interview
          </button>
          <button
            onClick={() => router.push("/compare")}
            className="bg-purple-600/40 border border-white/20 px-6 py-5 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all text-lg font-medium"
          >
            Compare CVs
          </button>
          <button
            onClick={() => router.push("/analyze")}
            className="bg-purple-600/40 border border-white/20 px-6 py-5 rounded-xl shadow-md hover:bg-purple-600/70 backdrop-blur-lg transition-all text-lg font-medium"
          >
            Analyze CV
          </button>
        </div>
      </div>
    </div>
  );
}
