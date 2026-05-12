import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CodeCanvasTitle from "./Title"; 

function Footer() {
  const productLinks = ["Visualizer", "Practice", "Roadmap", "Pricing"];
  const companyLinks = ["About", "Contact", "Privacy", "Terms"];
  const socialLinks = ["GitHub", "Twitter", "LinkedIn"];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full bg-black border-t border-white/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-24 relative">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 lg:gap-24 text-center lg:text-left">
          
          {/* Brand Section - Centered on mobile */}
          <div className="flex-1 flex flex-col items-center lg:items-start max-w-sm">
            <Link to="/" className="flex items-center gap-4 group w-fit transition-transform hover:scale-105">
              {/* Scaled Sigma Circle */}
              <div className="text-white border-[1.5px] border-white w-12 h-12 flex items-center justify-center rounded-full rotate-[-10deg] group-hover:rotate-0 transition-transform duration-500">
                <span className="text-xl font-bold">Σ</span>
              </div>

              {/* Scaled Split Wordmark */}
              <div className="flex flex-col leading-[0.8]">
                <span className="text-white text-2xl font-extrabold tracking-tighter uppercase">
                  CODE
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-t from-white/10 to-white/60 tracking-[0.15em] font-light uppercase text-sm ml-0.5">
                  Canvas
                </span>
              </div>
            </Link>

            <p className="mt-6 text-sm text-white/40 leading-relaxed font-light max-w-xs lg:max-w-none">
              The ultimate playground for algorithm mastery. <br className="hidden lg:block"/>
              Visualize logic, build intuition.
            </p>
          </div>

          {/* Links Grid - Balanced for tablet/mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8 lg:gap-x-24 w-full lg:w-auto">
            <div className="space-y-4">
              <h3 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
                Engine
              </h3>
              <ul className="flex flex-col gap-3">
                {productLinks.map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase()}`} className="text-sm text-white/50 hover:text-white transition-all font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
                Source
              </h3>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase()}`} className="text-sm text-white/50 hover:text-white transition-all font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 col-span-2 md:col-span-1 border-t border-white/5 pt-8 md:border-t-0 md:pt-0">
              <h3 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
                Connect
              </h3>
              <ul className="flex flex-row md:flex-col gap-8 md:gap-3 justify-center md:justify-start">
                {socialLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-all font-light">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Large Title Component - Scaled for Mobile/Tablet */}
        <div className="mt-12 lg:mt-32 opacity-40 hover:opacity-100 transition-opacity duration-1000">
           <div className="scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 origin-center transition-transform duration-700">
             <CodeCanvasTitle />
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[9px] text-white/20 font-mono tracking-[0.4em] uppercase">
            © 2026 // CODE_CANVAS.ENGINE.STASH
          </p>
          
          <div className="flex gap-8">
            {socialLinks.map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-[9px] text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;