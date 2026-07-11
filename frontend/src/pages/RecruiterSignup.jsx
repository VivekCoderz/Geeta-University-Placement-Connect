import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, User, Globe, Phone, MapPin, Briefcase, AlertCircle, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import api from '../utils/api';

const RecruiterSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticatedUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    industry: '',
    website: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (authenticatedUser) {
      if (authenticatedUser.role === 'company') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [authenticatedUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, companyName, industry, website, phone, address } = formData;
    if (!name || !email || !password || !companyName || !phone) {
      setError('Please fill in all required fields (Name, Corporate Email, Password, Company Name, Contact Phone)');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        role: 'company',
        companyName,
        industry,
        website,
        hrContactName: name,
        hrContactPhone: phone,
        address
      });

      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Company registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Floating ambient shapes - matches Student signup page */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-450/5 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-teal-450/5 blur-[100px] pointer-events-none animate-float-medium" />

      {/* Main Glassmorphic Panel */}
      <div className="max-w-2xl w-full space-y-8 bg-white border border-slate-200/80 p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-200/50 relative z-10 animate-slide-up">
        
        {isSuccess ? (
          <div className="text-center space-y-6 py-6 font-sans">
            <div className="mx-auto h-20 w-20 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-650 shadow-sm animate-bounce-short">
              <Building2 className="h-10 w-10 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Profile Submitted!
              </h2>
              <p className="text-sm font-semibold text-slate-550 max-w-md mx-auto leading-relaxed">
                Thank you for registering <strong className="text-slate-800">{formData.companyName}</strong> on PlacementConnect.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs font-semibold text-slate-600 space-y-2.5 max-w-md mx-auto">
              <p className="text-slate-800 font-bold uppercase tracking-wider text-[10px] mb-1">What happens next?</p>
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500 mt-1 flex-shrink-0" />
                <span>The Placement Cell administrator will review your recruiter account details.</span>
              </div>
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500 mt-1 flex-shrink-0" />
                <span>You will receive an email notification once your profile is approved.</span>
              </div>
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500 mt-1 flex-shrink-0" />
                <span>After approval, you can sign in using your corporate email: <strong className="text-slate-800">{formData.email}</strong>.</span>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 justify-center w-full sm:w-auto px-8 py-3.5 border border-transparent text-sm font-extrabold rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-800 hover:opacity-95 shadow-md shadow-teal-500/10 hover:shadow-lg transition-all"
              >
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-800 flex items-center justify-center shadow-md shadow-teal-550/10">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Register Company Recruiter
              </h2>
              <p className="text-sm text-slate-500 font-semibold max-w-sm mx-auto">
                Set up your placement profile on{' '}
                <span className="text-teal-650 font-extrabold">PlacementConnect</span>
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 text-rose-600 text-sm items-start">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Section 1: Recruiter Profile */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest">Recruiter Details</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recruiter Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>

                  {/* Corporate Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Corporate Email *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="e.g. hr@company.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Phone *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="phone"
                        type="text"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="HR Direct Phone"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Company Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  <h3 className="text-xs font-black text-teal-650 uppercase tracking-widest">Company Profile</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="e.g. Microsoft India"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Globe className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="e.g. https://microsoft.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Industry */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Briefcase className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="industry"
                        type="text"
                        value={formData.industry}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="e.g. Tech, consulting"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Location /HQ</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <input
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-11 block w-full py-3.5 px-4 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-semibold"
                        placeholder="e.g. Bangalore, India"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md shadow-teal-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Register Company <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-555 font-semibold">
                Already registered?{' '}
                <Link to="/login" className="text-teal-650 hover:text-teal-700 font-bold transition-colors">
                  Sign In here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterSignup;
