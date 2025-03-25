import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@progress/kendo-react-buttons';
import { TextBox } from '@progress/kendo-react-inputs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Code, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const successMessage = (location.state as any)?.successMessage || '';

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
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/frontend/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#014D71] to-[#01395a] relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="parallax-bg absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#014D71]/20 to-transparent"></div>
      </div>

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

      <div className="w-full max-w-md px-4">
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
            Sign in to your account
          </motion.p>
        </div>

        <Card className="auth-card bg-white/95 backdrop-blur-sm border-none shadow-2xl">
          <CardContent className="pt-6">
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-md"
              >
                {successMessage}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <TextBox
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.value as string)}
                  required
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-[#014D71] hover:text-[#013657] font-medium">
                    Forgot password?
                  </a>
                </div>
                <TextBox
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.value as string)}
                  required
                  placeholder="Enter your password"
                  className="w-full"
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
              <Button
                type="submit"
                themeColor="primary"
                size="large"
                className="w-full bg-[#014D71] hover:bg-[#013657] font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#014D71] hover:text-[#013657] font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm">
            By signing in, you agree to our{' '}
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
