import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import api from '../utils/api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'company') {
        navigate('/recruiter/dashboard');
      } else if (user.role === 'placementCell') {
        navigate('/placement/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const loginRes = response.data;

      const { token } = loginRes.data;
      localStorage.setItem('token', token);

      const meResponse = await api.get('/api/auth/me');
      const meRes = meResponse.data;

      const combinedUser = {
        ...meRes.data.user,
        ...meRes.data.details,
        id: meRes.data.user._id || meRes.data.user.id,
      };

      localStorage.setItem('user', JSON.stringify(combinedUser));
      dispatch(setUser(combinedUser));
      
      if (combinedUser.role === 'company') {
        navigate('/recruiter/dashboard');
      } else if (combinedUser.role === 'placementCell') {
        navigate('/placement/dashboard');
      } else if (combinedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-16 px-6 sm:px-8 relative overflow-hidden text-[#4B5563]">
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#22C55E]/10 blur-[100px] pointer-events-none z-0 animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-[#7C3AED]/8 blur-[100px] pointer-events-none z-0 animate-float-medium" />

      {/* Main Login Card */}
      <div className="max-w-md w-full space-y-8 bg-white border border-[#E5E7EB] p-10 sm:p-12 rounded-2xl shadow-xl relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="text-center space-y-3 animate-slide-up animation-delay-100">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-[#22C55E] flex items-center justify-center shadow-md">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold text-[#111827] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-[#4B5563]">
            Sign in to your student account on{' '}
            <span className="text-[#22C55E] font-bold">PlacementConnect</span>
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex gap-3 text-rose-650 text-sm items-start animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <p className="font-semibold text-rose-600">{error}</p>
          </div>
        )}

        {/* Form Area */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Field */}
            <div className="animate-slide-up animation-delay-100">
              <label htmlFor="email" className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:bg-white rounded-xl text-[#111827] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] transition-all text-sm font-medium"
                  placeholder="student@university.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-slide-up animation-delay-200">
              <label htmlFor="password" className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:bg-white rounded-xl text-[#111827] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Hint details */}
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] animate-slide-up animation-delay-200">
            <span className="italic font-medium">Demo user: student@pc.com / password123</span>
          </div>

          {/* Submit Button */}
          <div className="animate-slide-up animation-delay-300">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#22C55E] hover:bg-[#16A34A] focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Signup Redirect links */}
        <div className="text-center mt-6 space-y-2.5 animate-slide-up animation-delay-300">
          <p className="text-sm text-[#4B5563] font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#22C55E] hover:text-[#16A34A] font-semibold transition-colors">
              Register here
            </Link>
          </p>
          <p className="text-xs text-[#94A3B8] font-medium border-t border-[#E5E7EB] pt-4">
            Are you a recruiter?{' '}
            <Link to="/recruiter/signup" className="text-[#7C3AED] hover:text-[#5B21B6] font-semibold transition-colors">
              Register your company
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
