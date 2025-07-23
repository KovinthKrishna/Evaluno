"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function Home() {
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const statSection = document.getElementById("stats");
      if (statSection && window.scrollY + window.innerHeight > statSection.offsetTop + 100) {
        setStartCount(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-gradient-to-br from-[#1b113f] to-[#0c071c] text-white min-h-screen overflow-x-hidden relative">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10 fixed top-0 w-full z-50"
      >
        <div className="text-xl font-bold tracking-widest">EVALUNO</div>
        <ul className="hidden md:flex space-x-8 font-medium text-sm">
          <li><Link href="#about">About</Link></li>
          <li><Link href="#clients">Clients</Link></li>
          <li><Link href="#contact">Contact</Link></li>
        </ul>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition">Log in</Link>
          <Link href="/register" className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition">Sign up</Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 pt-40 md:pt-48 pb-20 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 md:max-w-xl shadow-xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Welcome to <br />
            <span className="inline-block">
              <span className="typing font-mono bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                Evaluno
              </span>
            </span>
          </h1>
          <p className="text-md md:text-lg text-white/70 mb-8">
            The smart AI-powered recruiting assistant that streamlines hiring for enterprises and individuals.
          </p>
          <div className="space-x-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/register"
              className="inline-block px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Get Started
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition text-white"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2"
        >
          <Image
            src="/sidehome.png"
            alt="AI Recruiting Visual"
            width={600}
            height={600}
            className="rounded-3xl shadow-2xl object-contain"
            priority
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 px-6 md:px-16 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { label: "Total Users", value: 12400 },
            { label: "Jobs Matched", value: 8700 },
            { label: "Companies", value: 320 },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl p-8 bg-white/10 border border-white/20 shadow-xl"
            >
              <h3 className="text-4xl font-bold">
                {startCount && <CountUp end={stat.value} duration={2} />}+
              </h3>
              <p className="text-white/70 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clients Section */}
      <motion.section
        id="clients"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-16"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Our Clients</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Meta", "Google", "Amazon", "Microsoft"].map((client, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-lg shadow-md hover:scale-105 transition"
              >
                <p className="text-lg font-medium">{client}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-16 bg-white/5 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Evaluno is built to empower recruiters and job seekers with AI-driven tools that analyze resumes, match job criteria, and provide data-driven hiring insights. We aim to reduce recruitment friction, increase transparency, and enable smarter hiring decisions for teams of all sizes.
          </p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-24 px-6 md:px-16"
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-white/70 mb-6">Reach out for partnerships, support, or feedback.</p>
          <form className="space-y-6">
            <input type="text" placeholder="Your Name" className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white" />
            <input type="email" placeholder="Your Email" className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white" />
            <textarea placeholder="Your Message" rows={5} className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white"></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 transition font-semibold"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </motion.section>

      {/* Background Blobs */}
      <div className="fixed -top-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full filter blur-3xl opacity-50 z-0"></div>
      <div className="fixed top-60 -left-40 w-[400px] h-[400px] bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full filter blur-2xl opacity-40 z-0"></div>

      <style jsx global>{`
        .typing {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
          animation: typing 2s steps(7, end) forwards, blink 0.7s step-end infinite;
          border-right: 2px solid #fff;
          animation-delay: 0.5s;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 7ch; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
      `}</style>
    </main>
  );
}
