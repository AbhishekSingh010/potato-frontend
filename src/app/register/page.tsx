"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // --- 🛡️ Client-Side Validation ---
    if (password.length < 6) {
      setError("Passcode must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passcodes do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      // Sending JSON directly to match your backend logic
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

     

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      } else {
        // 🔥 NEW: Safely extract the error message whether it's an array or a string
        if (Array.isArray(data.detail)) {
          // If it's a Pydantic validation error, grab the first message
          setError(`Validation error: ${data.detail[0].msg}`);
        } else if (typeof data.detail === "string") {
          // If it's a custom HTTPException string
          setError(data.detail);
        } else {
          // Fallback
          setError("Registration failed. Please check your inputs.");
        }
      }
    } catch (err) {
      setError("Network error. Unable to reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* 🔮 Background Glowing Orbs (Slightly shifted from Login for visual variety) */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-indigo-800/20 rounded-full blur-[150px] pointer-events-none" />

      {/* 💳 Glassmorphic Card */}
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 transition-all duration-500">
        
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            PotatoCare
          </Link>
          <p className="text-slate-400 mt-3 text-sm tracking-wide">Initialize Operator Profile</p>
        </div>

        {/* Dynamic State Banners */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium tracking-wide flex items-center shadow-[0_0_15px_rgba(244,63,94,0.1)] animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
          </div>
        )}

        {isSuccess ? (
          /* ✨ Success State UI */
          <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Profile Synthesized</h3>
            <p className="text-slate-400 text-sm text-center">Your credentials have been securely registered. Rerouting to login terminal...</p>
            
            {/* Loading Bar Animation */}
            <div className="w-full h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-emerald-400 animate-[progress_2.5s_ease-in-out_forwards]" />
            </div>
          </div>
        ) : (
          /* 📝 Registration Form */
          <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Desired Operator ID (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="e.g. agritech_user"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Secure Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Verify Passcode
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword && password !== confirmPassword 
                    ? "border-rose-500/50 focus:ring-rose-500/50" 
                    : "border-white/10 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                }`}
                placeholder="Re-enter your passcode"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 mt-4 flex justify-center items-center rounded-xl font-bold text-white transition-all duration-300 ${
                isLoading
                  ? "bg-emerald-600/50 cursor-wait"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <span className="tracking-widest text-sm uppercase animate-pulse">Provisioning...</span>
              ) : (
                "Create Access Token"
              )}
            </button>
          </form>
        )}

        {/* Footer (Hidden if success state is active) */}
        {!isSuccess && (
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have clearance?{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-all">
              Initialize Session
            </Link>
          </p>
        )}
      </div>

      {/* Tailwind Animation for the success progress bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}