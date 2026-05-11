"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";

export function MaintenanceOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: block scrolling when active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl transition-all duration-500">
      <div className="flex flex-col items-center text-center max-w-xl px-6 relative">
        
        {/* Animated Logo Container */}
        <div className="mb-6 relative w-32 h-32 plane-fly flex items-center justify-center">
           <Image 
             src="/logo-sendora.png" 
             alt="Sendora" 
             width={128} 
             height={128} 
             className="object-contain drop-shadow-xl"
             priority
           />
        </div>

        {/* Animated Title */}
        <div className="slide-right flex flex-col items-center">
           <h1 className="title-font text-5xl md:text-6xl font-extrabold text-[var(--ink)] tracking-tight mb-2">
             Sendora
           </h1>
           <div className="text-[var(--accent)] font-bold tracking-[0.2em] text-sm md:text-base uppercase">
             Automation Suite
           </div>
        </div>

        {/* Animated Description */}
        <div className="fade-up-delay mt-10 p-6 rounded-3xl bg-white/60 border border-[#F0E6D8] shadow-sm flex flex-col items-center">
           <div className="w-12 h-12 rounded-full bg-[#FFF0E0] text-[#9A5034] flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
           </div>
           <h2 className="text-lg font-bold text-[var(--ink)] mb-2">Sedang Dalam Perbaikan</h2>
           <p className="text-slate-500 font-medium leading-relaxed">
             Akan ada perbaikan oleh system kami dan akan kembali lagi dalam waktu yang ditentukan. Terima kasih atas kesabaran Anda.
           </p>
        </div>
        
      </div>
    </div>
  );
}
