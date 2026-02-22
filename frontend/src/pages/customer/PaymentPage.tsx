import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Wallet, Moon, Sun } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { TermsModal } from '../../components/common/TermsModal';
import paymentService from '../../services/paymentService';
import toast, { Toaster } from 'react-hot-toast';

export const PaymentPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);

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

  const handlePayment = async () => {
    if (!reservationId) return;

    if (!agreedToTerms) {
      setTermsError('You must agree to the Terms and Conditions to proceed with payment.');
      return;
    }
    setTermsError('');

    try {
      setLoading(true);
      await paymentService.createPayment(reservationId, 100, paymentMethod);
      
      toast.success('Payment successful!');
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/my-reservations');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-neutral-50'
    } py-12 px-4 sm:px-6 lg:px-8`}>
      <Toaster position="top-center" />

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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-neutral-900'
          }`}>Secure Payment</h1>
          <p className={isDarkMode ? 'text-gray-400 mt-2' : 'text-neutral-600 mt-2'}>
            Complete your reservation
          </p>
        </div>

        <Card className={`shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`-mx-6 -mt-6 px-6 py-4 border-b mb-6 ${
            isDarkMode 
              ? 'bg-purple-900/20 border-gray-700' 
              : 'bg-primary-50 border-primary-100'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${
                isDarkMode ? 'text-purple-300' : 'text-primary-800'
              }`}>Reservation Fee</span>
              <span className={`text-2xl font-bold ${
                isDarkMode ? 'text-purple-400' : 'text-primary-600'
              }`}>₱100.00</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-neutral-700'
              }`}>
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`
                    p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all
                    ${paymentMethod === 'card'
                      ? isDarkMode
                        ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                        : 'border-primary-500 bg-primary-50 text-primary-700'
                      : isDarkMode
                        ? 'border-gray-700 hover:border-gray-600 text-gray-400'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }
                  `}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`
                    p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all
                    ${paymentMethod === 'wallet'
                      ? isDarkMode
                        ? 'border-purple-500 bg-purple-900/20 text-purple-300'
                        : 'border-primary-500 bg-primary-50 text-primary-700'
                      : isDarkMode
                        ? 'border-gray-700 hover:border-gray-600 text-gray-400'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }
                  `}
                >
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm font-medium">GCash / Maya / InstaPay</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className={`block text-xs font-medium mb-1 uppercase tracking-wide ${
                    isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                  }`}>Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                      }`}
                    />
                    <CreditCard className={`w-5 h-5 absolute left-3 top-3.5 ${
                      isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                    }`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                    }`}>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 uppercase tracking-wide ${
                      isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                    }`}>CVC</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="123"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                      <Lock className={`w-4 h-4 absolute left-3 top-3.5 ${
                        isDarkMode ? 'text-gray-500' : 'text-neutral-400'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className={`p-4 rounded-lg text-center animate-fade-in ${
                isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
              }`}>
                <p className={isDarkMode ? 'text-gray-300 text-sm' : 'text-neutral-600 text-sm'}>
                  You will be redirected to the secure payment gateway to complete your transaction.
                </p>
              </div>
            )}

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setTermsError('');
                }}
                className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-600">
                I have read and agree to the{' '}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="text-primary-700 hover:text-primary-800 font-medium underline"
                >
                  Terms and Conditions
                </button>
                . By proceeding with payment, I acknowledge that the reservation is final and non-refundable.
              </span>
            </label>
            <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
            {termsError && <p className="text-sm text-red-600">{termsError}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePayment}
              isLoading={loading}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Pay ₱100.00
            </Button>

            <div className="flex items-center justify-center space-x-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className={isDarkMode ? 'text-gray-400' : 'text-neutral-500'}>
                Secure encrypted transaction
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};