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
        return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />;
      case 'job':
      case 'job_post':
        return <Briefcase className="w-5 h-5 text-[#22C55E]" />;
      case 'calendar':
      case 'status':
      case 'schedule_propose':
      case 'announcement':
        return <Calendar className="w-5 h-5 text-[#3B82F6]" />;
      default:
        return <Info className="w-5 h-5 text-[#4B5563]" />;
    }
  };

  const getNotifIconBg = (type) => {
    switch (type) {
      case 'success':
      case 'application_status':
        return 'bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'job':
      case 'job_post':
        return 'bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'calendar':
      case 'status':
      case 'schedule_propose':
      case 'announcement':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-[#F8FAFC] border-[#E5E7EB]';
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
      <div className="space-y-3.5 text-[#4B5563]">
        <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">
          {groupTitle}
        </h3>
        
        <div className="space-y-3">
          {groupItems.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-xl border flex gap-4 items-start transition-all duration-300 relative group ${
                !n.read
                  ? 'bg-white border-[#22C55E]/20 shadow-sm ring-1 ring-[#22C55E]/5'
                  : 'bg-[#F8FAFC] border-[#E5E7EB] opacity-80'
              }`}
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className={`p-2 rounded-lg border ${getNotifIconBg(n.type)} shadow-sm`}>
                  {getNotifIcon(n.type)}
                </div>
              </div>

              {/* Message details */}
              <div className="flex-grow min-w-0 pr-12">
                <p className={`text-xs leading-relaxed ${!n.read ? 'font-bold text-[#111827]' : 'font-medium text-[#4B5563]'}`}>
                  {n.message}
                </p>
                <span className="text-[9px] text-[#94A3B8] font-bold block mt-2 font-mono">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Action items overlay on hover */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="p-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#22C55E]/30 text-[#4B5563] hover:text-[#22C55E] rounded-lg transition-all shadow-sm"
                    title="Mark as Read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] hover:border-rose-500/30 text-[#4B5563] hover:text-rose-650 rounded-lg transition-all shadow-sm"
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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 text-[#4B5563]">
      {/* Header Info Banner */}
      <div className="bg-white border border-[#E5E7EB] p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#111827] tracking-tight">Notification Center</h1>
          <p className="text-xs text-[#4B5563] font-medium mt-1">Review announcements, evaluation updates, and scheduler triggers.</p>
        </div>

        {/* Global actions */}
        <div className="flex gap-2 font-semibold">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#4B5563] rounded-lg transition-all shadow-sm"
            >
              <MailOpen className="w-3.5 h-3.5 text-[#22C55E]" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E5E7EB] hover:bg-rose-50 hover:border-rose-300 text-xs font-semibold text-rose-605 rounded-lg transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Main panel container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar: Filter Toggles */}
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-xl space-y-1 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              filter === 'all'
                ? 'bg-[#22C55E] text-white font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#4B5563] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5" /> All Alerts
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors ${
              filter === 'all' ? 'bg-[#22C55E]/20 text-[#22C55E] border-transparent' : 'bg-[#F8FAFC] text-[#4B5563] border-[#E5E7EB]'
            }`}>
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('unread')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              filter === 'unread'
                ? 'bg-[#22C55E] text-white font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#4B5563] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center gap-2">
              <MailOpen className="w-3.5 h-3.5" /> Unread
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Content list */}
        <div className="md:col-span-3 space-y-8">
          {displayedNotifications.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-16 text-center space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#94A3B8] shadow-sm">
                <BellOff className="w-5 h-5" />
              </div>
              <p className="text-[#4B5563] font-bold text-xs">
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
