import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import authService from '../../services/authService';
import toast, { Toaster } from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

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
      // Redirect based on role
      if (user?.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4 relative">
      <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 p-3 rounded-full bg-white/50 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-md text-neutral-600 hover:text-primary-600 transition-all duration-300 group">
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
              <h2 className="text-4xl font-bold text-neutral-900 leading-tight">
                Welcome back to
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">seamless dining</span>
              </h2>
              <p className="text-xl text-neutral-600">
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
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-700">{feature}</span>
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
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-neutral-900 mb-2">Sign In</h3>
              <p className="text-neutral-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: '' });
                }}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5" />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                leftIcon={<Lock className="w-5 h-5" />}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" />
                  <span className="text-sm text-neutral-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
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
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign up for free
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200">
              <p className="text-xs text-center text-neutral-500">
                By continuing, you agree to RESEATO's Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
