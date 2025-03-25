import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useTheme } from '@/contexts/ThemeContext';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor?: string;
  accentColor?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description,
  icon,
  bgColor = 'bg-blue-500', 
  accentColor = 'text-blue-200' 
}) => {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate code particles
    if (codeRef.current) {
      const codeElements = codeRef.current.querySelectorAll('.code-particle');
      
      gsap.fromTo(
        codeElements,
        {
          opacity: 0,
          y: 20,
          x: 0,
          scale: 0
        },
        {
          opacity: 1,
          y: 0,
          x: idx => (idx % 2 === 0 ? -10 : 10),
          scale: 1,
          stagger: 0.05,
          duration: 0.8,
          ease: "power2.out"
        }
      );
      
      // Continue animation with subtle movement
      codeElements.forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? '10' : '-10',
          x: idx % 3 === 0 ? '5' : '-5',
          rotation: idx % 2 === 0 ? 5 : -5,
          repeat: -1,
          yoyo: true,
          duration: 2 + (idx % 3),
          ease: "sine.inOut",
          delay: idx * 0.1
        });
      });
    }
  }, []);

  const codeParticles = [
    '<div>', '</div>', '<span>', 'const', 'function()', 'return', 'import', 
    'export', '{...}', '(props)', 'useState', 'useEffect', '<=>', '=>', '===',
    'async', 'await', '.then()', '<App/>', '</>', '</>',
    '[]', '{}', '&&', '||', '!!'
  ];

  return (
    <div 
      ref={containerRef}
      className={`min-h-[calc(100vh-12rem)] relative flex flex-col items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      {/* Floating code particles */}
      <div 
        ref={codeRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {codeParticles.map((code, idx) => (
          <div
            key={idx}
            className={`code-particle absolute ${accentColor} font-mono text-sm opacity-50 whitespace-nowrap`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {code}
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          className={`mb-8 ${bgColor} text-white p-4 rounded-full inline-block`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
        >
          {icon}
        </motion.div>
        
        <motion.h1
          className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {title}
        </motion.h1>
        
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Coming Soon text with code-like animation */}
          <div className="flex items-center justify-center mb-8">
            <div className="typewriter inline-block relative">
              <h2 className={`text-3xl font-bold ${accentColor} typewriter-text`}>
                &lt;Coming_Soon /&gt;
              </h2>
            </div>
          </div>
          
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            {description}
          </p>
        </motion.div>
        
        {/* Progress indicator */}
        <motion.div
          className="mt-10 w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto"
          initial={{ width: 0 }}
          animate={{ width: "16rem" }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.div
            className={`h-full ${bgColor}`}
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            transition={{ 
              delay: 1,
              duration: 2,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.p
          className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Development in progress: 70%
        </motion.p>
      </div>
      
      {/* Background decoration */}
      <div className={`absolute bottom-0 left-0 w-full h-64 ${bgColor} opacity-5 -skew-y-6 transform-gpu`}></div>
    </div>
  );
};

export default ComingSoon; 