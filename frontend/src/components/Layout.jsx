import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col overflow-x-hidden text-[#4B5563]">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-purple-500/8 blur-[130px] pointer-events-none z-0" />
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12 lg:py-14 animate-in fade-in duration-300">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E5E7EB] bg-white py-8 text-center text-xs text-[#94A3B8] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p>© 2026 PlacementConnect. All rights reserved. Designed for Student Modules.</p>
          <div className="flex items-center space-x-6 text-[11px] font-semibold text-[#94A3B8]">
            <a href="#" className="hover:text-[#22C55E] transition-colors">Privacy Policy</a>
            <span className="text-[#E5E7EB] font-normal">|</span>
            <a href="#" className="hover:text-[#22C55E] transition-colors">Terms of Service</a>
            <span className="text-[#E5E7EB] font-normal">|</span>
            <a href="#" className="hover:text-[#22C55E] transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
