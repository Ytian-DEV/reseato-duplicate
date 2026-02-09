import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import authService from '../services/authService';

export const CustomerLayout: React.FC = () => {
  const user = authService.getStoredUser();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} />
      <main>
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">RESEATO</h3>
              <p className="text-neutral-400">
                Making restaurant reservations simple and efficient for Cebu's best dining spots.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/" className="hover:text-white transition-colors">Browse Restaurants</a></li>
                <li><a href="/my-reservations" className="hover:text-white transition-colors">My Reservations</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-neutral-400">
                <li>SM Seaside, Cebu City</li>
                <li>support@reseato.com</li>
                <li>+63 123 456 7890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2026 RESEATO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};