"use client";

import { motion } from "framer-motion";

export default function CodeCanvasTitle() {
  return (
    <div className="relative w-full flex items-center justify-center bg-black py-28 overflow-hidden group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Top Decorative Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/40" />
          <span className="text-white/40 text-xs font-mono tracking-[0.5em] uppercase">
            Visualizing Algorithms
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/40" />
        </div>

        {/* Main Brand Section */}
        <h1 className="flex flex-col md:flex-row items-center gap-8 text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tight">
          
          {/* Animated Logo Container */}
          <div className="relative">
            <div className="
              text-white border-[1.5px] border-white 
              w-20 h-20 md:w-24 md:h-24 
              flex items-center justify-center rounded-full 
              rotate-[-10deg] 
              
              /* Hover Animations */
              group-hover:rotate-0 
              group-hover:scale-110 
              group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] 
              group-hover:border-white/100
              border-white/60
              
              transition-all duration-500 ease-out
            ">
              <motion.span 
                whileHover={{ scale: 1.2 }}
                className="text-4xl md:text-5xl font-bold select-none"
              >
                Σ
              </motion.span>
            </div>
            
            {/* Optional: Subtle external pulse ring on hover */}
            <div className="absolute inset-0 rounded-full border border-white/0 group-hover:animate-ping group-hover:border-white/20 transition-all duration-500" />
          </div>

          {/* Styled Text */}
          <span className="bg-gradient-to-r from-white via-white/80 to-white/20 bg-clip-text text-transparent uppercase italic">
            Code<span className="font-light">Canvas</span>
          </span>
        </h1>
        
        {/* Bottom Shimmer Line */}
        <motion.div 
          animate={{ x: [-150, 150], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="h-[1px] w-full max-w-xl bg-gradient-to-r from-transparent via-white/40 to-transparent mt-12"
        />
      </motion.div>

      {/* Background Decorative Element */}
      <div className="absolute inset-0 opacity-5 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
    </div>
  );
}