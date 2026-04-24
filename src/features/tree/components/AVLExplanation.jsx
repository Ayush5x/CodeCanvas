import React from 'react';
import { motion } from 'framer-motion';
import { FaTerminal, FaSync, FaExclamationTriangle, FaCodeBranch, FaInfoCircle, FaBalanceScale } from 'react-icons/fa';

/* ================= THEMED COMPONENTS ================= */

const SectionWrapper = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    style={sectionCardStyle}
  >
    {children}
  </motion.div>
);

const AVLDocumentation = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- HEADER LOGO AREA --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={terminalHeaderStyle}
      >
        <FaTerminal style={{ color: '#fff' }} />
        <span>SYSTEM_DOCUMENTATION // AVL_BALANCE_CORE_v1.2</span>
      </motion.div>

      <div style={gridContainer}>
        
        {/* --- COLUMN 1: THE CORE THEORY --- */}
        <div style={columnStyle}>
          <SectionWrapper delay={0.1}>
            <h4 style={subHeaderStyle}><FaInfoCircle style={iconStyle}/> 01_DEFINITION</h4>
            <p style={textStyle}>
              An AVL tree is a <strong style={{color: '#fff'}}>Self-Balancing Binary Search Tree</strong>. 
              It ensures that the heights of two child subtrees of any node differ by 
              <strong style={{color: '#fff'}}> at most one</strong>.
            </p>
            <div style={badgeContainer}>
              <div style={typeBadge}>STRICT_LOG(N)_EFFICIENCY</div>
              <div style={typeBadge}>AUTO_ROTATION_PROTOCOL</div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.3}>
            <h4 style={subHeaderStyle}><FaExclamationTriangle style={iconStyle}/> 02_BALANCE_FACTOR</h4>
            <div style={codeBlock}>
              <div style={codeLine}><span style={codeDim}>// Calculated for every node (N)</span></div>
              <div style={codeLine}>BF(N) = <span style={{color: '#fff'}}>Height(Left) - Height(Right)</span></div>
              <div style={{...codeLine, marginTop: '10px'}}>
                <span style={codeDim}>VALID_STATE:</span> <span style={{color: '#fff'}}>{'{ -1, 0, 1 }'}</span>
              </div>
              <div style={codeLine}>
                <span style={codeDim}>CRITICAL_STATE:</span> <span style={{color: '#fff'}}>{'|BF| > 1'}</span>
              </div>
            </div>
          </SectionWrapper>
        </div>

        {/* --- COLUMN 2: ROTATION LOGIC --- */}
        <div style={columnStyle}>
          <SectionWrapper delay={0.2}>
            <h4 style={subHeaderStyle}><FaSync style={iconStyle}/> 03_REBALANCING_ROTATIONS</h4>
            <div style={stepBox}>
              <span style={stepNum}>LL / RR</span>
              <div>
                <strong style={{fontSize: '0.7rem', color: '#fff'}}>SINGLE_ROTATION</strong>
                <p style={{...textStyle, margin: 0, fontSize: '0.75rem'}}>Used when a node is heavy on one side in a straight line.</p>
              </div>
            </div>
            <div style={stepBox}>
              <span style={stepNum}>LR / RL</span>
              <div>
                <strong style={{fontSize: '0.7rem', color: '#fff'}}>DOUBLE_ROTATION</strong>
                <p style={{...textStyle, margin: 0, fontSize: '0.75rem'}}>A two-step process to fix "zigzag" imbalances.</p>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.4}>
            <h4 style={subHeaderStyle}><FaBalanceScale style={iconStyle}/> 04_PERFORMANCE_LOG</h4>
            <div style={metricsGrid}>
              <div style={metricItem}>
                <span style={metricLabel}>SEARCH</span>
                <span style={metricVal}>O(log N)</span>
              </div>
              <div style={metricItem}>
                <span style={metricLabel}>INSERT</span>
                <span style={metricVal}>O(log N)</span>
              </div>
              <div style={metricItem}>
                <span style={metricLabel}>DELETE</span>
                <span style={metricVal}>O(log N)</span>
              </div>
            </div>
          </SectionWrapper>
        </div>

      </div>

      {/* --- STATIC FOOTER TAGS --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={footerStyle}
      >
        {['DATABASE_INDEXING', 'MEMORY_MAPPING', 'REALTIME_LOOKUP', 'HIGH_STABILITY_SYSTEMS'].map(tag => (
          <span key={tag} style={tagStyle}>// {tag}</span>
        ))}
      </motion.div>
    </div>
  );
};

/* --- STYLES (MONOCHROME INSANE LEVEL) --- */

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '20px',
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const terminalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.7rem',
  color: 'rgba(255,255,255,0.3)',
  letterSpacing: '3px',
  marginBottom: '30px',
  paddingLeft: '10px',
  borderLeft: '2px solid #fff'
};

const sectionCardStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '20px',
  padding: '30px',
  backdropFilter: 'blur(10px)',
};

const subHeaderStyle = {
  fontSize: '0.75rem',
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '2px',
  color: 'rgba(255,255,255,0.9)',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = { marginRight: '10px', opacity: 0.4 };

const textStyle = {
  fontSize: '0.85rem',
  lineHeight: '1.7',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '20px',
};

const badgeContainer = { display: 'flex', gap: '10px', flexWrap: 'wrap' };

const typeBadge = {
  padding: '10px 15px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '0.6rem',
  fontFamily: "'JetBrains Mono'",
  color: 'rgba(255,255,255,0.6)'
};

const codeBlock = {
  background: '#050505',
  padding: '20px',
  borderRadius: '12px',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.4)',
  border: '1px solid rgba(255,255,255,0.05)'
};

const codeLine = { marginBottom: '8px' };
const codeDim = { color: 'rgba(255,255,255,0.15)' };

const stepBox = {
  display: 'flex',
  gap: '15px',
  marginBottom: '15px',
  padding: '15px',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.05)'
};

const stepNum = {
  fontSize: '0.6rem',
  background: '#fff',
  color: '#000',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 'bold',
  height: 'fit-content',
  minWidth: '45px',
  textAlign: 'center'
};

const metricsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px'
};

const metricItem = {
  textAlign: 'center',
  padding: '15px 5px',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '10px'
};

const metricLabel = { display: 'block', fontSize: '0.55rem', opacity: 0.3, marginBottom: '5px' };
const metricVal = { display: 'block', fontSize: '1rem', fontWeight: 'bold', fontFamily: "'JetBrains Mono'" };

const footerStyle = {
  marginTop: '40px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  justifyContent: 'center',
  opacity: 0.2
};

const tagStyle = {
  fontSize: '0.65rem',
  fontFamily: "'JetBrains Mono'",
  letterSpacing: '1px'
};

export default AVLDocumentation;