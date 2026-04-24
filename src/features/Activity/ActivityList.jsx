import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Terminal, Fingerprint } from 'lucide-react';
import Navbar from '../../components/Navbar';
const ActivityCard = ({ title, icon, description, type, path }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      whileHover="hover"
      className="relative group w-full max-w-[420px]"
    >
      {/* Sharp Border Glow Effect (White) */}
      <div className="absolute -inset-[1px] bg-white opacity-0 group-hover:opacity-20 blur-sm transition duration-500 rounded-[2rem]" />
      
      {/* Main Glass Card */}
      <div className="relative h-auto sm:h-[480px] rounded-[2rem] border border-white/10 bg-[#0A0A0A]/60 backdrop-blur-3xl overflow-hidden flex flex-col p-6 sm:p-10 justify-between min-h-[400px]">
        
        {/* Moving Shimmer Effect */}
        <motion.div 
          variants={{
            hover: { x: ['-100%', '200%'] }
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full"
        />

        <div>
          <div className="flex justify-between items-center mb-10">
            <div className="p-4 rounded-xl bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {icon}
            </div>
            <span className="text-[10px] tracking-[0.5em] font-bold text-white/30 uppercase">
              {type}
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 tracking-tighter uppercase italic">
            {title}
          </h2>
          
          <p className="text-white/40 text-sm leading-relaxed font-light tracking-wide">
            {description}
          </p>
        </div>

        <div className="relative pt-6 border-t border-white/5">
          <motion.button
            onClick={() => navigate(path)} // Triggers navigation to the Quiz/Test
            whileHover={{ scale: 1.02, backgroundColor: "#ffffff", color: "#000000" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-full border border-white/20 bg-transparent text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
          >
            Enter Simulation
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const MonochromeActivity = () => {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-start p-8 pt-32 overflow-hidden">
      <Navbar></Navbar>
      {/* Minimalist Grid Background */}
      <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Title Header */}
      <motion.div 
        initial={{ opacity: 0, tracking: "1em" }}
        animate={{ opacity: 1, tracking: "1.5em" }}
        transition={{ duration: 1.2 }}
        className="z-10 text-center mb-24"
      >
        <h1 className="text-white  font-black uppercase  border-b border-white/20 pb-8">
          Activity Center
        </h1>
      </motion.div>

      {/* Cards Container */}
      <div className="z-10 flex flex-wrap justify-center gap-12">
        <ActivityCard 
          title="The Quiz"
          type="Recalibration"
          icon={<Terminal size={24} />}
          path="/activity/quiz" // Route for your Quiz folder
          description="A minimalist logic-gate for your DSA knowledge. No distractions, just core algorithmic theory and syntax verification."
        />
        <ActivityCard 
          title="The Test"
          type="Final Eval"
          icon={<Fingerprint size={24} />}
          path="/activity/exam" // Route for your ExamSimulation folder
          description="High-stakes environment. Timed performance metrics and complexity analysis to certify your technical proficiency."
        />
      </div>

      {/* Subtle UI Accents */}
      <div className="absolute bottom-10 left-10 text-[8px] text-white/20 font-mono tracking-widest uppercase">
        Ver_4.0.2 // STABLE_BUILD
      </div>
      <div className="absolute bottom-10 right-10 text-[8px] text-white/20 font-mono tracking-widest uppercase">
        Grid_System_Active
      </div>
    </div>
  );
};

export default MonochromeActivity;