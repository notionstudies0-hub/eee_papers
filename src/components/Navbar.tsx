import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CloudRain,
  Compass,
  FastForward,
  Info,
  Menu,
  Pause,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Shield,
  Sliders,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const Navbar: React.FC = () => {
  const {
    simulationMode,
    setSimulationMode,
    autonomyLevel,
    setAutonomyLevel,
    isPlaying,
    setIsPlaying,
    simSpeed,
    setSimSpeed,
    dtMetrics,
    alerts,
    demoMission,
    startDemoMission,
    stopDemoMission,
    triggerWeatherHazard,
    triggerNoFlyZone,
    triggerLeadUasDeceleration,
    triggerProximityConflict,
    resetAirspaceToDefault,
    setCurrentView,
    toggleMobileMenu,
    weather,
    zones,
  } = useAirspace();

  const [showInjectMenu, setShowInjectMenu] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const activeAlertsCount = alerts.filter((a) => !a.resolved).length;
  const isWeatherActive = weather.some((w) => w.id === 'WX-MICROBURST-01' && w.active);
  const isUvrActive = zones.some((z) => z.id === 'UVR-EMERGENCY-01' && z.active);

  return (
    <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between sticky top-0 z-40 text-xs select-none">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-purple-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20 shrink-0">
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-display tracking-wider text-sm sm:text-base font-bold text-white uppercase truncate">
              AAM Digital Twin
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/50 shrink-0">
              RESEARCH PROTOTYPE
            </span>
          </div>
          <p className="hidden md:flex text-[10px] text-slate-400 font-mono items-center gap-1.5">
            <span>IEEE OJVT (Namuduri 2023)</span>
            <span className="text-slate-600">×</span>
            <span>CEUS (Belfadel et al. 2023)</span>
          </p>
        </div>
      </div>

      {/* Desktop Center Controls: Playback, Speed, Digital Twin Sync status */}
      <div className="hidden lg:flex items-center gap-2 xl:gap-4">
        {/* Digital Twin Synchronization Status */}
        <div
          onClick={() => setCurrentView('digital_twin')}
          className="cursor-pointer px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/70 hover:border-cyan-500/50 flex items-center gap-2 transition"
          title="Click to view Digital Twin synchronization telemetry"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-mono font-semibold">DT: {dtMetrics.status}</span>
          <span className="text-[10px] text-emerald-400 font-mono">({dtMetrics.freshnessSec}s lag)</span>
          <div className="h-3 w-px bg-slate-700 mx-0.5" />
          <span className="text-[10px] text-purple-300 flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-400" />
            Bidirectional
          </span>
        </div>

        {/* Simulation Play/Pause & Speed */}
        <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-0.5 px-1 font-mono text-[11px]">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                  simSpeed === speed
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            onClick={resetAirspaceToDefault}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            title="Reset Airspace to nominal baseline state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Toggle: Human Decision vs Simulated Automation */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSimulationMode('human')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition flex items-center gap-1.5 ${
              simulationMode === 'human'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3 h-3" />
            Human Mode
          </button>
          <button
            onClick={() => setSimulationMode('automation')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition flex items-center gap-1.5 ${
              simulationMode === 'automation'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            Automation Mode
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile quick simulation play button */}
        <div className="lg:hidden flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded transition min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isPlaying ? 'text-amber-400' : 'text-emerald-400'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Hazard Injector Menu */}
        <div className="relative">
          <button
            onClick={() => setShowInjectMenu(!showInjectMenu)}
            className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium transition min-h-[36px]"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Inject Hazard</span>
          </button>

          {showInjectMenu && (
            <div className="absolute right-0 mt-2 w-64 max-w-[85vw] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800 flex items-center justify-between">
                <span>Airspace Perturbations</span>
                <button
                  onClick={() => setShowInjectMenu(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  triggerWeatherHazard();
                  setShowInjectMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  Microburst Weather
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isWeatherActive ? 'bg-red-500/20 text-red-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isWeatherActive ? 'ACTIVE' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() => {
                  triggerNoFlyZone();
                  setShowInjectMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  No-Fly Zone (UVR-01)
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isUvrActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUvrActive ? 'ACTIVE' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() => {
                  triggerLeadUasDeceleration();
                  setShowInjectMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                  Throttle Lead UAS Speed
                </span>
                <span className="text-[10px] font-mono text-cyan-400">DFR</span>
              </button>

              <button
                onClick={() => {
                  triggerProximityConflict();
                  setShowInjectMenu(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  Crossing Route Traffic
                </span>
                <span className="text-[10px] font-mono text-rose-300">Conflict</span>
              </button>
            </div>
          )}
        </div>

        {/* Conflict / Alert Indicator Badge */}
        {activeAlertsCount > 0 && (
          <button
            onClick={() => setCurrentView('decision_support')}
            className="px-2 sm:px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-lg flex items-center gap-1 animate-pulse font-mono font-semibold min-h-[36px]"
            title="Pending Airspace Intervention Decisions"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px]">{activeAlertsCount}</span>
            <span className="hidden sm:inline text-[11px]">Action{activeAlertsCount > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Demo Mission Trigger */}
        <button
          onClick={() => {
            if (demoMission.active) {
              stopDemoMission();
            } else {
              startDemoMission();
            }
          }}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition min-h-[36px] ${
            demoMission.active
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/40'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {demoMission.active ? `Demo Step ${demoMission.step + 1}/16` : 'Launch Demo Mission'}
          </span>
          <span className="sm:hidden">
            {demoMission.active ? `${demoMission.step + 1}/16` : 'Demo'}
          </span>
        </button>
      </div>
    </header>
  );
};
