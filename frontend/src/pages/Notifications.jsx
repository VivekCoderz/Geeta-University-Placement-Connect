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
    // Poll for notifications updates (e.g. from app advancement simulator)
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
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-cyan-400" />;
      case 'calendar':
      case 'status':
        return <Calendar className="w-5 h-5 text-violet-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
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
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
          {groupTitle}
        </h3>
        
        <div className="space-y-2.5">
          {groupItems.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex gap-4 items-start transition-all duration-200 relative group ${
                !n.read
                  ? 'bg-slate-900/60 border-slate-800 shadow-md shadow-violet-500/5'
                  : 'bg-slate-950/40 border-slate-950/80 opacity-75'
              }`}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {getNotifIcon(n.type)}
                </div>
              </div>

              {/* Message details */}
              <div className="flex-grow min-w-0 pr-10">
                <p className={`text-xs text-slate-350 leading-relaxed ${!n.read ? 'font-medium text-slate-100' : ''}`}>
                  {n.message}
                </p>
                <span className="text-[10px] text-slate-500 font-medium block mt-2">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Action items overlay on hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-500 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Mark as Read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                  title="Delete Notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="glass-panel border border-slate-800/80 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Notification Center</h1>
          <p className="text-sm text-slate-400 mt-1">Review alerts, evaluation updates, and scheduler triggers.</p>
        </div>

        {/* Global actions */}
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 px-3 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-white text-xs font-semibold text-slate-300 rounded-xl transition-all"
            >
              <MailOpen className="w-3.5 h-3.5 text-violet-400" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-3 py-2 bg-slate-900 border border-slate-850 hover:border-rose-950 text-xs font-semibold text-rose-450 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Main panel container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar: Filter Toggles */}
        <div className="glass-panel border border-slate-800/80 p-4 rounded-2xl space-y-2">
          <button
            onClick={() => setFilter('all')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-violet-900/30 text-violet-400 border border-violet-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" /> All Notifications
            </div>
            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-850">
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('unread')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread'
                ? 'bg-violet-900/30 text-violet-400 border border-violet-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <MailOpen className="w-4 h-4" /> Unread Alerts
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-violet-550/20 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Content list */}
        <div className="md:col-span-3 space-y-6">
          {displayedNotifications.length === 0 ? (
            <div className="glass-panel border border-slate-800/80 rounded-2xl p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <BellOff className="w-6 h-6" />
              </div>
              <p className="text-slate-500 text-sm">
                No {filter === 'unread' ? 'unread' : ''} notifications here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
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
