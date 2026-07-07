import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Info, Briefcase, Calendar } from 'lucide-react';
import * as storage from '../utils/storage';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = () => {
    if (user) {
      const allNotifs = storage.getNotifications();
      const userNotifs = allNotifs.filter(n => !n.userId || n.userId === user.id);
      setNotifications(userNotifs);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 2000);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    storage.markAllNotificationsRead();
    fetchNotifications();
  };

  const handleMarkOneRead = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    storage.markNotificationRead(id);
    fetchNotifications();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-teal-600" />;
      case 'calendar':
      case 'status':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-all duration-200 focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between p-4.5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4.5 border-b border-slate-100/80 flex gap-3.5 hover:bg-slate-50/50 transition-colors ${
                    !notif.read ? 'bg-emerald-50/10' : ''
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-150">
                      {getNotifIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-xs text-slate-650 leading-relaxed ${!notif.read ? 'font-semibold text-slate-800' : ''}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!notif.read && (
                        <button
                          onClick={(e) => handleMarkOneRead(e, notif.id)}
                          className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center py-4 text-xs font-bold text-slate-500 hover:text-slate-850 bg-slate-50 hover:bg-slate-100 border-t border-slate-100 transition-colors"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
