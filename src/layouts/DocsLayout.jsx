import React from 'react';
import Sidebar from '../components/docs/Sidebar';
import Navbar from '../components/Navbar';
import '../styles/docs.css';

const DocsLayout = ({ children }) => {
  return (
    <div className="docs-container flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="flex pt-20"> {/* Offset for fixed navbar */}
        <Sidebar />
        <main className="main-content flex-1 px-8 py-12 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
