import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Github,
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
      {
        icon: BarChart3,
        title: "Bubble Sort",
        description: "Simple comparison-...",
      },
      {
        icon: ArrowRightLeft,
        title: "Merge Sort",
        description: "Divide and conquer...",
      },
      {
        icon: Zap,
        title: "Quick Sort",
        description: "Efficient partition-...",
      },
    ],
  },
  {
    title: "Pathfinding",
    description: "Navigate through complex graphs",
    items: [
      {
        icon: Route,
        title: "Dijkstra's Algorithm",
        description: "Shortest path with...",
      },
      {
        icon: Target,
        title: "A* Search",
        description: "Heuristic-based...",
      },
      {
        icon: Binary,
        title: "BFS Pathfinding",
        description: "Breadth-first shorte...",
      },
    ],
  },
  {
    title: "Graph Traversal",
    description: "Explore graph structures visually",
    items: [
      {
        icon: Network,
        title: "BFS Traversal",
        description: "Level-by-level...",
      },
      {
        icon: TreeDeciduous,
        title: "DFS Traversal",
        description: "Deep dive exploration",
      },
      {
        icon: GitBranch,
        title: "Topological Sort",
        description: "Dependency ordering",
      },
    ],
  },
];

const navLinks = [
  { name: "Learn", href: "#learn" },
  { name: "Playground", href: "#playground" },
  { name: "About", href: "#about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 8,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.02,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 8,
      scale: 0.96,
      transition: {
        duration: 0.15,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Wrapper that handles the flat-to-floating transition */}
      <div
        className="transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          padding: scrolled ? "12px 16px 0" : "0",
        }}
      >
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            maxWidth: scrolled ? "900px" : "100%",
            backgroundColor: scrolled ? "rgba(23, 23, 23, 0.85)" : "#000000",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
            borderRadius: scrolled ? "9999px" : "0",
            border: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
              : "none",
          }}
        >
          <div className="flex items-center justify-between px-5 py-3 lg:px-6">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2.5 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#3a3a3a] transition-colors duration-200">
                <span className="text-lg font-bold text-white">Σ</span>
              </div>
              <span className="text-base font-semibold text-white tracking-tight hidden sm:block">
                CodeCanvas
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {/* Visualizers Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <motion.button
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#a1a1a1] hover:text-white rounded-full transition-colors duration-200"
                  whileTap={{ scale: 0.98 }}
                >
                  Visualizers
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-1/2 -translate-x-1/2 mt-3 w-[700px] p-6 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a]"
                      style={{
                        boxShadow:
                          "0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.03)",
                      }}
                    >
                      <div className="grid grid-cols-3 gap-8">
                        {visualizerCategories.map((category) => (
                          <motion.div
                            key={category.title}
                            variants={itemVariants}
                            className="space-y-3"
                          >
                            <div className="pb-3 border-b border-[#1a1a1a]">
                              <h3 className="text-sm font-semibold text-white">
                                {category.title}
                              </h3>
                              <p className="text-xs text-[#666] mt-1">
                                {category.description}
                              </p>
                            </div>
                            <div className="space-y-1">
                              {category.items.map((item) => (
                                <motion.a
                                  key={item.title}
                                  href="#"
                                  className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#141414] transition-all duration-200"
                                  whileHover={{ x: 2 }}
                                  transition={{
                                    duration: 0.15,
                                    ease: [0.23, 1, 0.32, 1],
                                  }}
                                >
                                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#141414] border border-[#222] flex items-center justify-center group-hover:border-[#333] group-hover:bg-[#1a1a1a] transition-all duration-200">
                                    <item.icon className="w-4 h-4 text-[#888] group-hover:text-white transition-colors duration-200" />
                                  </div>
                                  <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-sm font-medium text-[#ccc] group-hover:text-white transition-colors duration-200">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-[#555] mt-0.5">
                                      {item.description}
                                    </p>
                                  </div>
                                </motion.a>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Dropdown Footer */}
                      <motion.div
                        variants={itemVariants}
                        className="mt-6 pt-4 border-t border-[#1a1a1a] flex items-center justify-between"
                      >
                        <p className="text-xs text-[#555]">
                          Explore all algorithms with step-by-step visualization
                        </p>
                        <motion.a
                          href="#"
                          className="text-xs font-medium text-white flex items-center gap-1 group"
                          whileHover={{ x: 2 }}
                        >
                          View All Visualizers
                          <ChevronDown className="w-3 h-3 -rotate-90 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </motion.a>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Nav Links */}
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[#a1a1a1] hover:text-white rounded-full transition-colors duration-200"
                  whileTap={{ scale: 0.98 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <motion.button
                onClick={() => setIsDark(!isDark)}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-[#888] hover:text-white hover:bg-white/5 transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <Sun className="w-[18px] h-[18px]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <Moon className="w-[18px] h-[18px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* GitHub */}
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-[#888] hover:text-white hover:bg-white/5 transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                aria-label="GitHub"
              >
                <Github className="w-[18px] h-[18px]" />
              </motion.a>

              {/* CTA Button */}
              <motion.a
                href="#start"
                className="relative group hidden sm:flex items-center px-5 py-2 ml-2 rounded-full bg-white text-black text-sm font-medium overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Start Visualizing</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-black/5 to-transparent" />
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-[#888] hover:text-white hover:bg-white/5 transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="lg:hidden overflow-hidden"
              >
                <div className="px-4 pb-6 pt-2 border-t border-[#1a1a1a]">
                  {/* Visualizers Accordion */}
                  <div className="mb-2">
                    <motion.button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                      whileTap={{ scale: 0.98 }}
                    >
                      Visualizers
                      <motion.div
                        animate={{ rotate: mobileDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {mobileDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 py-2 space-y-4">
                            {visualizerCategories.map((category) => (
                              <div key={category.title}>
                                <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-2 px-4">
                                  {category.title}
                                </p>
                                <div className="space-y-1">
                                  {category.items.map((item) => (
                                    <motion.a
                                      key={item.title}
                                      href="#"
                                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => setIsOpen(false)}
                                    >
                                      <item.icon className="w-4 h-4" />
                                      {item.title}
                                    </motion.a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Other Links */}
                  {navLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="flex items-center px-4 py-3 text-sm font-medium text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </motion.a>
                  ))}

                  {/* Mobile Bottom Actions */}
                  <div className="mt-4 pt-4 border-t border-[#1a1a1a] space-y-3">
                    <div className="flex items-center gap-2 px-4">
                      <motion.button
                        onClick={() => setIsDark(!isDark)}
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#141414] border border-[#222] text-[#888] hover:text-white transition-all duration-200"
                        whileTap={{ scale: 0.95 }}
                      >
                        {isDark ? (
                          <Sun className="w-[18px] h-[18px]" />
                        ) : (
                          <Moon className="w-[18px] h-[18px]" />
                        )}
                      </motion.button>
                      <motion.a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#141414] border border-[#222] text-[#888] hover:text-white transition-all duration-200"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-[18px] h-[18px]" />
                      </motion.a>
                    </div>

                    <motion.a
                      href="#start"
                      className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-white text-black text-sm font-medium transition-all duration-300"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                    >
                      Start Visualizing
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  );
}