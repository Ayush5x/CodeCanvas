import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingCodeBackground from '../../../components/FloatingCodeBackground';
import Navbar from '../../../components/Navbar';
import { useIsMobile } from '../../../hooks/use-mobile';

import {
  FaGithub, FaRocket, FaBook, FaRegLightbulb, FaListUl,
  FaLayerGroup, FaTree, FaProjectDiagram, FaSitemap,
  FaSortNumericDown, FaCode, FaRandom, FaSlidersH, FaSync,
  FaSearch, FaBell, FaTerminal
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/HomePage.css';

import logo from '../../../assets/openverse2.svg';

/* ================= THEME VARIANTS ================= */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 150, damping: 25 }
  }
};

/* ================= CARD COMPONENT ================= */
const Card = ({ title, link, icon, enabled = true, index = 0, complexity = "O(n)" }) => {
  const isMobile = useIsMobile();
  const cardClasses = `homepage-card ${enabled ? 'glass-premium-enabled' : 'glass-premium-disabled'}`;
  
  const memoryAddress = `0x${(index * 14 + 1024).toString(16).toUpperCase()}`;

  const content = (
    <motion.div 
      variants={cardVariant}
      whileHover={enabled && !isMobile ? { 
        y: -8,
        backgroundColor: "rgba(20, 20, 20, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(255,255,255,0.03)"
      } : {}}
      className={cardClasses}
      style={{
        background: "rgba(15, 15, 17, 0.4)", 
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "16px", 
        padding: isMobile ? "1.25rem" : "1.75rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
      }}></div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.55rem", color: "#666", letterSpacing: "2px", fontFamily: "monospace", marginBottom: "4px" }}>
              MEM_{memoryAddress}
            </div>
            {/* Added Complexity Badge for Tech UI Feel */}
            <div style={{ 
              display: "inline-block", padding: "2px 6px", borderRadius: "4px", 
              background: enabled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)", 
              fontSize: "0.65rem", color: enabled ? "#E5E7EB" : "#4B5563", fontFamily: "monospace" 
            }}>
              {complexity}
            </div>
          </div>
          {enabled ? (
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FFF", boxShadow: "0 0 12px #FFF" }} 
            />
          ) : (
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#222", border: "1px solid #333" }} />
          )}
        </div>

        <div style={{ opacity: enabled ? 1 : 0.3, marginBottom: '1.2rem', filter: enabled ? 'drop-shadow(0 0 12px rgba(255,255,255,0.3))' : 'none' }}>
          {icon}
        </div>
        <div className="homepage-card-title-box" style={{ 
          color: enabled ? "#FFFFFF" : "#6B7280", 
          fontWeight: "600", 
          letterSpacing: "0.5px",
          fontSize: isMobile ? "0.9rem" : "1.1rem"
        }}>
          {title}
        </div>
      </div>

      <div className="homepage-learn-more-btn" style={{ 
        color: enabled ? "#9CA3AF" : "#374151", 
        fontSize: "0.75rem", 
        marginTop: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        fontWeight: "bold",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        paddingTop: "1rem"
      }}>
        <span>{enabled ? 'Execute_Module' : 'Access_Denied'}</span>
        {enabled && (
          <motion.span 
            animate={{ x: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="homepage-learn-more-arrow"
            style={{ color: "#FFF" }}
          >
            →
          </motion.span>
        )}
      </div>
    </motion.div>
  );

  if (enabled && link) {
    return (
      <Link 
        to={link} 
        style={{ 
          textDecoration: 'none', 
          display: 'block', 
          outline: 'none', 
          WebkitTapHighlightColor: 'transparent' 
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div style={{ cursor: 'not-allowed', outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
      {content}
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const HomePage = () => {
  const isMobile = useIsMobile();

  /* ===== DATA STRUCTURES (ROUTING UNTOUCHED) ===== */
  const dataStructureCards = [
    { title: 'Pointers', link: '/dsa/pointers', icon: <FaRocket size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(1)" },
    { title: 'Linked Lists', link: '/dsa/linked-list', icon: <FaListUl size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(n)" },
    { title: 'Stacks & Queues', link: '/dsa/stack-queue', icon: <FaLayerGroup size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(1)" },
    { title: 'Trees', link: '/dsa/tree', icon: <FaTree size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(log n)" },
    { title: 'Pathfinding', link: '/dsa/pathfinding', icon: <FaProjectDiagram size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(V+E)" },
    { title: 'Hash Tables', link: '/dsa/hash-table', icon: <FaSitemap size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(1)" },
    { title: 'Graphs', link: '/dsa/graphs', icon: <FaLayerGroup size={isMobile ? 20 : 24} color="#777777" />, enabled: true, complexity: "O(V+E)" }
  ];

  /* ===== ALGORITHMS (ROUTING UNTOUCHED) ===== */
  const algorithmCards = [
    { title: 'DS-2 (ICS 215)', link: '/dsa/ds2', icon: <FaCode size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "VARIOUS" },
    { title: 'Flowcharts', link: '/dsa/flowcharts', icon: <FaProjectDiagram size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "LOGIC" },
    { title: 'Sorting Algorithms', link: '/dsa/sorting', icon: <FaSortNumericDown size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(n log n)" },
    { title: 'Search Algorithms', link: '/dsa/search', icon: <FaRegLightbulb size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(log n)" },
    { title: 'Recursion', link: '/dsa/recursion', icon: <FaSync size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(2^n)" },
    { title: 'Greedy Algorithms', link: '/dsa/greedy', icon: <FaCode size={isMobile ? 20 : 24} color="#FFFFFF" />, enabled: true, complexity: "O(n log n)" },
    { title: 'Randomized Algorithms', icon: <FaRandom size={isMobile ? 20 : 24} color="#444444" />, enabled: false, complexity: "PROB." },
    { title: 'Optimization Algorithms', icon: <FaSlidersH size={isMobile ? 20 : 24} color="#444444" />, enabled: false, complexity: "NP-HARD" }
  ];

  return (
    <div className="homepage" style={{ 
      minHeight: "100vh",
      color: "#FFFFFF",
      position: "relative",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      
      <FloatingCodeBackground />

      {/* ================= NAVBAR SECTION ================= */}
      <div style={{ position: 'relative', zIndex: 50 }}>
        <Navbar />
      </div>

      {/* ================= DASHBOARD HERO SECTION ================= */}
      <section style={{ 
        position: "relative", 
        zIndex: 10, 
        padding: isMobile ? "7rem 1.5rem 3rem" : "8rem 3rem 5rem", 
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "center" : "flex-end",
        textAlign: isMobile ? "center" : "left",
        gap: isMobile ? "2.5rem" : "2rem"
      }}>
        
        <div style={{ maxWidth: isMobile ? "100%" : "650px" }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: isMobile ? "center" : "flex-start",
              gap: "10px", 
              marginBottom: isMobile ? "1.25rem" : "1.5rem" 
            }}
          >
            <FaTerminal color="#6B7280" />
            <span style={{ fontSize: "0.75rem", color: "#6B7280", letterSpacing: "2px", fontWeight: "600" }}>STATION_ACCESS_GRANTED</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ 
              fontSize: isMobile ? "2.25rem" : "clamp(2.5rem, 5vw, 4.5rem)", 
              fontWeight: "200", 
              lineHeight: "1",
              letterSpacing: "-0.04em",
              marginBottom: "1.5rem",
              textTransform: "uppercase"
            }}
          >
            Execution <strong style={{ fontWeight: "800", color: "#FFF" }}>Environment</strong>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ 
              color: "#6B7280", 
              fontSize: isMobile ? "0.9rem" : "1.1rem", 
              lineHeight: "1.6",
              maxWidth: isMobile ? "320px" : "none",
              margin: isMobile ? "0 auto" : "0"
            }}
          >
            Select a structural module or algorithmic visualizer below to initiate sequence. All systems optimal.
          </motion.p>
        </div>

        {/* Dashboard Stats Panel - Redesigned for Mobile */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ 
            display: "flex", 
            gap: isMobile ? "1.5rem" : "2.5rem", 
            background: "rgba(255,255,255,0.03)", 
            padding: isMobile ? "1.25rem 2rem" : "1.75rem 2.5rem", 
            borderRadius: "24px", 
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "center" : "flex-start",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#4B5563", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Nodes</div>
            <div style={{ color: "#FFF", fontSize: isMobile ? "1.25rem" : "1.75rem", fontWeight: "800", fontFamily: "monospace" }}>24</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", margin: "4px 0" }}></div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#4B5563", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Modules</div>
            <div style={{ color: "#FFF", fontSize: isMobile ? "1.25rem" : "1.75rem", fontWeight: "800", fontFamily: "monospace" }}>13</div>
          </div>
        </motion.div>

      </section>

      {/* ================= CARDS MAIN ================= */}
      <main className="homepage-main" style={{ 
        position: "relative", 
        zIndex: 10, 
        padding: isMobile ? "2rem 1.5rem 4rem" : "3rem 3rem 6rem", 
        maxWidth: "1400px", 
        margin: "0 auto" 
      }}>
        <div className="homepage-columns" style={{ gap: isMobile ? "3rem" : "4rem" }}>

          <div className="homepage-column">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isMobile ? 'center' : 'flex-start',
                gap: '12px', 
                marginBottom: '2.5rem' 
              }}
            >
              <div style={{ width: '8px', height: '8px', background: '#FFF', borderRadius: '50%', boxShadow: '0 0 12px rgba(255,255,255,0.5)' }}></div>
              <h2 className="homepage-column-title" style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "4px", margin: 0 }}>
                Data Structures
              </h2>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="homepage-card-grid"
            >
              {dataStructureCards.map((card, i) => (
                <Card key={i} index={i} {...card} />
              ))}
            </motion.div>
          </div>

          {!isMobile && (
            <div className="homepage-divider" style={{ width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)", margin: "0 2rem" }}></div>
          )}

          <div className="homepage-column">
             <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isMobile ? 'center' : 'flex-start',
                gap: '12px', 
                marginBottom: '2.5rem' 
              }}
            >
              <div style={{ width: '8px', height: '8px', background: '#FFF', borderRadius: '50%', boxShadow: '0 0 12px rgba(255,255,255,0.5)' }}></div>
              <h2 className="homepage-column-title" style={{ color: "#9CA3AF", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "4px", margin: 0 }}>
                Algorithms
              </h2>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="homepage-card-grid"
            >
              {algorithmCards.map((card, i) => (
                <Card key={`algo-${i}`} index={i + dataStructureCards.length} {...card} />
              ))}
            </motion.div>
          </div>

        </div>

      </main>

      {/* ================= FOOTER SECTION ================= */}
      <footer style={{ 
        position: "relative", 
        zIndex: 10, 
        padding: "4rem 1.5rem 2rem", 
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
        marginTop: "4rem"
      }}>
        <div style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          justifyContent: "space-between", 
          alignItems: isMobile ? "center" : "flex-start",
          gap: "2.5rem" 
        }}>
          
          {/* Replaced Logo & Wordmark Section */}
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            textDecoration: 'none',
            transition: 'transform 0.3s ease'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            
            {/* Scaled Sigma Circle */}
            <div style={{ 
              color: 'white', 
              border: '1.5px solid white', 
              width: '48px', 
              height: '48px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '50%', 
              transform: 'rotate(-10deg)',
              transition: 'transform 0.5s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-10deg)'}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Σ</span>
            </div>

            {/* Scaled Split Wordmark */}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '0.8' }}>
              <span style={{ 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                tracking: '-0.05em', 
                textTransform: 'uppercase' 
              }}>
                CODE
              </span>
              <span style={{ 
                background: 'linear-gradient(to top, rgba(255,255,255,0.1), rgba(255,255,255,0.6))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.15em', 
                fontWeight: '300', 
                textTransform: 'uppercase', 
                fontSize: '0.875rem',
                marginLeft: '2px'
              }}>
                Canvas
              </span>
            </div>
          </Link>

          {/* Quick Links */}
          <div style={{ display: "flex", gap: "3rem", fontSize: "0.8rem", marginTop: isMobile ? "1rem" : "0.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ color: "#FFF", fontWeight: "600", marginBottom: "0.5rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px" }}>Source</span>
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">GitHub</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ color: "#FFF", fontWeight: "600", marginBottom: "0.5rem", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px" }}>Legal</span>
              <a href="#" className="footer-link">Privacy_Policy</a>
              <a href="#" className="footer-link">Terms_of_Service</a>
            </div>
          </div>

          {/* Copyright & Social */}
          <div style={{ textAlign: isMobile ? "center" : "right" }}>
            <div style={{ display: "flex", gap: "1.5rem", justifyContent: isMobile ? "center" : "flex-end", marginBottom: "1rem" }}>
              <FaGithub size={18} color="#4B5563" cursor="pointer" />
              <FaBell size={18} color="#4B5563" cursor="pointer" />
              <FaSearch size={18} color="#4B5563" cursor="pointer" />
            </div>
            <p style={{ color: "#4B5563", fontSize: "0.7rem", fontFamily: "monospace" }}>
              © 2026 CODECANVAS // ALL_SYSTEMS_GO
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;