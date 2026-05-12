import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Database,
  Cpu,
  ChevronRight,
  ArrowDown,
  Zap,
  Layers,
  Code2,
  Telescope,
  Github,
  Mail,
  Box,
  FastForward,
  ShieldCheck,
  Eye
} from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import AyushFace from "../images/Ayush_Face_CC.jpeg";
import TusharFace from "../images/Tushar_Sahoo_CC.jpeg";
import SairamFace from '../images/Sairam_Face_CC.png';
import Navbar from "../../../components/Navbar";

const TRIO_FILES = [
  {
    id: "catalyst",
    name: "Designer .01",
    aka: "The Catalyst",
    quote: "THE SYSTEM ISN'T BROKEN. IT'S JUST AWAITING REWRITING.",
    metrics: { harmony: "99.1%", logic: "95.5%", chaos: "35.0%" },
    face: AyushFace,
    dialogue:
      "Member A is the visual core of CodeCanvas. They transform recursive logic into elegant, monochromatic interfaces, ensuring the mathematical soul is never hidden.",
  },
  {
    id: "protocol",
    name: "Logic.02",
    aka: "The Protocol",
    quote: "I CONVERT CHAOTIC HUMAN INTENTION INTO PURE DIGITAL STABILITY.",
    metrics: { harmony: "94.2%", logic: "99.9%", chaos: "10.0%" },
    face: TusharFace,
    dialogue:
      "Member B handles the kernel feed and data synchronization. They are obsessed with performance optimization, relentlessly stripping away frame drops.",
  },
  {
    id: "synthesis",
    name: "Master.03",
    aka: "The Synthesis",
    quote: "WE ARE THE INFLECTION POINT WHERE CREATIVITY BECOMES SYSTEMATIC.",
    metrics: { harmony: "97.5%", logic: "92.0%", chaos: "65.0%" },
    face: SairamFace,
    dialogue:
      "Member C is the thread integrator. They manage the state between the infinite perspective visualizer and the raw data stream for total harmony.",
  },
];

const panelVariants = {
  hidden: { opacity: 0, scale: 0.8, filter: "brightness(5)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "brightness(1)",
    transition: { type: "spring", stiffness: 120, damping: 15, duration: 0.8 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring", stiffness: 200 },
  }),
};


const FullMangaTrio = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="min-h-screen bg-[#000] text-[#F0F0F0] mt-10 p-4 md:p-6 relative selection:bg-white selection:text-black overflow-x-hidden">
      <Navbar />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=JetBrains+Mono:wght@400;700;800&family=Space+Grotesk:wght@400;900&display=swap');
        .anime-font { font-family: 'Bangers', cursive; }
        .code-font { font-family: 'JetBrains Mono', monospace; }
        .dashboard-font { font-family: 'Space Grotesk', sans-serif; }

        .screentone { 
          background-image: radial-gradient(#1a1a1a 1px, transparent 1px); 
          background-size: 6px 6px; 
          position: fixed; 
          inset: 0; 
          z-index: 0; 
        }

        .manga-panel {
          position: relative; background: #0d0d0d; border: 3px solid #fff;
          border-radius: 0.75rem; box-shadow: 8px 8px 0px #1a1a1a; overflow: hidden;
        }
      `}</style>

      <div className="screentone" />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[100]" style={{ scaleX }} />

      <div className="max-w-[1200px] mx-auto relative z-10 space-y-24 dashboard-font">
        
        {/* HEADER */}
        <header className="pt-10 border-b border-white/10 pb-6">
            <h2 className="code-font text-[10px] tracking-[0.4em] text-zinc-600 uppercase mb-2">Project_Archive // Visualizer_V1</h2>
            <h1 className="anime-font text-[12vw] md:text-[8vw] leading-none text-white tracking-tighter uppercase">
              ABOUT <span className="text-cyan-500 italic">CODECANVAS</span>
            </h1>
        </header>


        {TRIO_FILES.map((member, index) => {
          const isEven = index % 2 === 0;
          return (
            <section
              key={member.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
               <div className="md:col-span-5 relative group">
                           <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                           <img 
                             src={member.face} 
                             alt={member.name} 
                             className="w-full grayscale contrast-125 border border-white/10 rounded-lg filter sepia-[0.2]"
                           />
                        </div>
                        <div className="md:col-span-7 space-y-6">
                          <h2 className="text-white text-3xl font-bold tracking-tight">{member.name} </h2>
                          <p className="code-font text-xs text-cyan-500 uppercase tracking-widest font-bold">Software Developer // CS Student</p>
                          <p className="text-sm leading-relaxed">
                            I specialize in building tools that simplify the complex. My passion lies at the intersection 
                            of <span className="text-white">Data Structures</span>, <span className="text-white">Algorithmic Efficiency</span>, 
                            and high-fidelity <span className="text-white">UI/UX Design</span>.
                          </p>
                          <div className="flex gap-4 pt-4">
                             <button className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-1 hover:text-white hover:border-white transition-all uppercase tracking-widest">
                               Resume <ArrowUpRight size={14}/>
                             </button>
                             <button className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-1 hover:text-white hover:border-white transition-all uppercase tracking-widest">
                               LinkedIn <ArrowUpRight size={14}/>
                             </button>
                          </div>
                        </div>
            </section>
          );
        })}

        {/* WEBSITE FEATURES SECTION */}
        <section className="py-20 bg-[#050505] border-y border-white/10 px-6 rounded-3xl">
          <div className="flex flex-col items-center mb-16 text-center">
            <Box className="text-cyan-500 mb-4" size={40} />
            <h2 className="anime-font text-5xl uppercase tracking-tighter">System_Blueprint</h2>
            <p className="code-font text-xs text-zinc-500 mt-2 tracking-widest uppercase">High Performance Logic Visualization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FastForward size={20} />, title: "Time-Travel", desc: "Step through algorithms forward and backward to isolate every logic shift." },
              { icon: <Eye size={20} />, title: "Live Tracing", desc: "Watch Linked Lists and Trees balance with real-time state change highlights." },
              { icon: <Layers size={20} />, title: "Glass UI", desc: "A sleek, distraction-free interface built with modern liquid glassmorphism." },
              { icon: <ShieldCheck size={20} />, title: "S-Rank Safety", desc: "Built with Cyber Law standards in mind for ethical, secure data handling." }
            ].map((feat, i) => (
              <div key={i} className="p-6 border border-white/5 bg-black/50 hover:border-white/40 transition-colors rounded-lg group">
                <div className="text-white mb-4 group-hover:text-cyan-500 transition-colors">{feat.icon}</div>
                <h3 className="code-font font-bold text-sm uppercase mb-2 tracking-tight">{feat.title}</h3>
                <p className="code-font text-[11px] text-zinc-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

 <section className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-40 items-center">
          <div className="md:col-span-5 relative group">
             <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <img 
               src={SairamFace} 
               alt="Sairam Nayak" 
               className="w-full grayscale contrast-125 border border-white/10 rounded-lg filter sepia-[0.2]"
             />
          </div>
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-white text-3xl font-bold tracking-tight">Sairam Nayak</h2>
            <p className="code-font text-xs text-cyan-500 uppercase tracking-widest font-bold">Software Developer // CS Student</p>
            <p className="text-sm leading-relaxed">
              I specialize in building tools that simplify the complex. My passion lies at the intersection 
              of <span className="text-white">Data Structures</span>, <span className="text-white">Algorithmic Efficiency</span>, 
              and high-fidelity <span className="text-white">UI/UX Design</span>.
            </p>
            <div className="flex gap-4 pt-4">
               <button className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-1 hover:text-white hover:border-white transition-all uppercase tracking-widest">
                 Resume <ArrowUpRight size={14}/>
               </button>
               <button className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-1 hover:text-white hover:border-white transition-all uppercase tracking-widest">
                 LinkedIn <ArrowUpRight size={14}/>
               </button>
            </div>
          </div>
        </section>

        {/* FUTURE SCOPE SECTION */}
        <section className="py-10">
          <div className="flex items-center gap-4 mb-10">
            <Telescope className="text-white" size={32} />
            <h2 className="anime-font text-5xl uppercase tracking-tighter italic">Protocol_Horizon</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border-2 border-white p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-white text-black px-2 py-1 code-font text-[10px] font-bold italic">PHASE_02</div>
               <h3 className="anime-font text-3xl mb-3">AI Diagnostic Integration</h3>
               <p className="code-font text-sm text-zinc-400">Implementing real-time AI logic analysis to predict time complexity bottlenecks as you build your own custom data structures within the canvas.</p>
            </div>
            <div className="border-2 border-white p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-white text-black px-2 py-1 code-font text-[10px] font-bold italic">PHASE_03</div>
               <h3 className="anime-font text-3xl mb-3">Spatial VR Debugging</h3>
               <p className="code-font text-sm text-zinc-400">Expanding beyond 2D to support multi-dimensional structure visualization using WebXR, allowing developers to literally walk through their code logic.</p>
            </div>
          </div>
        </section>

        {/* CONTACT & FOOTER */}
        <footer className="pb-20 border-t-2 border-white pt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-md">
                <h3 className="anime-font text-4xl mb-2">Ready to initialize?</h3>
                <p className="code-font text-xs text-zinc-500">Currently seeking collaborations and opportunities at teams like Namekart. Let's build the future of visual engineering.</p>
            </div>
            <div className="flex gap-4">
               <button className="flex items-center gap-2 border-2 border-white px-6 py-3 anime-font text-xl uppercase hover:bg-white hover:text-black transition-all">
                 <Github size={18}/> Repository
               </button>
               <button className="flex items-center gap-2 bg-white text-black px-6 py-3 anime-font text-xl uppercase hover:scale-105 transition-transform">
                 <Mail size={18}/> Contact
               </button>
            </div>
          </div>
          <p className="mt-20 code-font text-[9px] text-zinc-700 tracking-[0.5em] uppercase text-center">Built by Sairam Nayak // System Version 1.0.42</p>
        </footer>

      </div>
    </div>
  );
};

export default FullMangaTrio;