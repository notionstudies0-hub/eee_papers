import React from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Play,
  Pause,
  X,
  Zap,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const DemoMissionModal: React.FC = () => {
  const {
    demoMission,
    stopDemoMission,
    nextDemoStep,
    prevDemoStep,
    toggleDemoAutoPlay,
    simulationMode,
    setCurrentView,
  } = useAirspace();

  if (!demoMission.active) return null;

  const progressPct = ((demoMission.step + 1) / demoMission.totalSteps) * 100;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-3 lg:right-6 left-3 sm:left-auto sm:w-[440px] max-w-full bg-slate-900/95 border border-cyan-500/50 rounded-xl shadow-2xl backdrop-blur-md z-40 p-4 animate-in slide-in-from-bottom-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <span className="text-xs font-bold text-white font-display uppercase tracking-wider">
              UAS-01 Live Mission Demo
            </span>
            <span className="ml-2 text-[10px] font-mono text-cyan-400">
              Step {demoMission.step + 1} of {demoMission.totalSteps}
            </span>
          </div>
        </div>
        <button
          onClick={stopDemoMission}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
          title="Exit Demo Mission"
          aria-label="Exit Demo Mission"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step Info */}
      <div className="space-y-2 mb-3">
        <div className="text-xs sm:text-sm font-semibold text-cyan-200 flex items-center gap-1.5">
          <span>{demoMission.title}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-normal max-h-32 overflow-y-auto">
          {demoMission.narrative}
        </p>
      </div>

      {/* Mode Note */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/40 px-2.5 py-1.5 rounded border border-slate-800 mb-3">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-purple-400" />
          Mode: <strong className="text-slate-200 uppercase">{simulationMode}</strong>
        </span>
        <button
          onClick={() => setCurrentView('live_airspace')}
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline text-[10px] sm:text-[11px]"
        >
          Watch on Radar <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <button
          onClick={toggleDemoAutoPlay}
          className={`px-2.5 py-2 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition min-h-[40px] sm:min-h-0 ${
            demoMission.isAutoPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {demoMission.isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{demoMission.isAutoPlaying ? 'Auto-Advancing' : 'Auto Play'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prevDemoStep}
            disabled={demoMission.step === 0}
            className="p-2 sm:p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition min-h-[40px] sm:min-h-0"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextDemoStep}
            disabled={demoMission.step === demoMission.totalSteps - 1}
            className="px-3 py-2 sm:py-1.5 rounded-lg bg-cyan-600 text-white font-medium text-xs hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm transition min-h-[40px] sm:min-h-0"
          >
            <span>{demoMission.step === demoMission.totalSteps - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
