"use client";

import { motion } from 'framer-motion'
import { Play, Code, GitCompare } from 'lucide-react'

const features = [
  {
    icon: Play,
    title: 'Real-time Visualization',
    description: 'Watch algorithms come to life with smooth, step-by-step animations that help you understand every operation.',
  },
  {
    icon: Code,
    title: 'Code Walkthrough',
    description: 'Follow along with highlighted code as it executes, connecting visual representations to actual implementation.',
  },
  {
    icon: GitCompare,
    title: 'Compare Algorithms',
    description: 'Run multiple algorithms side by side to understand their performance differences and trade-offs.',
  },
]

export default function Features() {
  return (
    <section className="py-16 lg:py-24 px-6 sm:px-8 lg:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-20"
        >
          {/* Brand-styled Header */}
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <h2 className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter">
              {/* Sigma Logo */}
              <motion.span 
                initial={{ rotate: -20, scale: 0.8 }}
                whileInView={{ rotate: -10, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-white border-[1.5px] border-white w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full text-xl sm:text-2xl"
              >
                Σ
              </motion.span>

              {/* Styled Text */}
              <span className="bg-gradient-to-r from-white via-white/80 to-white/20 bg-clip-text text-transparent uppercase italic">
                Why Code<span className="font-light">Canvas</span>?
              </span>
            </h2>
          </div>

          <p className="text-zinc-500 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Built for learners who want to truly understand how algorithms work, <br className="hidden sm:block"/>
            not just memorize them. Step into the engine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-zinc-900/20 rounded-[2rem] p-8 lg:p-10 border border-white/5 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer relative overflow-hidden backdrop-blur-sm"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors duration-500">
                    <IconComponent className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}