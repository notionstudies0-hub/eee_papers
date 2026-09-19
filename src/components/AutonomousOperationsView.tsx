import React from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  Info,
  Layers,
  Radio,
  Shield,
  Sliders,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const AutonomousOperationsView: React.FC = () => {
  const { autonomyLevel, setAutonomyLevel, operationalIntents, aircraft, simulationMode } = useAirspace();

  const autonomyLevels = [
    {
      level: 1,
      title: 'Level 1: Human-in-the-Loop',
      desc: 'All flight intent approvals and tactical maneuvers require explicit human controller keystroke confirmation.',
    },
    {
      level: 2,
      title: 'Level 2: Human-on-the-Loop',
      desc: 'System generates tactical solutions; human operator approves or vetos within a 30-second intervention window.',
    },
    {
      level: 3,
      title: 'Level 3: Human Monitored (Current Baseline)',
      desc: 'Routine deconfliction and speed adjustments are automated under DFR; human intervenes only during unresolved emergencies.',
    },
    {
      level: 4,
      title: 'Level 4: High Autonomy (Future Target)',
      desc: 'Fully autonomous cooperative deconfliction, multi-hop routing, and dynamic airspace leasing across all PSUs.',
    },
  ];

  const workflowSteps = [
    { step: '1. MISSION INTENT', desc: 'Operator submits departure/destination flight intent', agent: 'UAS Operator' },
    { step: '2. AIRSPACE CHECK', desc: 'Corridor availability and capacity verification', agent: 'PSU Core' },
    { step: '3. WEATHER CHECK', desc: 'Convective cell & microburst risk modeling', agent: 'Weather Service' },
    { step: '4. TRAFFIC CHECK', desc: 'DSS query for conflicting 4D trajectory contracts', agent: 'DSS Sync' },
    { step: '5. RESTRICTION CHECK', desc: 'ASTM UVR volume restriction clearance', agent: 'FIMS Auth' },
    { step: '6. VALIDATION', desc: 'Route locked into shared digital ledger', agent: 'MMS Orchestrator' },
    { step: '7. DISPATCH ACTION', desc: 'Automated authorization token issued to autopilot', agent: 'Autopilot Uplink' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Autonomous Airspace Operations & Intent Pipeline
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Operational Intent Verification, DSS Discovery, and ASTM UVR Restrictions (Namuduri 2023 Section III-B)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Autonomy is the key to scaling uncrewed aviation. As thousands of simultaneous delivery UAS and passenger AAM
          vehicles enter metropolitan skies, flight planning, telemetry sharing, and no-fly zone rerouting must transition
          from manual human clearance to rigorous automated orchestration with human supervisory oversight.
        </p>
      </div>

      {/* Autonomy Level Control Panel (Prompt Section 13) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Human Supervisory Oversight Level
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Current: Level {autonomyLevel} — Human Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {autonomyLevels.map((lvl) => (
            <div
              key={lvl.level}
              onClick={() => setAutonomyLevel(lvl.level)}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                autonomyLevel === lvl.level
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-900/20'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">Level {lvl.level}</span>
                  {autonomyLevel === lvl.level && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div className="font-semibold text-xs text-cyan-200">{lvl.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{lvl.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                {autonomyLevel === lvl.level ? '● ACTIVE SETTING' : 'Click to activate'}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Notice: Autonomy level is a UI representation for this prototype, not an official FAA or NASA classification.</span>
        </div>
      </div>

      {/* 7-Step Autonomous Intent Approval Pipeline (Prompt Section 13) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
          <Workflow className="w-4 h-4 text-cyan-400" />
          Autonomous Intent Approval & Execution Workflow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs">
          {workflowSteps.map((ws, i) => (
            <div
              key={i}
              className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-mono font-bold text-cyan-400">{ws.step}</div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{ws.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{ws.agent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
