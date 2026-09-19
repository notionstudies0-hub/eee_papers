import React from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  HeartPulse,
  Network,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const SystemStatusView: React.FC = () => {
  const { dtMetrics, aircraft, weather, alerts } = useAirspace();

  const subsystems = [
    {
      name: 'Digital Twin Synchronizer',
      status: 'CONNECTED',
      latency: `${dtMetrics.freshnessSec} s`,
      uptime: '99.98%',
      details: 'Bidirectional state synchronization active; 0.03% model drift',
      icon: Network,
      color: 'text-emerald-400',
    },
    {
      name: 'Data Ingestion System (DIS)',
      status: 'ACTIVE',
      latency: '18 ms',
      uptime: '100%',
      details: 'Apache Kafka streaming & Fiware Orion Context Broker cluster',
      icon: RefreshCw,
      color: 'text-cyan-400',
    },
    {
      name: 'Aircraft Telemetry Stream',
      status: 'ACTIVE',
      latency: '24 Hz',
      uptime: '99.95%',
      details: `Streaming live GPS & IMU for ${aircraft.length} registered aircraft`,
      icon: Radio,
      color: 'text-blue-400',
    },
    {
      name: 'Doppler Weather Feed',
      status: 'ACTIVE',
      latency: '2.4 s',
      uptime: '99.90%',
      details: `${weather.length} monitored atmospheric micro-cells; wind shear detection enabled`,
      icon: Activity,
      color: 'text-sky-400',
    },
    {
      name: 'Urban Traffic Predictor (MMS)',
      status: 'ACTIVE',
      latency: '42 ms',
      uptime: '99.99%',
      details: 'Predicting 3D corridor travel times and junction bottlenecks',
      icon: Database,
      color: 'text-purple-400',
    },
    {
      name: 'Digital Flight Rules (DFR) Engine',
      status: 'ACTIVE',
      latency: '12 ms',
      uptime: '100%',
      details: 'Autonomous lateral & vertical separation matrix calculation',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      name: 'UAS Sidelink Mesh (RTCA)',
      status: 'ACTIVE',
      latency: '8 ms',
      uptime: '99.92%',
      details: 'Multi-hop airborne relay mesh; direct U2U communication online',
      icon: Radio,
      color: 'text-cyan-400',
    },
    {
      name: 'Decision Support Service',
      status: 'ACTIVE',
      latency: '65 ms',
      uptime: '100%',
      details: 'Multi-criteria triage engine; automated and human modes ready',
      icon: Zap,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              System Health & Subsystem Telemetry Status
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Infrastructure Observability & Ingestion Service Level Objectives (Prompt Section 25)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Comprehensive health monitoring across all cyber-physical components of the digital twin platform.
          All values represent simulated operational health telemetry calibrated to industry standards.
        </p>
      </div>

      {/* Subsystems Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subsystems.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white truncate max-w-[170px]">
                    {sub.name}
                  </span>
                  <Icon className={`w-4 h-4 ${sub.color}`} />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-400">{sub.status}</span>
                  <span className="text-[10px] font-mono text-slate-500">({sub.latency})</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sub.details}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Availability:</span>
                <span className="text-white">{sub.uptime}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Observability Server Resources Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold">
          Simulated Edge Ingestion Hardware Metrics:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400">EDGE CPU UTILIZATION</div>
            <div className="text-base font-bold text-white mt-1">14.2% (Nominal)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400">MEMORY RESIDENT</div>
            <div className="text-base font-bold text-cyan-300 mt-1">1.82 GB / 8.00 GB</div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400">KAFKA INGESTION BUFFER</div>
            <div className="text-base font-bold text-emerald-400 mt-1">0.04% Saturated</div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-[10px] text-slate-400">CERTIFICATION NOTICE</div>
            <div className="text-base font-bold text-amber-300 mt-1">Research Sandbox</div>
          </div>
        </div>
      </div>
    </div>
  );
};
