import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Database,
  Cpu,
  ChevronRight,
  ArrowDown,
  Layers,
  Telescope,
  Github,
  Mail,
  Box,
  FastForward,
  ShieldCheck,
  Eye
} from "lucide-react";
import AyushFace from "../images/Ayush_Face_CC.jpeg";
import TusharFace from "../images/Tushar_Sahoo_CC.jpeg";
import SairamFace from '../images/Sairam_Face_CC.png';
import Navbar from "../../../components/Navbar";

const TRIO_FILES = [
  {
    id: "Designer .01",
    name: "Ayush Patel",
    aka: "The Catalyst",
    quote: "THE SYSTEM ISN'T BROKEN. IT'S JUST AWAITING REWRITING.",
    metrics: { harmony: "99.1%", logic: "95.5%", chaos: "35.0%" },
    face: AyushFace,
    dialogue:
      "Member A is the visual core of CodeCanvas. They transform recursive logic into elegant, monochromatic interfaces, ensuring the mathematical soul is never hidden.",
  },
  {
    id: "Logic.02",
    name: "Tushar Sahoo",
    aka: "The Protocol",
    quote: "I CONVERT CHAOTIC HUMAN INTENTION INTO PURE DIGITAL STABILITY.",
    metrics: { harmony: "94.2%", logic: "99.9%", chaos: "10.0%" },
    face: TusharFace,
    dialogue:
      "Member B handles the kernel feed and data synchronization. They are obsessed with performance optimization, relentlessly stripping away frame drops.",
  },
  {
    id: "Master.03",
    name: "Sairam Nayak",
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700;800&display=swap');
        
        :root {
          --font-sans: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --text-main: #F0F0F0;
        }

        /* Base Component Classes */
        .dashboard-font { font-family: var(--font-sans); }
        .code-font { font-family: var(--font-mono); }
        
        /* The Specific Header Style Requested */
        .trio-header-main {
          font-family: var(--font-sans);
          font-size: 3.8rem;
          font-weight: 300;
          margin-bottom: 1.5rem;
          color: var(--text-main);
          line-height: 1.1;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .screentone { 
          background-image: radial-gradient(#222 1px, transparent 1px);
          background-size: 4px 4px;
          position: fixed; inset: 0; opacity: 0.2; z-index: 0;
        }

        .manga-panel {
          position: relative; background: #0d0d0d; border: 1px solid #0c0c0c;
          border-radius: 0.75rem; box-shadow: 8px 8px 0px #1a1a1a; overflow: hidden;
        }

        .anime-font { 
          font-family: var(--font-sans); 
          font-weight: 900; 
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="screentone" />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[100]" style={{ scaleX }} />

      <div className="max-w-[1200px] mx-auto relative z-10 space-y-6 md:space-y-10 dashboard-font">
        <header className="relative py-6 px-4 border-b border-white/10 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <motion.div
            initial={{ x: -100, skewX: 20, opacity: 0 }}
            whileInView={{ x: 0, skewX: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="code-font text-[9px] tracking-[0.4em] text-zinc-600 uppercase mb-1">
              Archive_Manifest // Vol_01
            </h2>
            <h1 className="trio-header-main">
              TRIO{" "}
              <span className="text-cyan-500 italic" style={{ fontSize: '0.6em', verticalAlign: 'middle' }}>
                files
              </span>
            </h1>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-3 text-zinc-600 code-font mb-6"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ArrowDown size={12} />
          </motion.div>
        </header>

        {TRIO_FILES.map((member, index) => {
          const isEven = index % 2 === 0;
          return (
            <section
              key={member.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
              <motion.div
                variants={panelVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className={`lg:col-span-5 h-[560px] manga-panel group ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                <motion.img
                  whileHover={{ scale: 1.05, rotate: isEven ? 1 : -1 }}
                  src={member.face}
                  alt={member.name}
                  className={`w-full h-full object-cover grayscale ${index === 0 ? "" : "contrast-125"} border border-white/10 rounded-lg filter sepia-[0.1] group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-500`}
                />
                <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 anime-font text-xl -rotate-6 shadow-[4px_4px_0px_#000]">
                  #{index + 1}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <motion.h3 className="anime-font text-3xl leading-none text-white uppercase">
                    {member.name}
                  </motion.h3>
                  <p className="code-font text-[9px] text-zinc-500 uppercase tracking-[0.3em]">
                    {member.aka}
                  </p>
                </div>
              </motion.div>

              <motion.div className={`lg:col-span-7 space-y-4 md:space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <motion.div
                  initial={{ x: isEven ? 50 : -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-[#0a0a0a] border-2 border-white/20 p-6 rounded-[1rem] relative"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="text-zinc-500 animate-pulse" size={14} />
                    <span className="code-font text-[8px] font-bold uppercase tracking-[0.4em] text-zinc-700">
                      {member.id}
                    </span>
                  </div>
                  <h4 className="text-2xl md:text-2xl mb-6 leading-[0.95] uppercase italic font-black tracking-tighter">
                    {member.quote.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={textVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="inline-block mr-2 hover:text-cyan-600 transition-colors"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </h4>
                  <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                    {Object.entries(member.metrics).map(([key, value]) => (
                      <div key={key}>
                        <p className="code-font text-[7px] text-zinc-700 uppercase font-black tracking-widest">
                          {key}
                        </p>
                        <p className="text-2xl font-black text-white italic leading-none">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-5 bg-[#0d0d0d] border-l-4 border-white relative overflow-hidden group"
                >
                  <div className="flex items-center gap-2 text-zinc-600 mb-2 code-font text-[9px] font-bold uppercase tracking-widest">
                    <ChevronRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
                    Background
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed code-font font-medium">
                    {member.dialogue}
                  </p>
                  <Cpu className="absolute -bottom-2 -right-2 text-zinc-900 opacity-20" size={50} />
                </motion.div>
              </motion.div>
            </section>
          );
        })}

        <section className="py-20 bg-[#050505] border-y border-white/10 px-6 rounded-3xl">
          <div className="flex flex-col items-center mb-16 text-center">
            <Box className="text-cyan-500 mb-4" size={40} />
            <h2 className="text-4xl uppercase font-black tracking-tighter">System_Blueprint</h2>
            <p className="code-font text-xs text-zinc-500 mt-2 tracking-widest uppercase">High Performance Logic Visualization</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FastForward size={20} />, title: "Time-Travel", desc: "Step through algorithms forward and backward." },
              { icon: <Eye size={20} />, title: "Live Tracing", desc: "Watch Linked Lists balance with real-time highlights." },
              { icon: <Layers size={20} />, title: "Glass UI", desc: "Sleek, distraction-free liquid glassmorphism." },
              { icon: <ShieldCheck size={20} />, title: "S-Rank Safety", desc: "Built with Cyber Law standards for ethical data handling." }
            ].map((feat, i) => (
              <div key={i} className="p-6 border border-white/5 bg-black/50 hover:border-white/40 transition-colors rounded-lg group">
                <div className="text-white mb-4 group-hover:text-cyan-500 transition-colors">{feat.icon}</div>
                <h3 className="code-font font-bold text-sm uppercase mb-2">{feat.title}</h3>
                <p className="code-font text-[11px] text-zinc-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10">
          <div className="flex items-center gap-4 mb-10">
            <Telescope className="text-white" size={32} />
            <h2 className="text-[18px] uppercase tracking-tighter italic font-black">Protocol_Horizon</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border-2 border-white p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-white text-black px-2 py-1 code-font text-[10px] font-bold italic">PHASE_02</div>
               <h3 className="text-xl mb-3 font-black uppercase">AI Diagnostic Integration</h3>
               <p className="code-font text-sm text-zinc-400">Predict time complexity bottlenecks as you build custom structures.</p>
            </div>
            <div className="border-2 border-white p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-white text-black px-2 py-1 code-font text-[10px] font-bold italic">PHASE_03</div>
               <h3 className="text-xl mb-3 font-black uppercase">Spatial VR Debugging</h3>
               <p className="code-font text-sm text-zinc-400">Multi-dimensional structure visualization using WebXR support.</p>
            </div>
          </div>
        </section>

        <footer className="pb-20 border-t-2 border-white pt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-md">
                <h3 className="text-xl mb-2 font-black uppercase">Ready to initialize?</h3>
                <p className="code-font text-xs text-zinc-500">Currently seeking collaborations. Let's build the future of visual engineering.</p>
            </div>
            <div className="flex gap-4">
               <button className="flex items-center gap-2 border-2 border-white px-6 py-3 text-[18px] uppercase font-black hover:bg-white hover:text-black transition-all">
                 <Github size={18}/> Repository
               </button>
               <button className="flex items-center gap-2 bg-white text-black px-6 py-3 text-[18px] uppercase font-black hover:scale-105 transition-transform">
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