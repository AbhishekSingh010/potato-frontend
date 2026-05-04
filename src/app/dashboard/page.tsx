"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Prediction = {
  id: string;
  image_url: string;
  prediction: string;
  confidence: number;
  created_at: string;
};

export default function Dashboard() {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        
        if (Array.isArray(result)) setData(result);
        else if (result && Array.isArray(result.history)) setData(result.history);
        else setData([]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const validData = Array.isArray(data) ? data : [];
  const total = validData.length;
  const avgConfidence = total > 0
    ? (validData.reduce((sum, d) => sum + d.confidence, 0) / total).toFixed(2)
    : "0.00";

  const chartData = Object.values(
    validData.reduce((acc: any, curr) => {
      const dateObj = new Date(curr.created_at);
      const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[dateStr]) acc[dateStr] = { date: dateStr, count: 0, rawDate: dateObj.getTime() };
      acc[dateStr].count += 1;
      return acc;
    }, {})
  ).sort((a: any, b: any) => a.rawDate - b.rawDate);

  // Neon glowing badges for the dark theme
  const getBadgeStyle = (prediction: string) => {
    const lower = prediction.toLowerCase();
    if (lower.includes("healthy")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    if (lower.includes("late")) return "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
    if (lower.includes("early")) return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    // 🌌 Deep Mesh Gradient Background
    <div className="min-h-screen bg-[#020617] relative overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* 🔮 Background Glowing Orbs (The secret to Glassmorphism) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-teal-800/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 pb-16">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100 tracking-tight">
              Command Center
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light">Real-time analysis of your crop health.</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 backdrop-blur-md p-4 rounded-2xl flex items-center shadow-lg">
              <p className="text-rose-400 font-medium tracking-wide">Error: {error}</p>
            </div>
          )}

          {/* 🔥 Metrics Cards (Glass) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Scans", value: total },
              { label: "Network Health", value: "Optimal" }, // Added a fake cool metric, change as needed
              { label: "AI Confidence", value: `${Number(avgConfidence) <= 1 ? (Number(avgConfidence) * 100).toFixed(1) : Number(avgConfidence).toFixed(1)}%` },
            ].map((metric, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl transition-all duration-300 hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-emerald-900/20">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">{metric.label}</h2>
                <p className="text-4xl font-black text-white mt-3 tracking-tight">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* 📈 Graph (Glass) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">Scan Activity Timeline</h2>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ color: '#34d399' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, fill: '#10b981', stroke: '#020617', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-[320px] flex items-center justify-center text-slate-500 font-light">
                 {loading ? "Syncing data matrix..." : "Awaiting first scan."}
               </div>
            )}
          </div>

          {/* 📋 Table (Glass) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em]">Latest Intel</h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-emerald-400/50 animate-pulse tracking-widest text-sm">ACCESSING RECORDS...</div>
              ) : validData.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No predictions found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Target</th>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Classification</th>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Accuracy</th>
                      <th className="px-8 py-5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {validData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                        <td className="px-8 py-5 whitespace-nowrap">
                          <img
                            src={item.image_url}
                            alt="Leaf scan"
                            className="w-14 h-14 object-cover rounded-xl border border-slate-600 shadow-lg"
                          />
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getBadgeStyle(item.prediction)}`}>
                            {item.prediction.replace("Potato___", "").replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap font-mono text-slate-300">
                          {item.confidence <= 1 ? (item.confidence * 100).toFixed(1) : item.confidence.toFixed(1)}%
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-mono">
                          {new Date(item.created_at).toLocaleDateString("en-US", { 
                            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}