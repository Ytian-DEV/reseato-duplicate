import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, UtensilsCrossed, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import authService from '../../services/authService';
import toast, { Toaster } from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check for saved preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getStoredUser();
    if (user && authService.isAuthenticated()) {
      redirectUser(user);
    }
  }, []);

  const redirectUser = (user: any) => {
    if (user?.role === 'vendor') {
      navigate('/vendor/dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = { email: '', password: '' };
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await authService.login({ email, password });
      toast.success('Login successful!');
      
      const user = authService.getStoredUser();
      redirectUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.error('Forgot password functionality coming soon!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950' 
        : 'bg-gradient-to-br from-primary-50 via-white to-primary-50'
    } flex items-center justify-center p-4 relative`}>
      
      {/* Dark Mode Toggle - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
            isDarkMode 
              ? 'bg-purple-900 text-yellow-300 hover:bg-purple-800' 
              : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      <Link to="/" className={`absolute top-4 left-4 md:top-8 md:left-8 p-3 rounded-full backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group ${
        isDarkMode 
          ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-purple-400' 
          : 'bg-white/50 text-neutral-600 hover:bg-white hover:text-primary-600'
      }`}>
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </Link>
      <Toaster position="top-center" />
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/40">
                <UtensilsCrossed className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">RESEATO</h1>
            </div>

            <div className="space-y-4">
              <h2 className={`text-4xl font-bold leading-tight ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                Welcome back to
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">seamless dining</span>
              </h2>
              <p className={isDarkMode ? 'text-xl text-gray-300' : 'text-xl text-neutral-600'}>
                Your favorite restaurants are just a click away.
              </p>
            </div>

            <div className="space-y-4 pt-8">
              {[
                'Reserve tables in seconds',
                'Skip the waiting lines',
                'Manage all your bookings',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-neutral-700'}>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`rounded-3xl shadow-2xl p-6 md:p-12 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="mb-6 md:mb-8">
              <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>Sign In</h3>
              <p className={isDarkMode ? 'text-sm md:text-base text-gray-400' : 'text-sm md:text-base text-neutral-600'}>
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-neutral-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                    } ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-neutral-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: '' });
                    }}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                    } ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors ${
                      isDarkMode ? 'text-gray-500 hover:text-purple-400' : 'text-neutral-400 hover:text-primary-600'
                    }`}
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className={`rounded border-2 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'border-neutral-300'
                  }`} />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-neutral-600'
                  }`}>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={`text-sm font-medium focus:outline-none ${
                    isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary-600 hover:text-primary-700'
                  }`}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className={isDarkMode ? 'text-gray-400' : 'text-neutral-600'}>
                Don't have an account?{' '}
                <Link to="/register" className={`font-semibold ${
                  isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary-600 hover:text-primary-700'
                }`}>
                  Sign up for free
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-gray-700">
              <p className={`text-xs text-center ${
                isDarkMode ? 'text-gray-500' : 'text-neutral-500'
              }`}>
                By continuing, you agree to RESEATO's Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};