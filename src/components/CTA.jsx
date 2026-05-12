import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from "react-router-dom";


export default function CTA() {
   const navigate = useNavigate()
  return (
    <section className="py-16 lg:py-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-black via-zinc-900 to-black rounded-3xl opacity-50 blur-sm" />
          
          <div className="relative bg-zinc-900/50 border border-white/5 rounded-[2rem] p-10 sm:p-16 text-center overflow-hidden backdrop-blur-xl">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl bg-white/[0.02]" />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-6"
              >
                Ready to master algorithms?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-zinc-500 text-sm sm:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed"
              >
                Join thousands of learners who are building their problem-solving skills with high-fidelity interactive visualizations.
              </motion.p>
              
              <motion.button
                onClick={()=> navigate("/dsa")}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-5 rounded-2xl text-base font-bold inline-flex items-center gap-3 hover:bg-zinc-100 transition-all duration-300 shadow-2xl shadow-white/10"
              >
                Launch Visualizer
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
