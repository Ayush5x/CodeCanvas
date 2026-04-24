import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  BarChart3,
  GitBranch,
  Network,
  ArrowRightLeft,
  Zap,
  Target,
  Binary,
  TreeDeciduous,
  Route,
} from "lucide-react";

const visualizerCategories = [
  {
    title: "Sorting Algorithms",
    description: "Visual exploration of sorting techniques",
    items: [
      { icon: BarChart3, title: "Bubble Sort", href: "/dsa/sorting" },
      { icon: ArrowRightLeft, title: "Merge Sort", href: "/dsa/sorting" },
      { icon: Zap, title: "Quick Sort", href: "/dsa/sorting" },
    ],
  },
  {
    title: "Pathfinding",
    description: "Navigate through complex graphs",
    items: [
      { icon: Route, title: "Dijkstra's Algorithm", href: "/dsa/pathfinding" },
      { icon: Target, title: "A* Search", href: "/dsa/pathfinding" },
      { icon: Binary, title: "BFS Pathfinding", href: "/dsa/pathfinding" },
    ],
  },
  {
    title: "Graph Traversal",
    description: "Explore graph structures visually",
    items: [
      { icon: Network, title: "BFS Traversal", href: "/dsa/graphs/bfs" },
      { icon: TreeDeciduous, title: "DFS Traversal", href: "/dsa/graphs/dfs" },
      { icon: GitBranch, title: "Topological Sort", href: "/dsa/graphs/dijkstra" },
    ],
  },
];

const navLinks = [
  { name: "Activity", href: "/activity", external: false },
  { name: "Documentation", href: "/docs/index.html", external: true },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.03 },
    },
    exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .nav-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        button:focus, a:focus { outline: none !important; }
      `}} />

      <header 
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500" 
        style={{ padding: scrolled && !isOpen ? "12px 12px 0" : "0" }}
      >
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`mx-auto transition-all duration-700 ease-in-out relative z-[130] ${
            scrolled && !isOpen
              ? "max-w-[95%] lg:max-w-[900px] nav-blur rounded-3xl lg:rounded-full border border-white/10 bg-neutral-900/80 shadow-2xl" 
              : "max-w-full bg-transparent border-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* BRAND LOGO */}
            <Link to="/" className="relative z-[140] flex items-center gap-4 group w-fit">
              <div className="text-white border-[1.5px] border-white w-10 h-10 flex items-center justify-center rounded-full rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                <span className="text-lg font-bold">Σ</span>
              </div>
              <div className="hidden sm:flex flex-col leading-[0.8]">
                <span className="text-white text-xl font-extrabold tracking-tighter uppercase">CODE</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-t from-white/10 to-white/60 tracking-[0.15em] font-light uppercase text-[10px] ml-0.5">Canvas</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                  Visualizers
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-[600px] p-4 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {visualizerCategories.map((category) => (
                          <div key={category.title} className="space-y-2">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-2">{category.title}</h3>
                            {category.items.map((item) => (
                              <Link 
                                key={item.title} 
                                to={item.href}
                                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
                              >
                                <item.icon className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                                <span className="text-sm text-neutral-300 group-hover:text-white">{item.title}</span>
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                link.external ? (
                  <a key={link.name} href={link.href} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                ) : (
                  <Link key={link.name} to={link.href} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3 relative z-[150]">
              <Link to="/dsa" className="hidden sm:block bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors">
                Start Visualizing
              </Link>
              
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="lg:hidden p-3 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.nav>

        {/* MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black lg:hidden overflow-y-auto nav-blur"
              style={{ backgroundColor: 'rgba(0,0,0,0.98)' }}
            >
              <div className="min-h-screen px-6 pt-24 pb-12">
                <div className="space-y-10 max-w-lg mx-auto">
                  
                  {/* Visualizers Section */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-4 px-2">
                      <div className="h-[1px] flex-1 bg-white/10" />
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Execution Modules</h3>
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {visualizerCategories.map((category) => (
                        <div key={category.title} className="space-y-3">
                          <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest px-2">{category.title}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {category.items.map((item) => (
                              <Link 
                                key={item.title} 
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                    <item.icon className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">{item.title}</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-neutral-600 -rotate-90 group-hover:text-white" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portal Links */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 px-2">
                      <div className="h-[1px] flex-1 bg-white/10" />
                      <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Portal Links</h3>
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {navLinks.map((link) => (
                        link.external ? (
                          <a 
                            key={link.name} 
                            href={link.href} 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-neutral-300 hover:bg-white hover:text-black transition-all"
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link 
                            key={link.name} 
                            to={link.href} 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-neutral-300 hover:bg-white hover:text-black transition-all"
                          >
                            {link.name}
                          </Link>
                        )
                      ))}
                      <Link 
                        to="/dsa" 
                        onClick={() => setIsOpen(false)}
                        className="col-span-2 flex items-center justify-center gap-2 p-5 rounded-2xl bg-white text-black text-sm font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/10"
                      >
                        Launch Engine <ArrowRightLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* System Status Footer */}
                  <div className="text-center pt-8 pb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">System Status: Optimal</span>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}