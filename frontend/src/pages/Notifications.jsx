import React, { useState, useEffect } from 'react';
import { 
  Check, Trash2, MailOpen, Info, Calendar, 
  Briefcase, Bell, BellOff, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../utils/api';

const Notifications = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all | unread

  const fetchNotifs = async () => {
    if (user) {
      try {
        const response = await api.get('/api/notifications');
        const data = response.data;
        const mapped = (data.notifications || []).map(n => ({
          ...n,
          id: n._id
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
      case 'application_status':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'job':
      case 'job_post':
        return <Briefcase className="w-5 h-5 text-teal-600" />;
      case 'calendar':
      case 'status':
      case 'schedule_propose':
      case 'announcement':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotifIconBg = (type) => {
    switch (type) {
      case 'success':
      case 'application_status':
        return 'bg-emerald-50 border-emerald-100';
      case 'job':
      case 'job_post':
        return 'bg-teal-50 border-teal-100';
      case 'calendar':
      case 'status':
      case 'schedule_propose':
      case 'announcement':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  // Grouping notifications by date
  const groupNotificationsByDate = (notifArray) => {
    const today = [];
    const yesterday = [];
    const earlier = [];

    const todayDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    notifArray.forEach(n => {
      const nDate = new Date(n.createdAt);
      if (nDate.toDateString() === todayDate.toDateString()) {
        today.push(n);
      } else if (nDate.toDateString() === yesterdayDate.toDateString()) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  };

  // Apply filters
  const displayedNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const { today, yesterday, earlier } = groupNotificationsByDate(displayedNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationGroup = (groupTitle, groupItems) => {
    if (groupItems.length === 0) return null;

    return (
      <div className="space-y-3.5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          {groupTitle}
        </h3>
        
        <div className="space-y-3">
          {groupItems.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border flex gap-4 items-start transition-all duration-300 relative group ${
                !n.read
                  ? 'bg-emerald-50/15 border-emerald-200/80 shadow-sm shadow-emerald-600/5'
                  : 'bg-white border-slate-200/60 opacity-80'
              }`}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className={`p-2.5 rounded-xl border ${getNotifIconBg(n.type)}`}>
                  {getNotifIcon(n.type)}
                </div>
              </div>

              {/* Message details */}
              <div className="flex-grow min-w-0 pr-12">
                <p className={`text-xs text-slate-655 leading-relaxed ${!n.read ? 'font-bold text-slate-800' : 'font-medium'}`}>
                  {n.message}
                </p>
                <span className="text-[10px] text-slate-450 font-bold block mt-2">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Action items overlay on hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 text-slate-450 hover:text-emerald-600 rounded-xl transition-all shadow-sm"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-450 text-slate-450 hover:text-rose-600 rounded-xl transition-all shadow-sm"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 px-4 sm:px-6">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Review announcements, evaluation updates, and scheduler triggers.</p>
        </div>

        {/* Global actions */}
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 text-xs font-black text-slate-655 rounded-xl transition-all shadow-sm"
            >
              <MailOpen className="w-4 h-4 text-emerald-600" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-205 hover:bg-rose-50 hover:border-rose-250 text-xs font-black text-rose-600 rounded-xl transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Main panel container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar: Filter Toggles */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-3xl space-y-2 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              filter === 'all'
                ? 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" /> All Alerts
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 font-bold">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('unread')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              filter === 'unread'
                ? 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <MailOpen className="w-4 h-4" /> Unread
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Content list */}
        <div className="md:col-span-3 space-y-8">
          {displayedNotifications.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <BellOff className="w-6 h-6" />
              </div>
              <p className="text-slate-500 font-bold text-sm">
                No {filter === 'unread' ? 'unread' : ''} notifications here.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-up">
              {renderNotificationGroup('Today', today)}
              {renderNotificationGroup('Yesterday', yesterday)}
              {renderNotificationGroup('Earlier', earlier)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
