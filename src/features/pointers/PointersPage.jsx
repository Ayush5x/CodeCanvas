import React from 'react';
import PointersVisualizer from './components/PointersVisualizer';
import Navbar from '../linkedList/components/Navbar'
import Header from '../../components/Header';
import { useIsMobile } from '../../hooks/use-mobile';

const PointersPage = () => {
  const isMobile = useIsMobile();

  return (
    <div style={{ 
      padding: isMobile ? "0" : "10px",
      minHeight: "100vh",
      backgroundColor: "#000"
    }}>
      <Header />
      <div style={{ paddingTop: isMobile ? "20px" : "40px" }}>
        <PointersVisualizer />
      </div>
    </div>
  );
};

export default PointersPage;
