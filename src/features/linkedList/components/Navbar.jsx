import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
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
  { name: "Learn", href: "#learn" },
  { name: "Documentation", href: "/docs" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <header className="fixed top-0 left-0 right-0 z-50 p-0 transition-all duration-500" style={{ padding: scrolled ? "16px 16px 0" : "0" }}>
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`mx-auto  transition-all duration-700 ease-in-out ${
            scrolled 
              ? "max-w-[900px] nav-blur rounded-full border border-white/10 bg-neutral-900/80 shadow-2xl" 
              : "max-w-full bg-transparent border-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* BRAND LOGO DESIGN UPDATED */}
            <Link to="/" className="flex items-center gap-4 group w-fit">
              {/* Scaled Sigma Circle */}
              <div className="text-white border-[1.5px] border-white w-10 h-10 flex items-center justify-center rounded-full rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                <span className="text-lg font-bold">Σ</span>
              </div>

              {/* Scaled Split Wordmark */}
              <div className="hidden sm:flex flex-col leading-[0.8]">
                <span className="text-white text-xl font-extrabold tracking-tighter uppercase">
                  CODE
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-t from-white/10 to-white/60 tracking-[0.15em] font-light uppercase text-[10px] ml-0.5">
                  Canvas
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors focus:outline-none">
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
                                className="group flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors focus:outline-none"
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
                  <a key={link.name} href={link.href} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors focus:outline-none">
                    {link.name}
                  </a>
                ) : (
                  <Link key={link.name} to={link.href} className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors focus:outline-none">
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <button onClick={() => setIsDark(!isDark)} className="p-2 text-neutral-400 hover:text-white focus:outline-none">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/dsa" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors focus:outline-none">
                Start Visualizing
              </Link>
              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-neutral-400 focus:outline-none">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-white/5 px-6 pb-6 pt-2"
              >
                {navLinks.map((link) => (
                  link.external ? (
                    <a key={link.name} href={link.href} className="block text-lg text-neutral-400 py-3 hover:text-white">
                      {link.name}
                    </a>
                  ) : (
                    <Link key={link.name} to={link.href} className="block text-lg text-neutral-400 py-3 hover:text-white">
                      {link.name}
                    </Link>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </header>
    </>
  );
}