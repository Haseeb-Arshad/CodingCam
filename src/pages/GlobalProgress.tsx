import React, { useEffect, useRef } from 'react';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ComingSoon from '@/components/ComingSoon';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import gsap from 'gsap';

const GlobalProgress = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (globeRef.current) {
      // Create animated dots representing developers around the globe
      const createMapDot = (x: number, y: number) => {
        const dot = document.createElement('div');
        dot.className = 'absolute w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50';
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.opacity = '0';
        globeRef.current?.appendChild(dot);
        
        // Animate dot appearance
        gsap.to(dot, {
          opacity: 0.8,
          scale: 1.5,
          duration: 1,
          delay: Math.random() * 2,
          onComplete: () => {
            // Pulse animation
            gsap.to(dot, {
              scale: 1,
              opacity: 0.4,
              duration: 1 + Math.random(),
              repeat: -1,
              yoyo: true
            });
          }
        });
        
        // Create connection lines between some dots for network effect
        const createRandomConnection = () => {
          if (Math.random() > 0.7) {
            const allDots = globeRef.current?.querySelectorAll('div');
            if (allDots && allDots.length > 2) {
              const randomDot = allDots[Math.floor(Math.random() * allDots.length)];
              
              const line = document.createElement('div');
              line.className = 'absolute bg-blue-400/20 h-px transform origin-left';
              line.style.left = dot.style.left;
              line.style.top = dot.style.top;
              
              const dotRect = dot.getBoundingClientRect();
              const randomDotRect = randomDot.getBoundingClientRect();
              const globeRect = globeRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
              
              const x1 = dotRect.left - globeRect.left + dotRect.width / 2;
              const y1 = dotRect.top - globeRect.top + dotRect.height / 2;
              const x2 = randomDotRect.left - globeRect.left + randomDotRect.width / 2;
              const y2 = randomDotRect.top - globeRect.top + randomDotRect.height / 2;
              
              const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
              
              line.style.width = `${distance}px`;
              line.style.transform = `rotate(${angle}deg)`;
              
              globeRef.current?.appendChild(line);
              
              gsap.from(line, {
                scaleX: 0,
                opacity: 0,
                duration: 1,
                delay: Math.random() * 3
              });
            }
          }
        };
        
        setTimeout(createRandomConnection, 2000 + Math.random() * 1000);
      };
      
      // North America
      createMapDot(25, 30);
      createMapDot(20, 35);
      createMapDot(28, 25);
      
      // South America
      createMapDot(30, 60);
      createMapDot(32, 50);
      
      // Europe
      createMapDot(48, 28);
      createMapDot(52, 26);
      createMapDot(45, 30);
      
      // Asia
      createMapDot(68, 30);
      createMapDot(75, 35);
      createMapDot(82, 28);
      
      // Australia
      createMapDot(80, 65);
      
      // Africa
      createMapDot(50, 50);
      createMapDot(48, 45);
      
      // Add more random dots
      for (let i = 0; i < 20; i++) {
        createMapDot(
          20 + Math.random() * 65, 
          20 + Math.random() * 60
        );
      }
    }
  }, []);
  
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        <ComingSoon 
          title="Global Developer Network"
          description="Explore the worldwide community of developers, see real-time coding activity across the globe, and connect with programmers from different countries and cultures."
          icon={<Globe size={48} />}
          bgColor="bg-blue-600"
          accentColor="text-blue-300"
        />
        
        {/* 3D Globe Visualization Concept */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="max-w-4xl mx-auto mt-8 mb-12 px-6"
        >
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 p-1">
            <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')]"></div>
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm"></div>
            
            <div className="relative bg-blue-950/60 backdrop-blur-md rounded-lg p-6 h-80 overflow-hidden">
              <h3 className="text-blue-300 font-mono text-xs absolute top-4 left-4 font-medium">
                DEVELOPER ACTIVITY MAP - LIVE VIEW
              </h3>
              
              {/* World map outline */}
              <div ref={globeRef} className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-4/5 h-auto opacity-30 text-blue-300" 
                  viewBox="0 0 1024 512" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    d="M244,428L244,428L243,427L243,426L242,426L242,426L241,425L241,
                    424L239,424L239,424L238,424L238,424L236,426L236,426L235,427L235,
                    428L233,428L233,429L232,430L232,430L231,431L231,431L230,431L230,
                    431L229,431L228,431L228,431L227,430L227,429L227,428L227,427L228,
                    426L228,425L229,424L230,424L230,423L231,423L231,423L232,423L233,
                    423L233,422L233,422L234,422L235,422L235,422L235,421L235,421L235,
                    421L236,421L236,421L237,421L237,420L237,420L237,419L238,419L238,
                    419L239,419L239,418L239,418L240,417L240,417L240,417L241,417L241,
                    417L242,417L242,417L243,417L243,416L243,416L244,416L244,416L245,
                    416L245,416L246,416L246,416L247,416L247,416L247,415L247,415L247,
                    415L250,413L250,413L250,413L252,412L252,411L252,411L252,410L253,
                    410L254,410L254,409L255,409L255,409L256,409L257,408L257,408L258,
                    408L258,408L258,407L259,407L259,407L260,407L260,407L261,407L261,
                    407L262,407L262,407L263,407L263,408L264,408L264,408L264,409L264,
                    409L265,409L265,410L266,410L266,410L266,411L266,411L266,412L267,
                    413L267,413L267,414L267,414L268,415L268,415L268,416L268,416L268,
                    417L268,417L268,418L268,418L268,419L268,419L267,420L267,420L267,
                    420L267,421L267,421L267,422L267,422L267,423L267,423L267,424L267,
                    424L267,425L267,425L266,425L266,425L266,426L266,426L266,426L266,
                    427L266,427L265,427L264,427L264,427L263,427L263,427L262,428L262,
                    428L260,428L260,428L258,428L258,428L256,428L256,428L255,428L255,
                    428L254,428L252,428L251,428L251,428L250,428L250,428L249,428L249,
                    428L248,428L248,428L248,428L247,428L247,428L246,428L246,428L245,
                    428L245,428L244,428" 
                  />

                  {/* Add more path elements for a complete world map outline */}
                  <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    d="M507,337L507,337L506,337L506,337L505,337L504,337L504,336L504,
                    336L504,335L503,335L503,334L503,334L502,334L502,333L502,333L502,
                    333L502,332L502,332L501,332L501,332L501,331L501,331L500,331L500,
                    330L500,330L500,330L499,330L499,330L499,329L499,329L498,329L498,
                    328L497,328L497,328L497,328L496,328L496,328L496,328L496,328L495,
                    329L495,329L495,329L494,329L494,329L493,330L493,330L492,330L492,
                    330L492,331L492,332L491,332L491,332L490,333L490,333L490,333L489,
                    334L489,334L489,334L488,334L488,335L488,335L487,335L487,335L486,
                    335L486,335L485,335L485,335L485,335L484,335L484,335L483,335L483,
                    335L482,335L482,335L482,335L481,335L481,335L480,335L480,335L479,
                    335L479,335L479,335L479,335"
                  />
                </svg>
              </div>
              
              {/* Visual details for map */}
              <div className="absolute bottom-4 right-4 flex space-x-3 text-xs text-blue-200">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                  <span>Idle</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                  <span>New</span>
                </div>
              </div>
              
              {/* Background grid and glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default GlobalProgress; 