// app/advisor/page.tsx
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

export default function AdvisorPage() {
  return (
    // Added overflow-x-hidden here. This clips the background orbs on the sides!
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden font-sans selection:bg-emerald-500/30 flex flex-col">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Background Orbs */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-teal-800/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto p-6 pt-28 mb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            AI Crop <span className="text-emerald-400">Advisor</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Powered by Gemini and Pinecone Vector Search. Ask questions about treatments, crop management, and disease prevention based on scientific literature.
          </p>
        </div>

        {/* The Glassmorphic Chatbot */}
        <div className="w-full">
          <Chatbot />
        </div>
      </main>

    </div>
  );
}