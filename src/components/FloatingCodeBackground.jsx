import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FloatingCodeBackground = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const symbols = ['{ }', '</>', '[]', '()', ';', '=>', '||', '&&', '!=', '01'];
    const newElements = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -20,
    }));
    setElements(newElements);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#040404',
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20%', left: '30%',
        width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
      }}></div>

      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: `${el.y}vh`, x: `${el.x}vw`, opacity: 0, rotate: 0 }}
          animate={{ 
            y: [`${el.y}vh`, `${el.y - 30}vh`],
            opacity: [0, 0.15, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            color: '#FFFFFF',
            fontSize: `${el.size}px`,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            textShadow: '0 0 10px rgba(255,255,255,0.2)'
          }}
        >
          {el.symbol}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCodeBackground;
