import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  FastForward,
  Info,
  Radio,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const DigitalFlightRulesView: React.FC = () => {
  const {
    aircraft,
    triggerLeadUasDeceleration,
    simulationMode,
    resolveAlertWithAction,
    alerts,
  } = useAirspace();

  const uas1 = aircraft.find((a) => a.id === 'UAS-01');
  const uas2 = aircraft.find((a) => a.id === 'UAS-02');

  const uas1Speed = uas1?.speedKts || 48;
  const uas2Speed = uas2?.speedKts || 52;
  const separationDistanceMeters = uas1 && uas2
    ? Math.round(
        Math.sqrt(
          Math.pow(uas1.position.x - uas2.position.x, 2) + Math.pow(uas1.position.y - uas2.position.y, 2)
        ) * 18
      )
    : 1400;

  const isSeparationRisk = uas1Speed < 35 && uas2Speed >= 40 && separationDistanceMeters < 1600;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              NASA / FAA Digital Flight Rules (DFR) Engine
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Cooperative Airborne Self-Separation & Speed Control (Namuduri 2023 Section IV & Wing et al. 2022)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          NASA defines <strong>Digital Flight Rules</strong> as a set of regulations authorizing sustained Digital Flight
          as an alternative means of separation in Visual (VMC) and Instrumental (IMC) conditions, removing direct human ATC
          tactical separation dependency through machine-to-machine cooperative self-separation.
        </p>
      </div>

      {/* Interactive Separation Demonstration (Prompt Section 10) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Demonstration: In-Corridor Following Separation
            </h3>
            <p className="text-[11px] text-slate-400">
              Corridor Charlie Northbound Lane • Lead vessel throttles speed → Following vessel cooperatively adapts
            </p>
          </div>
          <button
            onClick={triggerLeadUasDeceleration}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              uas1Speed < 35
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{uas1Speed < 35 ? 'Accelerate Lead UAS-01' : 'Throttle Lead UAS-01 Speed'}</span>
          </button>
        </div>

        {/* Visual Lane Simulation Track */}
        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">SKY CORRIDOR CHARLIE — LANE C-NORTH (600ft AGL)</span>
            <span className="text-cyan-400 font-bold">
              Current Separation: {separationDistanceMeters} meters
            </span>
          </div>

          {/* Lane Bar with Aircraft Positions */}
          <div className="relative h-16 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center px-6 overflow-hidden">
            {/* Lane Centerline */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-cyan-500/40" />

            {/* UAS-01 (Lead) */}
            <div
              className="absolute flex items-center gap-2 transition-all duration-500"
              style={{ left: '65%' }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="font-mono text-[11px]">
                <div className="font-bold text-white">UAS-01 (Lead)</div>
                <div className="text-cyan-300">{uas1Speed} kts (Target: {uas1?.targetSpeedKts || 50}kts)</div>
              </div>
            </div>

            {/* UAS-02 (Following) */}
            <div
              className="absolute flex items-center gap-2 transition-all duration-500"
              style={{ left: '25%' }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 shadow-md shadow-purple-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="font-mono text-[11px]">
                <div className="font-bold text-white">UAS-02 (Follower)</div>
                <div className={isSeparationRisk ? 'text-rose-400 font-bold animate-pulse' : 'text-purple-300'}>
                  {uas2Speed} kts
                </div>
              </div>
            </div>
          </div>

          {/* Separation Rule Engine Status */}
          {isSeparationRisk ? (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-lg space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  SEPARATION EVENT DETECTED: Following Velocity Exceeds Buffer
                </span>
                <span className="text-[10px] font-mono text-slate-400">Rule DFR-SEP-04</span>
              </div>
              <p className="text-xs text-slate-300">
                Lead UAS-01 slowed to {uas1Speed} kts. Trailing UAS-02 speed is {uas2Speed} kts with separation closing.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => resolveAlertWithAction('ALERT-DFR-SEPARATION-01', 'ACT-DFR-SPEED')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute DFR Speed Throttle: 52 → 36 kts</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SAFE SEPARATION MAINTAINED (Cooperative Longitudinal Interval Verified)
              </span>
              <span className="text-[10px] text-slate-400">Target Margin: &gt; 1,000m</span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix: VFR vs IFR vs DFR (Namuduri Section IV) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
          Aviation Operating Modes Comparison Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-slate-300 text-sm">Visual Flight Rules (VFR)</div>
            <ul className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              <li>• <strong>Pilot Vision:</strong> 'See-and-avoid' primary control</li>
              <li>• <strong>Weather:</strong> Visual conditions (VMC) required</li>
              <li>• <strong>Scalability:</strong> Low (human eye limitation)</li>
              <li>• <strong>Decision:</strong> Human pilot in aircraft</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="font-mono font-bold text-slate-300 text-sm">Instrument Flight Rules (IFR)</div>
            <ul className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              <li>• <strong>Avionics & ATC:</strong> Ground radar & VHF controller separation</li>
              <li>• <strong>Weather:</strong> All-weather (IMC) permitted</li>
              <li>• <strong>Scalability:</strong> Medium (controller workload bottleneck)</li>
              <li>• <strong>Decision:</strong> Human Air Traffic Controller</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/50 space-y-2">
            <div className="font-mono font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Digital Flight Rules (DFR)
            </div>
            <ul className="space-y-1.5 text-slate-200 text-[11px] leading-relaxed">
              <li>• <strong>Digital Info:</strong> Machine-to-machine automated data exchange</li>
              <li>• <strong>Weather:</strong> Sustained operations in both VMC and IMC</li>
              <li>• <strong>Scalability:</strong> High (scales to 1,000s of simultaneous UAS)</li>
              <li>• <strong>Decision:</strong> Algorithmic cooperative self-separation</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Note: Research and educational simulation. Does not represent FAA-certified collision avoidance avionics.</span>
        </div>
      </div>
    </div>
  );
};
