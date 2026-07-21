import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await authApi.login({ email, password });
      // response standard properties: { accessToken, refreshToken, user }
      const token = response.accessToken;
      const refreshToken = response.refreshToken;
      const userData = response.user;

      if (token && userData) {
        login(token, refreshToken || '', userData);
        
        // Redirect according to user role
        const role = userData.role;
        if (role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'FARMER') {
          navigate('/farmer');
        } else if (role === 'BUYER') {
          navigate('/buyer');
        } else {
          navigate('/');
        }
      } else {
        setError('Login failed: Invalid server credentials response.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-gray-800/60 border border-gray-700/50 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mx-auto flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20 mb-4 text-xl">F</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Sign in to your farm dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="mr-2 rounded bg-gray-800 border-gray-700 text-green-500 focus:ring-green-500" />
              Remember me
            </label>
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors">Forgot password?</a>
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 flex justify-center"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/register" className="text-green-400 hover:text-green-300 transition-colors">Sign up here</Link>
        </div>
      </motion.div>
    </div>
  );
}
