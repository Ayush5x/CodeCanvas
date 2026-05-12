import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Mark from '../components/Mark';
import FloatingCodeBackground from '../components/FloatingCodeBackground';

/* ================= MAIN PAGE ================= */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* The animated background */}
      <FloatingCodeBackground />

      {/* Wrapper to ensure content stays above the background z-index */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <Features />
          <CTA />
          <Mark />
        </main>
        <Footer />
      </div>

    </div>
  );
}