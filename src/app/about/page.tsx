"use client";
import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* 🔮 Background Glowing Orbs */}
      <div className="absolute top-[-5%] left-[10%] w-[30%] h-[30%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-teal-800/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[50%] left-[-10%] w-[20%] h-[20%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 pb-20">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100 tracking-tight">
              Pioneering the Future of Agriculture
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
              We leverage advanced convolutional neural networks to put enterprise-grade crop diagnostics directly into the hands of farmers and researchers worldwide.
            </p>
          </div>

          {/* Mission Card (Glass) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-[0.2em]">Our Protocol</h2>
                <h3 className="text-3xl font-bold text-white tracking-tight">Eradicating Blight Through Data</h3>
                <p className="text-slate-400 leading-relaxed">
                  Early and Late Blight can devastate a potato harvest within days. By utilizing transfer learning and millions of data points, our deep learning models identify sub-perceptual patterns of disease before human eyes can detect them, ensuring food security and maximizing yield.
                </p>
              </div>
              <div className="h-64 w-full bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                 {/* Decorative Code/Data Graphic */}
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/40 to-transparent" />
                 <div className="font-mono text-xs text-emerald-500/50 tracking-widest text-center leading-loose">
                    01010000 01001111 <br/>
                    [ MODEL ACCURACY: 98.7% ] <br/>
                    INITIALIZING SCAN... <br/>
                    TARGET ISOLATED
                 </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Real-Time Inference", 
                desc: "Sub-second image processing powered by optimized TensorFlow pipelines and secure cloud storage." 
              },
              { 
                title: "Zero-Knowledge Storage", 
                desc: "All diagnostic imagery is heavily encrypted and linked exclusively to your secure operator token." 
              },
              { 
                title: "Adaptive Learning", 
                desc: "The core neural network continuously improves, hardening its parameters against new disease variants." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl hover:bg-slate-800/50 transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}