import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import authService from '../services/authService';

export const AdminLayout: React.FC = () => {
  const user = authService.getStoredUser();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};