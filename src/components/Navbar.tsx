"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

// Adjusted to match your FastAPI JWT payload structure
type UserType = {
  sub: string;      // User ID
  username: string; // Operator Username
  exp: number;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Used to highlight the active tab
  const [user, setUser] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: UserType = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token");
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    router.push("/login");
  };

  // Helper function for active link styling
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `text-sm font-semibold tracking-wide transition-all duration-300 ${
      isActive 
        ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
        : "text-slate-400 hover:text-slate-200"
    }`;
  };

  return (

<nav className="fixed sticky top-0 left-0 right-0 z-50 w-full bg-[#020617]/70 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 🌿 Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
               <span className="text-emerald-400 text-xl">🌱</span>
            </div>
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight">
              PotatoCare
            </span>
          </Link>

          {/* 🔗 Desktop Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className={getLinkStyle("/")}>Home</Link>
            <Link href="/about" className={getLinkStyle("/about")}>About</Link>
            
            {/* Only show secure links if logged in */}
            {user && (
              <>
                <Link href="/dashboard" className={getLinkStyle("/dashboard")}>Command Center</Link>
                <Link href="/predict" className={getLinkStyle("/predict")}>Scanner</Link>
                <Link href="/advisor" className={getLinkStyle("/advisor")}>AI Advisor</Link>
              </>
            )}
          </div>

          {/* 👤 Profile / Auth Section */}
          <div className="relative flex items-center gap-4" ref={dropdownRef}>
            {user ? (
              // Logged In: Glass Profile Button
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10 hover:bg-slate-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {user.username ? user.username.charAt(0).toUpperCase() : "O"}
                </div>
                <span className="text-sm font-medium text-slate-200 hidden sm:block pr-2">
                  {user.username}
                </span>
              </button>
            ) : (
              // Logged Out: Auth Buttons
              <div className="hidden sm:flex gap-3">
                <Link 
                  href="/login" 
                  className="px-5 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600/90 rounded-xl hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                >
                  Get Access
                </Link>
              </div>
            )}

            {/* 🔽 Dropdown Menu (Glassmorphic) */}
            {open && user && (
              <div className="absolute top-12 right-0 mt-2 w-56 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 transform transition-all animate-in fade-in slide-in-from-top-2">
                
                <div className="px-4 py-3 border-b border-slate-700/50 mb-2">
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Operator Config</p>
                  <p className="text-sm font-bold text-white mt-1 truncate">@{user.username}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">ID: {user.sub}</p>
                </div>

                <div className="space-y-1">
                  {/* Mobile Links (Show in dropdown on small screens) */}
                  <div className="md:hidden border-b border-slate-700/50 pb-2 mb-2 space-y-1">
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg">Command Center</Link>
                    <Link href="/predict" onClick={() => setOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg">Scanner</Link>
                    <Link href="/advisor" onClick={() => setOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg">AI Advisor</Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}