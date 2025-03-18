import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import '@progress/kendo-theme-default/dist/all.css';
import '../index.css'; // Custom CSS for header, cards, animations, etc.

// Custom parallax effect hook (unchanged)
const useParallax = () => {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollPosition = window.scrollY;
        const element = ref.current;
        const speed = 0.5;
        const yPos = -(scrollPosition * speed);
        element.style.transform = `translate3d(0px, ${yPos}px, 0px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return ref;
};

const Index = () => {
  const heroImageRef = useParallax();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Custom gradient text style remains the same
  const gradientTextStyle = {
    background: 'linear-gradient(90deg, #614AD3 0%, #4D5BD9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block'
  };

  return (
    <div className="k-body">
      {/* Header replaced premium AppBar with custom header */}
      <header className="custom-header k-shadow">
        <div className="header-section">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg className="k-icon" style={{ height: '32px', width: '32px', color: '#614AD3' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span style={{ ...gradientTextStyle, marginLeft: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}>
              CodeCortex
            </span>
          </div>
        </div>
        <div className="header-spacer"></div>
        <div className="header-section">
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/login">
              <Button themeColor="light" fillMode="flat">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button themeColor="primary" fillMode="solid">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section (removed premium Animation wrappers) */}
        <section className="hero-section" style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
          <div ref={heroImageRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.05 }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
              <path d="M0 0L100 100M100 0L0 100" stroke="#614AD3" strokeWidth="0.5" />
              <path d="M0 50H100M50 0V100" stroke="#4D5BD9" strokeWidth="0.5" />
            </svg>
          </div>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="fade-in" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 'bold', marginBottom: '24px', lineHeight: 1.2 }}>
              Track Your Coding Time and<br />
              <span style={gradientTextStyle}>Boost Productivity</span>
            </h1>
            <p className="fade-in" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#6e6e6e', maxWidth: '768px', margin: '0 auto 40px' }}>
              CodeCortex automatically tracks your programming activity, generates insightful reports, and helps you improve your coding efficiency.
            </p>
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
                <Link to="/signup">
                  <Button size="large" themeColor="primary">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="large" themeColor="base" fillMode="outline">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="slide-in" style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6e6e6' }}>
              <img 
                src="https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=1200&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section animate-on-scroll" style={{ padding: '80px 24px', backgroundColor: '#f9f9f9' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '64px' }}>Key Features</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              <div className="custom-card fade-in" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(97, 74, 211, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg style={{ height: '24px', width: '24px', color: '#614AD3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Automatic Time Tracking</h3>
                <p style={{ color: '#6e6e6e' }}>
                  Seamlessly tracks your coding time across all your IDEs and projects without manual input.
                </p>
              </div>
              
              <div className="custom-card fade-in" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(77, 91, 217, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg style={{ height: '24px', width: '24px', color: '#4D5BD9' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Detailed Analytics</h3>
                <p style={{ color: '#6e6e6e' }}>
                  Get comprehensive insights into your coding habits, languages, and projects.
                </p>
              </div>
              
              <div className="custom-card fade-in" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(114, 49, 208, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg style={{ height: '24px', width: '24px', color: '#7231D0' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Developer Leaderboards</h3>
                <p style={{ color: '#6e6e6e' }}>
                  Compare your stats with other developers and see how you rank globally.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e6e6e', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg style={{ height: '24px', width: '24px', color: '#614AD3' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span style={{ ...gradientTextStyle, marginLeft: '4px', fontSize: '1.125rem', fontWeight: 'bold' }}>
              CodeCortex
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6e6e6e' }}>
            © 2023 CodeCortex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
