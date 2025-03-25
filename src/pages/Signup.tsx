import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Button } from '@progress/kendo-react-buttons';
import { TextBox } from '@progress/kendo-react-inputs';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
    
    // Reset error
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
    
    // Submit the form
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
      
      // Registration successful, redirect to login
      navigate('/login', { state: { successMessage: 'Account created successfully! Please log in.' } });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#014D71] to-[#014D71]/80 relative overflow-hidden">
      {/* Parallax background elements */}
      <div className="parallax-bg absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#014D71]/20 to-transparent"></div>
      </div>

      {/* Animated background shapes */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </motion.div>

      <Card className="auth-card w-[400px] bg-white/90 backdrop-blur-sm border-none shadow-2xl">
        <CardHeader className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-3xl font-bold text-center text-[#014D71]">
              CodingCam
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Start your coding journey today
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <TextBox
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.value as string)}
                required
                placeholder="Choose a username"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
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
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <TextBox
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.value as string)}
                required
                placeholder="Create a password"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <TextBox
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.value as string)}
                required
                placeholder="Confirm your password"
                className="w-full"
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 p-2 rounded-md"
              >
                {error}
              </motion.div>
            )}
            
            <Button
              type="submit"
              themeColor="primary"
              className="w-full bg-[#014D71] hover:bg-[#014D71]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#014D71] hover:underline">
                Sign in
              </a>
            </div>
          </motion.form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

