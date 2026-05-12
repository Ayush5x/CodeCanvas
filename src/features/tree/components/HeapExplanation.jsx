import React from 'react';
import { motion } from 'framer-motion';
import { FaTerminal, FaLayerGroup, FaMemory, FaCodeBranch, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

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

const HeapDocumentation = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- HEADER LOGO AREA --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={terminalHeaderStyle}
      >
        <FaTerminal style={{ color: '#fff' }} />
        <span>KERNEL_DOCUMENTATION // HEAP_V2_STABLE</span>
      </motion.div>

      <div style={gridContainer}>
        
        {/* --- COLUMN 1: THE CORE THEORY --- */}
        <div style={columnStyle}>
          <SectionWrapper delay={0.1}>
            <h4 style={subHeaderStyle}><FaInfoCircle style={iconStyle}/> 01_CORE_CONCEPT</h4>
            <p style={textStyle}>
              A Heap is a <strong style={{color: '#fff'}}>Complete Binary Tree</strong> mapped directly to a flat array. 
              Unlike a BST, it doesn't care about left-to-right order—it only enforces 
              <strong style={{color: '#fff'}}> Vertical Priority</strong>.
            </p>
            <div style={badgeContainer}>
              <div style={typeBadge}>MAX: ROOT ≥ CHILDREN</div>
              <div style={typeBadge}>MIN: ROOT ≤ CHILDREN</div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.3}>
            <h4 style={subHeaderStyle}><FaMemory style={iconStyle}/> 02_MEMORY_MAPPING</h4>
            <div style={codeBlock}>
              <div style={codeLine}><span style={codeDim}>INDEX_i</span></div>
              <div style={codeLine}>LEFT_CHILD: <span style={{color: '#fff'}}>2i + 1</span></div>
              <div style={codeLine}>RIGHT_CHILD: <span style={{color: '#fff'}}>2i + 2</span></div>
              <div style={codeLine}>PARENT_NODE: <span style={{color: '#fff'}}>floor((i-1)/2)</span></div>
            </div>
          </SectionWrapper>
        </div>

        {/* --- COLUMN 2: OPERATIONS & LOGIC --- */}
        <div style={columnStyle}>
          <SectionWrapper delay={0.2}>
            <h4 style={subHeaderStyle}><FaCodeBranch style={iconStyle}/> 03_SYSTEM_LOGIC</h4>
            <div style={stepBox}>
              <span style={stepNum}>P1</span>
              <div>
                <strong style={{fontSize: '0.7rem', color: '#fff'}}>BUBBLE_UP (Insertion)</strong>
                <p style={{...textStyle, margin: 0, fontSize: '0.75rem'}}>New data is added at the end and "swapped" upward until hierarchy is satisfied.</p>
              </div>
            </div>
            <div style={stepBox}>
              <span style={stepNum}>P2</span>
              <div>
                <strong style={{fontSize: '0.7rem', color: '#fff'}}>SINK_DOWN (Extraction)</strong>
                <p style={{...textStyle, margin: 0, fontSize: '0.75rem'}}>Root is replaced by the last element, which "sinks" to its correct rank.</p>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper delay={0.4}>
            <h4 style={subHeaderStyle}><FaShieldAlt style={iconStyle}/> 04_EFFICIENCY_METRICS</h4>
            <div style={metricsGrid}>
              <div style={metricItem}>
                <span style={metricLabel}>PEEK</span>
                <span style={metricVal}>O(1)</span>
              </div>
              <div style={metricItem}>
                <span style={metricLabel}>INSERT</span>
                <span style={metricVal}>O(log N)</span>
              </div>
              <div style={metricItem}>
                <span style={metricLabel}>SPACE</span>
                <span style={metricVal}>O(N)</span>
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
        {['PRIORITY_QUEUES', 'DIJKSTRA_CORE', 'HEAP_SORT', 'SYSTEM_SCHEDULING'].map(tag => (
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

const badgeContainer = { display: 'flex', gap: '10px' };

const typeBadge = {
  flex: 1,
  padding: '10px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: '0.65rem',
  fontFamily: "'JetBrains Mono'",
  textAlign: 'center',
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
  height: 'fit-content'
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

export default HeapDocumentation;