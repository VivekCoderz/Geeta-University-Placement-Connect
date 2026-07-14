import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Building2, Briefcase, Users, Calendar, DollarSign, Award, Check, X, AlertCircle, 
  RefreshCw, CheckCircle2, XCircle, Search, Filter, GraduationCap, ShieldAlert,
  UserCheck, UserX, ToggleLeft, ToggleRight, Power
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  // States
  const [activeTab, setActiveTab] = useState('overview'); // overview | companies | students | drives
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    totalCompanies: 0,
    pendingCompanies: 0,
    activeJobs: 0,
    totalOffers: 0,
    placementRate: 0
  });
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // id of row being processed

  // Search & Filter States
  const [companySearch, setCompanySearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all'); // all | pending | approved
  
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranch, setStudentBranch] = useState('All');
  const [studentStatus, setStudentStatus] = useState('all'); // all | placed | unplaced | suspended

  const [driveSearch, setDriveSearch] = useState('');
  const [driveStatus, setDriveStatus] = useState('all'); // all | active | closed

  // Success / Error alerts
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      const res = await api.get('/api/admin/stats');
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await api.get('/api/admin/companies');
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/admin/students');
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  // Fetch all drives
  const fetchDrives = async () => {
    try {
      const res = await api.get('/api/placement/drives');
      setDrives(res.data.drives || []);
    } catch (err) {
      console.error('Error fetching drives:', err);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await Promise.all([
        fetchStats(),
        fetchCompanies(),
        fetchStudents(),
        fetchDrives()
      ]);
    } catch (err) {
      setErrorMsg('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Show temporary toast messages
  const triggerNotification = (success, message) => {
    if (success) {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Actions
  const handleApproveCompany = async (companyId) => {
    setActionLoading(companyId);
    try {
      const res = await api.post('/api/admin/companies/approve', { companyId });
      triggerNotification(true, res.data.message || 'Company approved successfully!');
      // Refresh data
      await Promise.all([fetchCompanies(), fetchStats()]);
    } catch (err) {
      triggerNotification(false, err.response?.data?.message || 'Failed to approve company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to suspend/reject this company and its recruiter account?')) return;
    setActionLoading(companyId);
    try {
      const res = await api.post('/api/admin/companies/reject', { companyId });
      triggerNotification(true, res.data.message || 'Company suspended successfully!');
      await Promise.all([fetchCompanies(), fetchStats()]);
    } catch (err) {
      triggerNotification(false, err.response?.data?.message || 'Failed to suspend company');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await api.post(`/api/admin/users/${userId}/toggle-active`);
      triggerNotification(true, res.data.message || 'User status updated successfully!');
      await Promise.all([fetchStudents(), fetchCompanies(), fetchStats()]);
    } catch (err) {
      triggerNotification(false, err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleJobStatus = async (jobId) => {
    setActionLoading(jobId);
    try {
      const res = await api.post(`/api/admin/jobs/${jobId}/toggle-status`);
      triggerNotification(true, res.data.message || 'Job drive status updated!');
      await Promise.all([fetchDrives(), fetchStats()]);
    } catch (err) {
      triggerNotification(false, err.response?.data?.message || 'Failed to update job status');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter computations
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      company.recruiterEmail.toLowerCase().includes(companySearch.toLowerCase());
    
    if (companyFilter === 'approved') return matchesSearch && company.approved;
    if (companyFilter === 'pending') return matchesSearch && !company.approved;
    return matchesSearch;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesBranch = studentBranch === 'All' || student.branch === studentBranch;

    const userIsActive = student.userId?.isActive !== false;
    let matchesStatus = true;
    if (studentStatus === 'placed') matchesStatus = student.isPlaced;
    if (studentStatus === 'unplaced') matchesStatus = !student.isPlaced;
    if (studentStatus === 'suspended') matchesStatus = !userIsActive;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const filteredDrives = drives.filter(drive => {
    const companyName = drive.companyId?.name || '';
    const matchesSearch = drive.title.toLowerCase().includes(driveSearch.toLowerCase()) ||
      companyName.toLowerCase().includes(driveSearch.toLowerCase());

    if (driveStatus === 'active') return matchesSearch && drive.status === 'active';
    if (driveStatus === 'closed') return matchesSearch && drive.status === 'closed';
    return matchesSearch;
  });

  const branchesList = ['All', ...new Set(students.map(s => s.branch))];

  const branchStats = Object.entries(
    students.reduce((acc, student) => {
      const br = student.branch || 'Unknown';
      if (!acc[br]) {
        acc[br] = { branch: br, placed: 0, total: 0 };
      }
      acc[br].total += 1;
      if (student.isPlaced) {
        acc[br].placed += 1;
      }
      return acc;
    }, {})
  ).map(([branch, data]) => ({
    branch,
    placed: data.placed,
    total: data.total,
    rate: data.total > 0 ? Math.round((data.placed / data.total) * 100) : 0
  })).sort((a, b) => b.rate - a.rate);

  return (
    <div className="space-y-10 animate-slide-up text-[#4B5563]">
      {/* Alert Notices */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-[#22C55E] px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-[#22C55E]/20 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#22C55E]" />
          <span className="text-sm font-bold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-rose-200 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span className="text-sm font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] flex items-center gap-3">
            Admin <span className="text-[#7C3AED]">Control Panel</span>
          </h1>
          <p className="text-[#4B5563] mt-1.5 text-sm">Manage students, company approvals, job drives, and system parameters.</p>
        </div>
        <button
          onClick={loadAllData}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-white hover:bg-[#F8FAFC] text-[#4B5563] px-5 py-3 rounded-xl border border-[#E5E7EB] shadow-sm transition-all text-sm font-semibold active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placement Rate Card */}
        <div className="bg-white border border-[#E5E7EB] shadow-sm p-6 rounded-2xl relative overflow-hidden group hover:border-[#22C55E]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">Active</span>
          </div>
          <div className="mt-5">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">{stats.placementRate}%</p>
            <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mt-1.5">Placement Rate</p>
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white border border-[#E5E7EB] shadow-sm p-6 rounded-2xl relative overflow-hidden group hover:border-[#7C3AED]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#94A3B8]">Total Profiled</span>
          </div>
          <div className="mt-5">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">
              {stats.placedStudents} <span className="text-[#94A3B8] text-xs font-semibold">/ {stats.totalStudents}</span>
            </p>
            <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mt-1.5">Placed / Total Students</p>
          </div>
        </div>

        {/* Registered Companies */}
        <div className="bg-white border border-[#E5E7EB] shadow-sm p-6 rounded-2xl relative overflow-hidden group hover:border-[#7C3AED]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
              <Building2 className="w-5 h-5" />
            </div>
            {stats.pendingCompanies > 0 ? (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full animate-pulse border border-rose-200">
                {stats.pendingCompanies} Pending
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#94A3B8] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E5E7EB]">All Approved</span>
            )}
          </div>
          <div className="mt-5">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">{stats.totalCompanies}</p>
            <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mt-1.5">Recruiters / Companies</p>
          </div>
        </div>

        {/* Active Drives */}
        <div className="bg-white border border-[#E5E7EB] shadow-sm p-6 rounded-2xl relative overflow-hidden group hover:border-[#22C55E]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">
              {stats.totalOffers} Offers
            </span>
          </div>
          <div className="mt-5">
            <p className="text-2xl font-bold text-[#111827] tracking-tight">{stats.activeJobs}</p>
            <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mt-1.5">Active Job Drives</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#E5E7EB] gap-1 mt-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#94A3B8] hover:text-[#4B5563]'
          }`}
        >
          Summary Matrix
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'companies'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#94A3B8] hover:text-[#4B5563]'
          }`}
        >
          Company Partners
          {stats.pendingCompanies > 0 && (
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'students'
              ? 'border-[#7C3AED] text-[#7C3AED]'
              : 'border-transparent text-[#94A3B8] hover:text-[#4B5563]'
          }`}
        >
          Student Database
        </button>
        <button
          onClick={() => setActiveTab('drives')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'drives'
              ? 'border-[#22C55E] text-[#22C55E]'
              : 'border-transparent text-[#94A3B8] hover:text-[#4B5563]'
          }`}
        >
          Placement Drives
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
          <div className="h-10 w-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4B5563] text-sm font-semibold">Updating administration portal...</p>
        </div>
      )}

      {/* TABS CONTENT */}
      {!isLoading && (
        <div className="space-y-8">
          {/* TAB 1: SUMMARY MATRIX */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Branch placements */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl md:col-span-2 shadow-sm">
                  <h3 className="text-[#111827] font-bold text-base mb-4">Branch Placement Analytics</h3>
                  <div className="space-y-4">
                    {branchStats.map(stat => (
                      <div key={stat.branch} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-[#4B5563]">
                          <span className="bg-[#F8FAFC] text-[#111827] px-2 py-0.5 rounded-lg border border-[#E5E7EB]">{stat.branch}</span>
                          <span>{stat.placed} Placed / {stat.total} Students ({stat.rate}%)</span>
                        </div>
                        <div className="w-full bg-[#F8FAFC] h-2.5 rounded-full overflow-hidden border border-[#E5E7EB]/50">
                          <div
                            className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
                            style={{ width: `${stat.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recruiter summary */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-[#111827] font-bold text-base">Quick Actions Panel</h3>
                  <div className="space-y-3 pt-2">
                    <div className="p-4 bg-[#F8FAFC] border border-[#22C55E]/10 rounded-xl flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                      <div>
                        <p className="text-[#111827] font-bold text-sm">Approvals pending</p>
                        <p className="text-[#4B5563] text-xs mt-0.5">{stats.pendingCompanies} recruiter profiles to review</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] border border-[#7C3AED]/10 rounded-xl flex items-center space-x-3">
                      <Users className="w-5 h-5 text-[#7C3AED] flex-shrink-0" />
                      <div>
                        <p className="text-[#111827] font-bold text-sm">Placed students</p>
                        <p className="text-[#4B5563] text-xs mt-0.5">{stats.placedStudents} students have accepted offers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY REGISTRATIONS */}
          {activeTab === 'companies' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search company name or industry..."
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] focus:bg-[#F8FAFC] rounded-xl text-sm font-medium text-[#111827] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex items-center space-x-3 text-semibold">
                  <Filter className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none"
                  >
                    <option value="all" className="bg-white text-[#4B5563]">All Registrations</option>
                    <option value="pending" className="bg-white text-[#4B5563]">Pending Approvals</option>
                    <option value="approved" className="bg-white text-[#4B5563]">Approved / Active</option>
                  </select>
                </div>
              </div>

              {/* Companies Table */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Company Partner</th>
                        <th className="px-6 py-4">Industry Type</th>
                        <th className="px-6 py-4">Recruiter Details</th>
                        <th className="px-6 py-4">Account Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-sm font-semibold text-[#4B5563]">
                      {filteredCompanies.map(comp => {
                        const isUserActive = comp.recruiterId?.isActive !== false;
                        return (
                          <tr key={comp._id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-[#111827] font-bold">{comp.name}</p>
                            </td>
                            <td className="px-6 py-4 text-[#4B5563] font-medium">
                              {comp.industry || 'N/A'}
                            </td>
                            <td className="px-6 py-4 font-medium">
                              <p className="text-[#111827]">{comp.recruiterId?.name || 'Pending Profile'}</p>
                              <p className="text-[#94A3B8] text-xs font-mono mt-0.5">{comp.recruiterEmail}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                comp.approved
                                  ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
                                  : 'bg-rose-50 border border-rose-200 text-rose-600'
                              }`}>
                                {comp.approved ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                                    Approved
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    Pending
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {!comp.approved ? (
                                  <button
                                    onClick={() => handleApproveCompany(comp._id)}
                                    disabled={actionLoading === comp._id}
                                    className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRejectCompany(comp._id)}
                                    disabled={actionLoading === comp._id}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-655 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all border border-rose-250 active:scale-[0.98] disabled:opacity-50"
                                  >
                                    Deactivate
                                  </button>
                                )}

                                {comp.recruiterId && (
                                  <button
                                    onClick={() => handleToggleUserStatus(comp.recruiterId._id)}
                                    disabled={actionLoading === comp.recruiterId._id}
                                    title={isUserActive ? "Suspend login" : "Activate login"}
                                    className={`p-2 rounded-xl border transition-all ${
                                      isUserActive
                                        ? 'bg-[#F8FAFC] hover:bg-rose-50 border border-[#E5E7EB] text-[#94A3B8] hover:text-rose-600'
                                        : 'bg-rose-50 hover:bg-emerald-50 border border-rose-200 text-rose-600 hover:text-[#22C55E]'
                                    }`}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredCompanies.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-12 text-[#94A3B8] font-semibold italic">
                            No companies found matching search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENTS DATABASE */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search student name, roll number, or email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] focus:bg-[#F8FAFC] rounded-xl text-sm font-medium text-[#111827] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Filter className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  <select
                    value={studentBranch}
                    onChange={(e) => setStudentBranch(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none"
                  >
                    {branchesList.map(branch => (
                      <option key={branch} value={branch} className="bg-white text-[#4B5563]">Branch: {branch}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <Filter className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  <select
                    value={studentStatus}
                    onChange={(e) => setStudentStatus(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none"
                  >
                    <option value="all" className="bg-white text-[#4B5563]">All Placement Status</option>
                    <option value="placed" className="bg-white text-[#4B5563]">Placed Only</option>
                    <option value="unplaced" className="bg-white text-[#4B5563]">Unplaced Only</option>
                    <option value="suspended" className="bg-white text-[#4B5563]">Suspended Accounts</option>
                  </select>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Roll Number</th>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Academic details</th>
                        <th className="px-6 py-4">Placement status</th>
                        <th className="px-6 py-4">Account Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-sm font-semibold text-[#4B5563]">
                      {filteredStudents.map(student => {
                        const isUserActive = student.userId?.isActive !== false;
                        return (
                          <tr key={student._id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                            <td className="px-6 py-4 text-[#4B5563] font-mono text-xs font-bold">
                              {student.rollNumber}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[#111827] font-bold">{student.name}</p>
                              <p className="text-[#94A3B8] text-xs font-mono mt-0.5">{student.email}</p>
                            </td>
                            <td className="px-6 py-4 font-medium">
                              <div className="flex items-center space-x-3">
                                <span className="bg-[#F8FAFC] text-[#4B5563] px-2 py-0.5 rounded-lg text-xs font-bold border border-[#E5E7EB]">
                                  {student.branch}
                                </span>
                                <span className="text-[#111827]">
                                  CGPA: {student.cgpa}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                student.isPlaced
                                  ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
                                  : 'bg-amber-50 border border-amber-200 text-amber-600'
                              }`}>
                                <GraduationCap className="w-3.5 h-3.5" />
                                {student.isPlaced ? 'Placed' : 'Unplaced'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                isUserActive
                                  ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
                                  : 'bg-rose-50 border border-rose-200 text-rose-600'
                              }`}>
                                {isUserActive ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3.5 h-3.5" />
                                    Suspended
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {student.userId ? (
                                  <button
                                    onClick={() => handleToggleUserStatus(student.userId._id)}
                                    disabled={actionLoading === student.userId._id}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                      isUserActive
                                        ? 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600'
                                        : 'bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/20 text-[#22C55E]'
                                    }`}
                                  >
                                    {isUserActive ? (
                                      <>
                                        <UserX className="w-3.5 h-3.5 text-rose-600" />
                                        Suspend
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                                        Activate
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-[#94A3B8] text-xs italic font-medium">No Auth Account</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-12 text-[#94A3B8] font-semibold italic">
                            No students found matching filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLACEMENT DRIVES */}
          {activeTab === 'drives' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search drive title or company name..."
                    value={driveSearch}
                    onChange={(e) => setDriveSearch(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-[#E5E7EB] focus:bg-[#F8FAFC] rounded-xl text-sm font-medium text-[#111827] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Filter className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  <select
                    value={driveStatus}
                    onChange={(e) => setDriveStatus(e.target.value)}
                    className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4B5563] focus:ring-4 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] focus:outline-none"
                  >
                    <option value="all" className="bg-white text-[#4B5563]">All Drives Status</option>
                    <option value="active" className="bg-white text-[#4B5563]">Active Drives Only</option>
                    <option value="closed" className="bg-white text-[#4B5563]">Closed Drives Only</option>
                  </select>
                </div>
              </div>

              {/* Drives Table */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Job Title</th>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Package (CTC)</th>
                        <th className="px-6 py-4">Eligibility</th>
                        <th className="px-6 py-4">Deadline</th>
                        <th className="px-6 py-4">Drive Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-sm font-semibold text-[#4B5563]">
                      {filteredDrives.map(drive => (
                        <tr key={drive._id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-[#111827] font-bold">{drive.title}</p>
                          </td>
                          <td className="px-6 py-4 text-[#4B5563] font-medium">
                            {drive.companyId?.name || 'Deleted Company'}
                          </td>
                          <td className="px-6 py-4 font-bold text-[#22C55E]">
                            {drive.package} LPA
                          </td>
                          <td className="px-6 py-4 font-medium">
                            <div className="flex flex-col space-y-1 text-xs text-[#4B5563]">
                              <span>Min CGPA: <strong className="text-[#111827]">{drive.eligibility?.cgpa}</strong></span>
                              <span>Branches: <strong className="text-[#111827]">{drive.eligibility?.branches?.join(', ') || 'All'}</strong></span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#94A3B8] text-xs font-medium font-mono">
                            {new Date(drive.deadline).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              drive.status === 'active'
                                ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]'
                                : 'bg-[#F8FAFC] border border-[#E5E7EB] text-[#94A3B8]'
                            }`}>
                              {drive.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleToggleJobStatus(drive._id)}
                                disabled={actionLoading === drive._id}
                                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                  drive.status === 'active'
                                    ? 'bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600'
                                    : 'bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/20 text-[#22C55E]'
                                }`}
                              >
                                {drive.status === 'active' ? (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    Close Drive
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                                    Reopen Drive
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredDrives.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center py-12 text-[#94A3B8] font-semibold italic">
                            No placement drives found matching search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
