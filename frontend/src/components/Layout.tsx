import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-green-500 selection:text-white">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/70 border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20">F</div>
                <span className="font-bold text-xl tracking-tight text-white">FarmPlatform</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link to="/" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
              <button 
                onClick={logout}
                className="bg-gray-800 hover:bg-red-500/20 hover:text-red-400 border border-gray-700 hover:border-red-500/50 text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Logout (Mock)
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
