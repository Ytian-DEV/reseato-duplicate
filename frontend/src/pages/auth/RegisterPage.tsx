import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Store, Users, ArrowLeft, UtensilsCrossed, Moon, Sun } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { TermsModal } from '../../components/common/TermsModal';
import authService from '../../services/authService';
import { UserRole } from '../../../../shared/types';
import toast, { Toaster } from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: UserRole.CUSTOMER as UserRole,
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});

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
    if (authService.isAuthenticated()) {
      const user = authService.getStoredUser();
      if (user?.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!agreedToTerms) newErrors.terms = 'You must agree to the Terms and Conditions to continue';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
      });
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (formData.role === UserRole.VENDOR) {
        navigate('/vendor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className={`rounded-2xl shadow-2xl p-6 md:p-8 ${ /* Reduced padding from p-8 md:p-12 to p-6 md:p-8 */
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header - More compact */}
          <div className="text-center mb-6"> {/* Reduced from mb-8 to mb-6 */}
            <Link to="/" className="inline-flex items-center space-x-2 mb-4"> {/* Reduced from mb-6 to mb-4 */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30"> {/* Reduced from w-12 h-12 to w-10 h-10 */}
                <UtensilsCrossed className="w-6 h-6 text-white" /> {/* Reduced from w-7 h-7 to w-6 h-6 */}
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">RESEATO</span> {/* Reduced from text-2xl to text-xl */}
            </Link>
            <h3 className={`text-2xl font-bold mb-1 ${ /* Reduced from text-3xl to text-2xl, mb-2 to mb-1 */
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>Create Account</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-neutral-600'}`}> {/* Reduced text size */}
              Join us and start reserving tables today
            </p>
          </div>

          {/* Role Selection - More compact */}
          <div className="mb-6"> {/* Reduced from mb-8 to mb-6 */}
            <label className={`block text-xs font-medium mb-2 ${ /* Reduced from text-sm to text-xs */
              isDarkMode ? 'text-gray-300' : 'text-neutral-700'
            }`}>I am a...</label>
            <div className="grid grid-cols-2 gap-3"> {/* Reduced from gap-4 to gap-3 */}
              <button
                type="button"
                onClick={() => handleChange('role', UserRole.CUSTOMER)}
                className={`
                  p-3 rounded-xl border-2 transition-all duration-200 /* Reduced from p-4 to p-3 */
                  ${formData.role === UserRole.CUSTOMER
                    ? isDarkMode
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-primary-500 bg-primary-50'
                    : isDarkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <Users className={`w-6 h-6 mx-auto mb-1 ${ /* Reduced from w-8 h-8 to w-6 h-6, mb-2 to mb-1 */
                  formData.role === UserRole.CUSTOMER ? 'text-primary-600 dark:text-purple-400' : 'text-neutral-400 dark:text-gray-500'
                }`} />
                <div className={`text-sm font-semibold ${ /* Reduced from text-base to text-sm */
                  formData.role === UserRole.CUSTOMER ? 'text-primary-600 dark:text-purple-400' : 'text-neutral-700 dark:text-gray-300'
                }`}>
                  Customer
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-neutral-500'}`}>
                  Reserve tables
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleChange('role', UserRole.VENDOR)}
                className={`
                  p-3 rounded-xl border-2 transition-all duration-200
                  ${formData.role === UserRole.VENDOR
                    ? isDarkMode
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-primary-500 bg-primary-50'
                    : isDarkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <Store className={`w-6 h-6 mx-auto mb-1 ${
                  formData.role === UserRole.VENDOR ? 'text-primary-600 dark:text-purple-400' : 'text-neutral-400 dark:text-gray-500'
                }`} />
                <div className={`text-sm font-semibold ${
                  formData.role === UserRole.VENDOR ? 'text-primary-600 dark:text-purple-400' : 'text-neutral-700 dark:text-gray-300'
                }`}>
                  Restaurant Owner
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-neutral-500'}`}>
                  Manage bookings
                </div>
              </button>
            </div>
          </div>

          {/* Form - More compact spacing */}
          <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced from space-y-5 to space-y-4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* Reduced from gap-4 to gap-3 */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${ /* Reduced from text-sm to text-xs, mb-2 to mb-1.5 */
                  isDarkMode ? 'text-gray-300' : 'text-neutral-700'
                }`}>
                  First Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${ /* Reduced from w-5 h-5 to w-4 h-4 */
                    isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                  }`} />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm ${ /* Reduced padding, text-sm */
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                    } ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName}</p> /* Reduced from text-sm to text-xs */
                )}
              </div>
              
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${
                  isDarkMode ? 'text-gray-300' : 'text-neutral-700'
                }`}>
                  Last Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                  }`} />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                        : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                    } ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-neutral-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                }`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-neutral-700'
              }`}>
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                }`} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-neutral-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                }`} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                  } ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Create a password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                isDarkMode ? 'text-gray-300' : 'text-neutral-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                }`} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                  } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setErrors({ ...errors, terms: '' });
                }}
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">
                I have read and agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setTermsModalOpen(true); }}
                  className="text-primary-700 hover:text-primary-800 font-medium underline"
                >
                  Terms and Conditions
                </button>
              </span>
            </label>
            <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
            {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />} /* Reduced from w-5 h-5 to w-4 h-4 */
            >
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center"> {/* Reduced from mt-6 to mt-4 */}
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-neutral-600'}`}> {/* Reduced from text-base to text-sm */}
              Already have an account?{' '}
              <Link to="/login" className={`font-semibold text-sm ${
                isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-primary-600 hover:text-primary-700'
              }`}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};