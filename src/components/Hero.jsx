import { motion } from 'framer-motion'
import { Play, Code } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import '../index.css'

export default function Hero() {

  const navigate = useNavigate()

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 lg:pt-20">
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >

          {/* Badge - Optimized for Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50 mb-8 lg:mb-12 hover:bg-zinc-800 transition-colors cursor-default"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-widest">Engine Stable: 50+ Modules</span>
          </motion.div>

          {/* Heading - Improved Scaling */}
          <h1 className="hero-font text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-8 lg:mb-10" >
            <span className="text-white">Visualize</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Data Structures</span>
            <br />
            <span className="text-zinc-600">& Algorithms</span>
          </h1>

          {/* Subtitle - Better alignment & width */}
          <p className="text-sm sm:text-lg text-zinc-500 max-w-xl mx-auto mb-10 lg:mb-14 leading-relaxed font-light">
            Master complex algorithms through high-fidelity, 
            <br className="hidden sm:block" />
            interactive visualizations. Build intuition, not just memory.
          </p>

          {/* Buttons - Mobile Stacking */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
            
            <motion.button
              onClick={() => navigate("/dsa")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all duration-300 shadow-xl shadow-white/5"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Visualizer
            </motion.button>

            <motion.a
              href="/docs/index.html"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 px-8 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 text-white hover:bg-zinc-800 transition-all duration-300"
            >
              <Code className="w-4 h-4" />
              Read Documentation
            </motion.a>

          </div>

        </motion.div>
      </div>
    </section>
  )
}