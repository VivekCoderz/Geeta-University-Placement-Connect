import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockJobs } from '../data/mockJobs';
import Stepper from '../components/Stepper';
import * as storage from '../utils/storage';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showSimulator, setShowSimulator] = useState({});

  const fetchApplicationsData = () => {
    const allApps = storage.getApplications();
    const studentApps = allApps.filter(a => a.studentId === user.id);
    setApplications(studentApps);
    setJobs(mockJobs);
  };

  useEffect(() => {
    fetchApplicationsData();
  }, [user]);

  const getJobDetails = (jobId) => {
    return jobs.find(j => j.id === jobId) || {};
  };

  const handleSimulateStatus = (appId, nextStatus) => {
    const allApps = storage.getApplications();
    const idx = allApps.findIndex(a => a.id === appId);
    if (idx !== -1) {
      const app = allApps[idx];
      const job = getJobDetails(app.jobId);
      
      allApps[idx].status = nextStatus;
      localStorage.setItem('pc_applications', JSON.stringify(allApps));
      fetchApplicationsData();

      let msg = '';
      let type = 'info';
      if (nextStatus === 'Aptitude') {
        msg = `Evaluation Update: You have been shortlisted for the Aptitude/Coding test for ${job.title} at ${job.companyName}.`;
        type = 'calendar';
      } else if (nextStatus === 'GD') {
        msg = `Evaluation Update: You have cleared the Aptitude round. A Group Discussion has been scheduled for ${job.companyName}.`;
        type = 'calendar';
      } else if (nextStatus === 'HR') {
        msg = `Evaluation Update: Congratulations! You are selected for the final HR round for ${job.title} at ${job.companyName}.`;
        type = 'success';
      } else if (nextStatus === 'Selected') {
        msg = `🎉 CONGRATULATIONS! You have been Selected for the ${job.title} position at ${job.companyName} with a package of ${job.package} LPA!`;
        type = 'success';
      } else if (nextStatus === 'Rejected') {
        msg = `Application Update: Unfortunately, your application for ${job.title} at ${job.companyName} was not selected in the recent evaluation round.`;
        type = 'status';
      }
      
      storage.addNotification(user.id, msg, type);
    }
  };

  const toggleSimulatorDrawer = (appId) => {
    setShowSimulator(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  return (
    <div className="space-y-8"> {/* Expanded gap */}
      {/* Banner */}
      <div className="bg-white border border-slate-205 p-8 rounded-3xl shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-slate-500 font-semibold mt-1.5">
          Track the evaluation progress of your active placement and internship drives.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center space-y-5 shadow-sm animate-slide-up">
          <p className="text-slate-450 text-sm font-semibold">
            You haven't applied to any job drives yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/10"
          >
            Explore Active Drives <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up"> {/* Expanded spacing */}
          {applications.map((app) => {
            const job = getJobDetails(app.jobId);
            const isDrawerOpen = !!showSimulator[app.id];

            return (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
              >
                {/* Top Section - increased padding to p-8 */}
                <div className="p-8 bg-slate-50/50 border-b border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs flex-shrink-0">
                      {job.companyName ? job.companyName.substring(0, 2).toUpperCase() : 'PC'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">{job.companyName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold">Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800 mt-1">{job.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-xs font-bold text-slate-500">
                      Package: <span className="text-slate-800 font-extrabold">{job.package} LPA</span>
                    </span>

                    {/* Simulator Trigger button */}
                    <button
                      onClick={() => toggleSimulatorDrawer(app.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-500/50 rounded-xl text-[10px] text-slate-500 hover:text-emerald-750 font-bold transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Simulate Stage
                    </button>
                  </div>
                </div>

                {/* Stepper block - increased padding */}
                <div className="p-8 md:p-10 bg-white">
                  <Stepper currentStatus={app.status} />
                </div>

                {/* Simulator Drawer Panel */}
                {isDrawerOpen && (
                  <div className="p-6 bg-slate-50 border-t border-slate-200/80 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 animate-spin" /> Stage Evaluation Simulator
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Advance stages or trigger selection/rejection outcomes to inspect the tracker UI and notifications.
                        </p>
                      </div>

                      {/* Simulator buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSimulateStatus(app.id, 'Applied')}
                          disabled={app.status === 'Applied'}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-350 disabled:opacity-50 text-[10px] text-slate-650 font-bold rounded-xl transition-colors shadow-sm"
                        >
                          Applied
                        </button>
                        <button
                          onClick={() => handleSimulateStatus(app.id, 'Aptitude')}
                          disabled={app.status === 'Aptitude'}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-350 disabled:opacity-50 text-[10px] text-slate-650 font-bold rounded-xl transition-colors shadow-sm"
                        >
                          Aptitude
                        </button>
                        <button
                          onClick={() => handleSimulateStatus(app.id, 'GD')}
                          disabled={app.status === 'GD'}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-350 disabled:opacity-50 text-[10px] text-slate-650 font-bold rounded-xl transition-colors shadow-sm"
                        >
                          GD Round
                        </button>
                        <button
                          onClick={() => handleSimulateStatus(app.id, 'HR')}
                          disabled={app.status === 'HR'}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-350 disabled:opacity-50 text-[10px] text-slate-650 font-bold rounded-xl transition-colors shadow-sm"
                        >
                          HR Round
                        </button>
                        <button
                          onClick={() => handleSimulateStatus(app.id, 'Selected')}
                          disabled={app.status === 'Selected'}
                          className="px-3.5 py-2 bg-emerald-50 border border-emerald-250 hover:bg-emerald-100 disabled:opacity-50 text-[10px] text-emerald-700 font-extrabold rounded-xl flex items-center gap-1 transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Select
                        </button>
                        <button
                          onClick={() => handleSimulateStatus(app.id, 'Rejected')}
                          disabled={app.status === 'Rejected'}
                          className="px-3.5 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 disabled:opacity-50 text-[10px] text-rose-600 font-extrabold rounded-xl flex items-center gap-1 transition-all shadow-sm"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
