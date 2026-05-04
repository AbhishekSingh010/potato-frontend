"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // 🔥 Import our smart Navbar

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth state for the hero buttons
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    // The Foundation: Deep slate background
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* 🔮 The Magic: Ambient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-teal-800/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 🔥 Replaced the hardcoded nav with our smart component */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/10 backdrop-blur-md mb-8 animate-fade-in-up shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-300 tracking-widest uppercase">CNN Model v1.0 is online</span>
        </div>

        {/* Hero Typography */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
          Protect your harvest, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-teal-200 to-indigo-300">
            powered by deep learning.
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-12">
          Upload leaf specimens and instantly detect Early Blight, Late Blight, or verify plant health using our advanced convolutional neural network. Precision agriculture, instantly accessible.
        </p>

        {/* 🔥 Smart Call to Actions based on Auth State */}
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          {isLoggedIn ? (
            <button 
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 rounded-2xl bg-emerald-500 text-[#020617] font-bold text-lg hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] text-center"
            >
              Enter Command Center &rarr;
            </button>
          ) : (
            <>
              <Link href="/register" className="px-8 py-4 rounded-2xl bg-emerald-500 text-[#020617] font-bold text-lg hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] text-center">
                Get Access Now
              </Link>
              <Link href="/about" className="px-8 py-4 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl text-white font-semibold text-lg hover:bg-slate-800/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                How the AI Works
              </Link>
            </>
          )}
        </div>

        {/* Neural Network Abstract Visualization */}
        <div className="w-full max-w-5xl rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-4 md:p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />
          
          <div className="w-full aspect-video rounded-2xl bg-[#0f172a] border border-white/5 overflow-hidden relative flex items-center justify-center">
            
            {/* Animated Data Streams */}
            <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent top-1/4 animate-pulse" />
            <div className="absolute w-[60%] h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent top-2/4" />
            <div className="absolute w-[90%] h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent top-3/4 animate-pulse" />
            
            <div className="flex gap-6 z-10">
              {/* Healthy Leaf Abstraction */}
              <div className="w-32 h-40 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-md shadow-2xl transform -translate-y-4 transition-transform hover:-translate-y-8 duration-500 flex flex-col justify-between p-4 hidden md:flex">
                <div className="w-full h-20 bg-emerald-900/30 rounded-lg border border-emerald-500/20" />
                <div className="h-2 w-16 bg-emerald-500/50 rounded-full" />
              </div>
              
              {/* The "AI Scanner" Core */}
              <div className="w-40 h-48 rounded-xl bg-slate-800/80 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.1)] z-20 transition-transform hover:-translate-y-4 duration-500 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute top-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)] animate-[scan_2s_ease-in-out_infinite]" />
                 <div className="w-16 h-16 rounded-full border border-emerald-500/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
                 </div>
                 <span className="mt-4 text-xs font-mono text-emerald-400 tracking-widest">PROCESSING</span>
              </div>

              {/* Blight Leaf Abstraction */}
              <div className="w-32 h-40 rounded-xl bg-slate-800/50 border border-white/10 backdrop-blur-md shadow-2xl transform translate-y-4 transition-transform hover:-translate-y-2 duration-500 flex flex-col justify-between p-4 hidden md:flex">
                <div className="w-full h-20 bg-rose-900/30 rounded-lg border border-rose-500/20" />
                <div className="h-2 w-16 bg-rose-500/50 rounded-full" />
              </div>
            </div>

          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
      `}} />
    </div>
  );
}