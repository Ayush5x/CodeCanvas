import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Layers, Circle, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "../hooks/use-mobile";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const navRef = useRef(null);
  
  const isActive = isOpen || isNavHovered;

  // Handle click outside to close on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, isMobile]);

  const triggerButtonStyle = {
    position: "fixed",
    bottom: isMobile ? "25px" : "20px",
    left: "50%",
    transform: `translateX(-50%) scale(${isActive ? 0 : 1})`,
    width: isMobile ? "50px" : "45px",
    height: isMobile ? "50px" : "45px",
    backgroundColor: "rgb(0, 0, 0)",
    backdropFilter: "blur(12px)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    zIndex: 2147483647,
    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    opacity: isActive ? 0 : 1,
    pointerEvents: isActive ? "none" : "auto",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    WebkitTapHighlightColor: "transparent"
  };

  const navStyle = {
    position: "fixed",
    bottom: isMobile ? "25px" : "20px", 
    left: "50%",
    transform: `translateX(-50%) scale(${isActive ? 1 : 0.4})`,
    height: isMobile ? "65px" : "60px",
    width: isActive ? (isMobile ? "240px" : "260px") : "45px", 
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: "0 10px",
    zIndex: 2147483646,
    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
    backgroundColor: "rgba(10, 10, 10, 0.8)",
    backdropFilter: "blur(24px)",
    borderRadius: "50px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    opacity: isActive ? 1 : 0,
    pointerEvents: isActive ? "auto" : "none",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    WebkitTapHighlightColor: "transparent"
  };

  return (
    <div ref={navRef}>
      {/* Trigger Button */}
      <div 
        style={triggerButtonStyle} 
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onClick={() => isMobile && setIsOpen(true)}
      >
        <Circle color="white" size={isMobile ? 24 : 20} />
      </div>

      <nav 
        style={navStyle}
        onMouseEnter={() => !isMobile && setIsNavHovered(true)}
        onMouseLeave={() => {
          if (!isMobile) {
            setIsNavHovered(false);
            setIsOpen(false);
          }
        }}
      >
        <NavItem 
          to="/" 
          icon={<Home size={isMobile ? 26 : 24} />} 
          isParentHovered={isActive} 
          onClick={() => isMobile && setIsOpen(false)}
        />
        <a 
          href="/docs/index.html"
          style={{ textDecoration: 'none' }}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <NavItem 
            icon={<Layers size={isMobile ? 26 : 24} />} 
            isParentHovered={isActive} 
          />
        </a>
        
        <div onClick={() => {
          navigate(-1);
          if (isMobile) setIsOpen(false);
        }} style={{ cursor: "pointer" }}>
          <NavItem 
            icon={<ChevronLeft size={isMobile ? 26 : 24} />} 
            isParentHovered={isActive} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, isParentHovered, onClick }) {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: isMobile ? "45px" : "40px",
    height: isMobile ? "45px" : "40px",
    borderRadius: "50%",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    color: hover ? "#fff" : isParentHovered ? "#eee" : "#888",
    backgroundColor: hover ? "rgba(255, 255, 255, 0.15)" : "transparent",
    transform: hover ? "scale(1.15)" : "scale(1)",
    WebkitTapHighlightColor: "transparent"
  };

  const content = (
    <div 
      style={itemStyle}
      onMouseEnter={() => !isMobile && setHover(true)}
      onMouseLeave={() => !isMobile && setHover(false)}
      onClick={onClick}
    >
      {icon}
    </div>
  );

  return to ? (
    <Link to={to} style={{ textDecoration: "none" }} onClick={onClick}>
      {content}
    </Link>
  ) : (
    content
  );
}