"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type PredictionResult = {
  prediction: string;
  confidence: string; // The backend returns this as a string formatted to 2 decimals
  image_url: string;
  message: string;
};

export default function PredictionEngine() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kick out unauthenticated users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Handle Drag & Drop Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    setResult(null);
    
    // Validate it's an image
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }

    setFile(selectedFile);
    // Create a local URL for instant preview before uploading
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const runDiagnostics = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    
    // We MUST use FormData to send multipart/form-data to FastAPI
    const formData = new FormData();
    formData.append("file", file);

    try {
      // NOTE: Ensure this URL matches your actual prediction route exactly
      // If your router prefix is /predict and the route is "/", it's /predict/
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT manually set Content-Type here. The browser sets it automatically 
          // with the correct boundary when passing a FormData object.
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.detail || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Unable to reach the diagnostic server.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  // Neon glowing badges for the dark theme
  const getBadgeStyle = (prediction: string) => {
    const lower = prediction.toLowerCase();
    if (lower.includes("healthy")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
    if (lower.includes("late")) return "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]";
    if (lower.includes("early")) return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* 🔮 Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[30%] h-[30%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-teal-800/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 pb-20">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100 tracking-tight">
              Diagnostic Scanner
            </h1>
            <p className="text-slate-400 mt-3 text-lg font-light">
              Upload a leaf specimen for deep neural analysis.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium tracking-wide flex items-center shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          {/* 💳 The Main Glass Card */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-500">
            
            {!result ? (
              <div className="flex flex-col items-center">
                
                {/* 📥 Drag & Drop Zone OR Preview */}
                <div 
                  className={`w-full relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center ${
                    preview ? 'border-emerald-500/30 bg-slate-800/20 p-2' : 
                    isDragging ? 'border-emerald-400 bg-emerald-500/10 scale-[1.02]' : 'border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/50 p-12'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !preview && fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    accept="image/jpeg, image/png, image/jpg" 
                    className="hidden" 
                  />

                  {preview ? (
                    <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden group">
                      <img src={preview} alt="Specimen preview" className="w-full h-auto rounded-xl object-cover" />
                      
                      {/* Scanning Animation Overlay (Triggers when loading) */}
                      {isLoading && (
                        <div className="absolute inset-0 z-10 bg-emerald-900/20 pointer-events-none overflow-hidden rounded-xl">
                          <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)] absolute top-0 left-0 animate-[scan_2s_ease-in-out_infinite]" />
                        </div>
                      )}
                      
                      {/* Change Image Button */}
                      {!isLoading && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                          className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center cursor-pointer pointer-events-none">
                      <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <p className="text-lg font-semibold text-slate-200">Drag & drop specimen here</p>
                      <p className="text-sm text-slate-500 mt-2">or click to browse local files (JPG, PNG)</p>
                    </div>
                  )}
                </div>

                {/* 🚀 Action Button */}
                <div className="mt-8 w-full max-w-md">
                  <button
                    onClick={runDiagnostics}
                    disabled={!file || isLoading}
                    className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 ${
                      !file 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : isLoading
                          ? "bg-emerald-600/50 text-white cursor-wait"
                          : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-[0.98]"
                    }`}
                  >
                    {isLoading ? "Running Neural Analysis..." : "Initialize Scan"}
                  </button>
                </div>
              </div>

            ) : (

              /* 📊 Results View */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row gap-8">
                  
                  {/* Left: Image Result */}
                  <div className="w-full md:w-1/2">
                    <div className="rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl relative">
                      <img src={result.image_url} alt="Analyzed specimen" className="w-full h-auto object-cover" />
                      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400">ANALYSIS COMPLETE</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Data Readout */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center space-y-8">
                    
                    <div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">Classification</h3>
                      <span className={`inline-block px-5 py-2 rounded-full text-sm font-bold border ${getBadgeStyle(result.prediction)}`}>
                        {result.prediction.replace("Potato___", "").replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em]">AI Confidence</h3>
                        <span className="text-2xl font-mono text-slate-200">{result.confidence}%</span>
                      </div>
                      {/* Custom Progress Bar */}
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <button
                        onClick={resetScanner}
                        className="w-full py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-semibold tracking-wide uppercase text-sm"
                      >
                        Scan Another Specimen
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Tailwind Animation for the scanning line */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}} />
    </div>
  );
}