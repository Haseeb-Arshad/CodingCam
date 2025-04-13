import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Code, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP animation for the card entrance
    gsap.from('.auth-card', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });

    // Parallax effect for the background
    const handleScroll = () => {
      const scrolled = window.scrollY;
      gsap.to('.parallax-bg', {
        y: scrolled * 0.5,
        duration: 0.5
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/frontend/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }
      
      navigate('/login', { state: { successMessage: 'Account created successfully! Please log in.' } });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#014D71] to-[#01395a] relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="parallax-bg absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#014D71]/20 to-transparent"></div>
      </div>

      {/* Animated background shapes */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </motion.div>

      <div className="w-full max-w-md px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="h-16 w-16 bg-white text-[#014D71] rounded-2xl flex items-center justify-center shadow-lg">
              <Code size={36} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold text-white mb-2"
          >
            CodingCam
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-blue-100 text-lg"
          >
            Create your account
          </motion.p>
        </div>

        <Card className="auth-card bg-white/95 backdrop-blur-sm border-none shadow-2xl">
          <CardContent className="pt-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#014D71] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#014D71] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#014D71] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#014D71] focus:border-transparent transition-all"
                />
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 text-red-700 text-sm rounded-md"
                >
                  {error}
                </motion.div>
              )}
              
              <button
                type="submit"
                className="w-full bg-[#014D71] hover:bg-[#013657] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#014D71] hover:text-[#013657] font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-white hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-white hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

