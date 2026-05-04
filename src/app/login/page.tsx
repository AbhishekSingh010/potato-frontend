"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🔥 Perfectly matches your custom LoginRequest backend model!
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save the JWT token and route to the dashboard
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard");
      } else {
        // Safely extract the error whether it's a Pydantic Array (422) or your custom 401 String
        if (Array.isArray(data.detail)) {
          setError(`Validation error: ${data.detail[0].msg}`);
        } else if (typeof data.detail === "string") {
          setError(data.detail);
        } else {
          setError("Invalid credentials. Please try again.");
        }
      }
    } catch (err) {
      setError("Secure connection failed. Retrying...");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-[#020617]"></div>;

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* 🔮 Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-teal-800/20 rounded-full blur-[150px] pointer-events-none" />

      {/* 💳 Glassmorphic Card */}
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            PotatoCare
          </Link>
          <p className="text-slate-400 mt-3 text-sm tracking-wide">Secure Access Terminal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium tracking-wide flex items-center shadow-[0_0_15px_rgba(244,63,94,0.1)] animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Operator ID
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Passcode
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 flex justify-center items-center rounded-xl font-bold text-white transition-all duration-300 ${
              isLoading
                ? "bg-emerald-600/50 cursor-wait"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <span className="tracking-widest text-sm uppercase animate-pulse">Authenticating...</span>
            ) : (
              "Initialize Session"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          New to the network?{" "}
          <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-all">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}