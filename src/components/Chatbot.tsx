"use client";
import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Error processing request." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Network error. Unable to reach the advisor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative group font-sans">
      
      {/* 🔮 Ambient Glow behind the Chatbot (Visible on hover) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] animate-in fade-in zoom-in duration-500">
        
        {/* Subtle Inner Orbs for depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 p-5 border-b border-white/10 bg-slate-900/50 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight">
                Agronomist AI
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">System Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-70 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </div>
              <p className="text-center text-slate-300 text-base font-medium">Connect to the Knowledge Base.</p>
              <p className="text-center text-slate-500 text-sm mt-2 max-w-[250px]">Ask me about late blight treatments, soil pH, or crop management.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 text-sm leading-relaxed tracking-wide ${
                msg.role === "user" 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-tr-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                  : "bg-white/5 border border-white/10 backdrop-blur-md text-slate-200 rounded-2xl rounded-tl-sm shadow-xl"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl rounded-tl-sm shadow-xl flex gap-2 items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Form */}
        <div className="relative z-10 p-5 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the database..."
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-5 pr-16 py-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 aspect-square h-10 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95"
            >
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}