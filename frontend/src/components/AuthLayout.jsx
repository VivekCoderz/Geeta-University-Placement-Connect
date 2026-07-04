import React from "react";
import { ShieldCheck, GraduationCap, Building2 } from "lucide-react";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-bg-main px-4 py-12 sm:px-6 lg:px-8 font-sans">
      {/* Background blobs for premium light mode glowing orb effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full filter blur-[128px] opacity-70"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full filter blur-[128px] opacity-50"></div>
      
      {/* Main glassmorphic wrapper with enhanced depth */}
      <div className="relative w-full max-w-5xl glass-panel rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-border-light">
        
        {/* Left Side Panel - Info / Brand Showcase */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-primary via-slate-900 to-[#052152] p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 relative min-h-[600px]">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          {/* Content Group (Logo, Welcome text, Feature cards) grouped to stay vertically centered */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-8 my-auto">
            {/* GU PlacementConnect Branding with Saffron Circle Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md shadow-black/10 shrink-0">
                <GraduationCap className="w-5.5 h-5.5 text-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-tight">
                  Geeta University
                </span>
                <span className="text-[10px] text-secondary tracking-widest font-semibold uppercase leading-none mt-1 block">
                  PlacementConnect
                </span>
              </div>
            </div>

            {/* Welcome message with high-contrast slate subtitle */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {title || "Empowering Careers, Connecting Futures."}
              </h2>
              <p className="text-[#CBD5E1] text-sm leading-relaxed font-normal">
                {subtitle || "A unified portal connecting Geeta University students with top tier organizations for placement and career advancement."}
              </p>
            </div>

            {/* Cohesive group of feature cards with border, padding, and hover effects */}
            <div className="space-y-3 hidden md:block">
              <div className="flex items-start space-x-4 bg-white/[0.05] p-4 rounded-xl border border-white/10 hover:bg-white/[0.08] hover:border-secondary/30 transition-all duration-300">
                <GraduationCap className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-white text-xs font-semibold">Student Portfolio Space</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed break-words">Display CGPA, resume, projects, and academic scores.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white/[0.05] p-4 rounded-xl border border-white/10 hover:bg-white/[0.08] hover:border-secondary/30 transition-all duration-300">
                <Building2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-white text-xs font-semibold">Recruiter Portals</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed break-words">Post job profiles, shortlist applicants, and roll offers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 bg-white/[0.05] p-4 rounded-xl border border-white/10 hover:bg-white/[0.08] hover:border-secondary/30 transition-all duration-300">
                <ShieldCheck className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-white text-xs font-semibold">Placement Cell Control</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed break-words">Audit company roles, monitor stats, and coordinate rounds.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note pushed cleanly to bottom */}
          <div className="relative z-10 mt-8 pt-4 border-t border-white/5 hidden md:block">
            <p className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} Geeta University Training & Placement Cell.
            </p>
          </div>
        </div>

        {/* Right Side Panel - Spaced for better breathing room */}
        <div className="w-full md:w-7/12 px-8 py-12 md:px-14 md:py-16 bg-white flex flex-col justify-center">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default AuthLayout;
