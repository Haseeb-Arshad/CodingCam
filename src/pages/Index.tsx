import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@progress/kendo-react-buttons';
import { Clock, Code, BarChart2, Layers, Award, GitBranch, Globe, Users, Target } from 'lucide-react';
import '@progress/kendo-theme-default/dist/all.css';
import '../index.css'; // Custom CSS for header, cards, animations, etc.

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Hero section animations
    gsap.fromTo(
      '.hero-title', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo(
      '.hero-subtitle', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
    );
    
    gsap.fromTo(
      '.hero-cta', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' }
    );

    // Globe visualization
    if (globeRef.current) {
      const createMapDot = (x: number, y: number) => {
        const dot = document.createElement('div');
        dot.className = 'absolute w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50';
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.opacity = '0';
        globeRef.current?.appendChild(dot);
        
        gsap.to(dot, {
          opacity: 0.8,
          scale: 1.5,
          duration: 1,
          delay: Math.random() * 2,
          onComplete: () => {
            gsap.to(dot, {
              scale: 1,
              opacity: 0.4,
              duration: 1 + Math.random(),
              repeat: -1,
              yoyo: true
            });
          }
        });
        
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
      
      // Add dots for different regions
      createMapDot(25, 30); // North America
      createMapDot(20, 35);
      createMapDot(28, 25);
      createMapDot(30, 60); // South America
      createMapDot(32, 50);
      createMapDot(48, 28); // Europe
      createMapDot(52, 26);
      createMapDot(45, 30);
      createMapDot(68, 30); // Asia
      createMapDot(75, 35);
      createMapDot(82, 28);
      createMapDot(80, 65); // Australia
      createMapDot(50, 50); // Africa
      createMapDot(48, 45);
      
      // Add random dots
      for (let i = 0; i < 20; i++) {
        createMapDot(
          20 + Math.random() * 65, 
          20 + Math.random() * 60
        );
      }
    }
    
    // Feature animations on scroll
    const features = document.querySelectorAll('.feature-item');
    features.forEach((feature, index) => {
      gsap.fromTo(
        feature,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: feature,
            start: 'top 80%',
          },
          delay: index * 0.1
        }
      );
    });
    
    // Stats counter animation
    const statCounters = document.querySelectorAll('.stat-counter');
    statCounters.forEach((counter) => {
      const target = parseInt(counter.textContent || '0', 10);
      gsap.fromTo(
        counter,
        { textContent: '0' },
        {
          textContent: target.toString(),
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
          snap: { textContent: 1 },
          onUpdate: function() {
            counter.textContent = Math.round(Number(counter.textContent)).toString();
          }
        }
      );
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
  
  return (
    <div className="bg-white text-gray-900">
      {/* Navigation Header */}
      <header ref={headerRef} className="fixed w-full top-0 left-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-[#014D71] text-white rounded-lg flex items-center justify-center">
              <Code size={24} />
            </div>
            <span className="text-2xl font-bold text-[#014D71]">CodingCam</span>
          </div>
          
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-gray-700 hover:text-[#014D71] transition-colors">Features</Link>
            <Link to="#how-it-works" className="text-gray-700 hover:text-[#014D71] transition-colors">How it Works</Link>
            <Link to="#pricing" className="text-gray-700 hover:text-[#014D71] transition-colors">Pricing</Link>
          </nav> */}
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-[#014D71] font-medium hover:underline">Log In</Link>
            <Link to="/signup">
              <Button themeColor="primary" className="bg-[#014D71] hover:bg-[#014D71]/90">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        {/* Animated background shapes */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </motion.div>

        <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2 mt-12 md:mt-0">
            <h1 className="hero-title text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Track Your <span className="text-[#014D71]">Coding Habits</span> Like Never Before
            </h1>
            <p className="hero-subtitle mt-6 text-xl text-gray-600 max-w-lg">
              CodingCam helps developers visualize their coding patterns, improve productivity, and build better coding habits.
            </p>
            <div className="hero-cta mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button
                  themeColor="primary"
                  size="large"
                  className="w-full sm:w-auto bg-[#014D71] hover:bg-[#014D71]/90 hover:scale-105 transition-transform"
                >
                  Get Started — It's Free
                </Button>
              </Link>
              <Link to="#how-it-works">
                <Button
                  themeColor="base"
                  size="large"
                  className="w-full sm:w-auto text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>Quick Setup</span>
              </div>
              {/* <div className="flex items-center">
                <Award size={16} className="mr-1" />
                <span>No Credit Card</span>
              </div> */}
              <div className="flex items-center">
                <GitBranch size={16} className="mr-1" />
                <span>All IDEs</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 p-1"
              >
                <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')]"></div>
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm"></div>
                
                <div className="relative bg-blue-950/60 backdrop-blur-md rounded-lg p-6 h-80 overflow-hidden">
                  <h3 className="text-blue-300 font-mono text-xs absolute top-4 left-4 font-medium">
                    GLOBAL DEVELOPER NETWORK
                  </h3>
                  
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
                    </svg>
                  </div>
                  
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
                </div>
              </motion.div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#014D71]/10 rounded-full filter blur-3xl -z-10"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" ref={featureRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-xl mx-auto">
              Everything you need to analyze and improve your coding habits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-item bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-14 w-14 bg-blue-100 text-[#014D71] rounded-lg flex items-center justify-center mb-6">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time Tracking</h3>
              <p className="text-gray-600">
                Automatically track your coding time across different projects and programming languages.
              </p>
            </div>
            
            <div className="feature-item bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-14 w-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Visualize your coding patterns with beautiful charts and detailed reports.
              </p>
            </div>
            
            <div className="feature-item bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-14 w-14 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Code size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Language Insights</h3>
              <p className="text-gray-600">
                Track time spent in different programming languages and see your proficiency grow over time.
              </p>
            </div>
            
            <div className="feature-item bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-14 w-14 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <Layers size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Project Management</h3>
              <p className="text-gray-600">
                Organize your work by projects and see where you're spending most of your time.
              </p>
            </div>
            
            <div className="feature-item bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-14 w-14 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Leaderboards</h3>
              <p className="text-gray-600">
                Compare your stats with other developers and find motivation in friendly competition.
              </p>
            </div>
            
            <div className="feature-item bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="h-14 w-14 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <GitBranch size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IDE Integration</h3>
              <p className="text-gray-600">
                Works with all popular code editors and IDEs with minimal configuration.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-[#014D71] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">By the Numbers</h2>
            <p className="mt-4 text-xl text-white/80 max-w-xl mx-auto">
              Join thousands of developers who are already improving their coding habits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="stat-counter">25000</span>+
              </div>
              <p className="text-white/80">Active Developers</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="stat-counter">1000000</span>+
              </div>
              <p className="text-white/80">Hours Tracked</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="stat-counter">50</span>+
              </div>
              <p className="text-white/80">Programming Languages</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                <span className="stat-counter">30</span>%
              </div>
              <p className="text-white/80">Productivity Boost</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to improve your coding habits?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of developers who are tracking their time, improving their skills, and becoming more productive.
            </p>
            <Link to="/signup">
              <Button
                themeColor="primary"
                size="large"
                className="bg-[#014D71] hover:bg-[#014D71]/90 hover:scale-105 transition-transform"
              >
                Get Started For Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <div className="h-8 w-8 bg-[#014D71] text-white rounded-lg flex items-center justify-center">
                <Code size={16} />
              </div>
              <span className="text-xl font-bold text-[#014D71]">CodingCam</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="#" className="text-gray-600 hover:text-[#014D71]">About</Link>
              <Link to="#" className="text-gray-600 hover:text-[#014D71]">Blog</Link>
              <Link to="#" className="text-gray-600 hover:text-[#014D71]">Privacy</Link>
              <Link to="#" className="text-gray-600 hover:text-[#014D71]">Terms</Link>
              <Link to="#" className="text-gray-600 hover:text-[#014D71]">Support</Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CodingCam. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
