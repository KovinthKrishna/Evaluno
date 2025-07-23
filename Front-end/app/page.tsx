/*"use client";

import Link from "next/link";
import Image from "next/image";
import HeroImg from "../public/sidehome.png"; // <-- Replace with your actual image path

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#1b113f] to-[#0c071c] min-h-screen text-white relative overflow-hidden">
      {/* Glassy Navbar *//*}
      <nav className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10 fixed top-0 w-full z-50">
        <div className="text-xl font-bold tracking-widest">EVALUNO</div>
        <ul className="hidden md:flex space-x-8 font-medium text-sm">
          <li><Link href="#">Home</Link></li>
          <li><Link href="#">About</Link></li>
          <li><Link href="#">Products</Link></li>
        </ul>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition">Log in</Link>
          <Link href="/register" className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section - Two Columns *//*}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 pt-40 md:pt-48 pb-20 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        
        {/* Left Glassy Content *//*}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 md:max-w-xl shadow-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
            Welcome to <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">Evaluno</span>
          </h1>
          <p className="text-md md:text-lg text-white/70 mb-8">
            The smart AI-powered recruiting assistant that streamlines hiring for enterprises and individuals.
          </p>
          <div className="space-x-4">
            <Link href="/register" className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition">
              Get Started
            </Link>
            <button className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition text-white">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side Image *//*}
        <div className="w-full md:w-1/2">
          <Image
            src={HeroImg}
            alt="AI Recruiting Visual"
            width={600}
            height={600}
            className="rounded-3xl shadow-2xl object-contain"
            priority
          />
        </div>
      </section>

      {/* Decorative Background Blobs *//*}
      <div className="absolute -top-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full filter blur-3xl opacity-50 z-0"></div>
      <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full filter blur-2xl opacity-40 z-0"></div>
    </main>
  );
}

*/
// components/GlassCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-[#1b113f] to-[#0c071c] min-h-screen text-white relative overflow-hidden">
      {/* Glassy Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10 fixed top-0 w-full z-50">
        <div className="text-xl font-bold tracking-widest">EVALUNO</div>
        <ul className="hidden md:flex space-x-8 font-medium text-sm">
          <li><Link href="#">Home</Link></li>
          <li><Link href="#">About</Link></li>
          <li><Link href="#">Products</Link></li>
          <li><Link href="/compare">CV Comparison</Link></li>
        </ul>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition">Log in</Link>
          <Link href="/register" className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section - Two Columns */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 pt-40 md:pt-48 pb-20 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        
        {/* Left Glassy Content */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 md:max-w-xl shadow-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
            Welcome to <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">Evaluno</span>
          </h1>
          <p className="text-md md:text-lg text-white/70 mb-8">
            The smart AI-powered recruiting assistant that streamlines hiring for enterprises and individuals.
          </p>
          <div className="space-x-4">
            <Link href="/register" className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition">
              Get Started
            </Link>
            <button className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition text-white">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/sidehome.png"
            alt="AI Recruiting Visual"
            width={600}
            height={600}
            className="rounded-3xl shadow-2xl object-contain"
            priority
          />
        </div>
      </section>

      {/* Decorative Background Blobs */}
      <div className="absolute -top-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full filter blur-3xl opacity-50 z-0"></div>
      <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full filter blur-2xl opacity-40 z-0"></div>
    </main>
  );
}  