import React from 'react';
import { Check, X, ClipboardCheck, Code, Users, UserCheck, CheckCircle2 } from 'lucide-react';

const Stepper = ({ currentStatus }) => {
  const steps = [
    { label: 'Applied', key: 'Applied', desc: 'Application Received', icon: ClipboardCheck },
    { label: 'Aptitude', key: 'Aptitude', desc: 'Aptitude & Technical MCQ', icon: Code },
    { label: 'GD Round', key: 'GD', desc: 'Group Discussion', icon: Users },
    { label: 'HR Round', key: 'HR', desc: 'Personal & HR Assessment', icon: UserCheck },
    { label: 'Decision', key: 'Decision', desc: 'Final Selection Status', icon: CheckCircle2 }
  ];

  const statusIndices = {
    'Applied': 0,
    'Aptitude': 1,
    'GD': 2,
    'HR': 3,
    'Selected': 4,
    'Rejected': 4
  };

  const currentIndex = statusIndices[currentStatus] ?? 0;
  const isRejected = currentStatus === 'Rejected';
  const isSelected = currentStatus === 'Selected';

  return (
    <div className="w-full py-8"> {/* Increased padding for spacing */}
      {/* Desktop Horizontal View */}
      <div className="hidden md:flex items-center w-full">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          
          let isCompleted = index < currentIndex || (index === 4 && isSelected);
          let isActive = index === currentIndex && !isCompleted;
          let isFailed = index === 4 && isRejected;

          const showLine = index < steps.length - 1;
          const lineCompleted = index < currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1 relative px-2">
                {/* Step Circle */}
                <div
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-[0_0_15px_-2px_rgba(16,185,129,0.2)]'
                      : isFailed
                      ? 'bg-rose-50 border-rose-500 text-rose-500 shadow-[0_0_15px_-2px_rgba(244,63,94,0.2)]'
                      : isActive
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-600 ring-4 ring-emerald-500/10 shadow-[0_0_15px_1px_rgba(16,185,129,0.25)] animate-pulse'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : isFailed ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>

                {/* Labels - increased top margin and spacing */}
                <div className="mt-4 text-center px-2">
                  <p
                    className={`text-sm font-bold transition-colors duration-300 ${
                      isActive
                        ? 'text-emerald-700'
                        : isCompleted
                        ? 'text-emerald-600'
                        : isFailed
                        ? 'text-rose-500'
                        : 'text-slate-500'
                    }`}
                  >
                    {index === 4 ? (isSelected ? 'Selected' : isRejected ? 'Rejected' : 'Decision') : step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight max-w-[120px] mx-auto font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connecting line */}
              {showLine && (
                <div className="flex-1 h-0.5 bg-slate-200 -mt-20 mx-[-15px] relative">
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ${
                      lineCompleted ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Vertical View */}
      <div className="md:hidden flex flex-col space-y-8 relative pl-6 border-l-2 border-slate-250 ml-5 py-2">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          let isCompleted = index < currentIndex || (index === 4 && isSelected);
          let isActive = index === currentIndex && !isCompleted;
          let isFailed = index === 4 && isRejected;

          return (
            <div key={step.key} className="relative flex items-start gap-5">
              {/* Timeline dot */}
              <div
                className={`absolute left-[-35px] w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-550 border-emerald-550 text-white'
                    : isFailed
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : isActive
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : 'bg-white border-slate-250 text-slate-350'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isFailed ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>

              {/* Detail list item - increased padding for cards */}
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <StepIcon
                    className={`w-4.5 h-4.5 ${
                      isActive
                        ? 'text-emerald-600'
                        : isCompleted
                        ? 'text-emerald-600'
                        : isFailed
                        ? 'text-rose-500'
                        : 'text-slate-450'
                    }`}
                  />
                  <h4
                    className={`text-sm font-bold ${
                      isActive
                        ? 'text-emerald-700'
                        : isCompleted
                        ? 'text-emerald-600'
                        : isFailed
                        ? 'text-rose-500'
                        : 'text-slate-700'
                    }`}
                  >
                    {index === 4 ? (isSelected ? 'Selected' : isRejected ? 'Rejected' : 'Decision') : step.label}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
                
                {isActive && (
                  <span className="inline-flex items-center gap-1 mt-3 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-250 px-2.5 py-0.5 rounded-full font-bold">
                    Current Stage
                  </span>
                )}
                {isCompleted && index === 4 && (
                  <span className="inline-flex items-center gap-1 mt-3 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                    Offer Secured 🎉
                  </span>
                )}
                {isFailed && (
                  <span className="inline-flex items-center gap-1 mt-3 text-[10px] bg-rose-50 text-rose-550 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                    Rejected
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
