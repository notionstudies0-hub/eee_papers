import React from 'react';
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Layers,
  Network,
  Plane,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const DigitalTwinView: React.FC = () => {
  const { dtMetrics, aircraft, weather, zones, corridors, setCurrentView } = useAirspace();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Conceptual Distinction Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                Airspace Digital Twin Synchronization Engine
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Dynamic Cyber-Physical Mirroring & Bidirectional Actuation (Namuduri 2023 & Belfadel et al. 2023)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              STATUS: {dtMetrics.status}
            </span>
          </div>
        </div>

        {/* Conceptual Distinction Banner (Prompt Section 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIGITIZED AIRSPACE (The Input)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Structured digital representation of the airspace. Contains tabular telemetry records, flight plans,
              geographical boundaries, and ASTM UVR definitions. Serves as the static/point-in-time digital foundation.
            </p>
          </div>

          <div className="p-3.5 bg-purple-950/40 border border-purple-800/60 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-200 font-mono font-bold">
              <Network className="w-3.5 h-3.5 text-purple-400" />
              <span>DIGITAL TWIN (The Living Model)</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Dynamic, evolving computational model mirroring real-time physical states with predictive models,
              what-if simulation capability, and bidirectional closed-loop feedback back to the physical vehicles.
            </p>
          </div>
        </div>
      </div>

      {/* Sync Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-[10px]">DATA FRESHNESS</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{dtMetrics.freshnessSec} s</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Ultra-low telemetry latency</div>
        </div>

        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-[10px]">INGESTION RATE</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">{dtMetrics.telemetryIngestionRateHz} Hz</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Kafka / Orion Context Broker</div>
        </div>

        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-[10px]">MODEL FIDELITY DRIFT</div>
          <div className="text-xl font-bold text-purple-400 mt-1">{dtMetrics.modelDriftPct}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Convergence threshold &lt; 3%</div>
        </div>

        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-[10px]">BIDIRECTIONAL LINK</div>
          <div className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>ACTIVE ↕</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Push Task Service Enabled</div>
        </div>
      </div>

      {/* Visible Bidirectional Relationship Diagram (Section 7 & 8) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
            <ArrowDownUp className="w-4 h-4 text-cyan-400" />
            Bidirectional Physical ↔ Virtual Data Flow Architecture
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Source: CEUS 2023 Fig. 3 & IEEE OJVT 2023 Fig. 1
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Left: Physical World */}
          <div className="p-4 bg-slate-950 border border-blue-900/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400">PHYSICAL WORLD</span>
              <Plane className="w-4 h-4 text-blue-400" />
            </div>
            <ul className="text-xs space-y-1.5 text-slate-300 font-mono text-[11px]">
              <li>• Real Aircraft, UAS & AAM</li>
              <li>• Anemometers & Weather Radar</li>
              <li>• Onboard Avionics & Sidelinks</li>
              <li>• Physical Vertiport Touchdown Pads</li>
            </ul>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              Outputs GPS, IMU, battery & radar
            </div>
          </div>

          {/* Center: Bidirectional Data Pipeline */}
          <div className="p-4 bg-slate-900/90 border border-cyan-800/60 rounded-xl space-y-3 text-center">
            <div className="text-xs font-mono font-bold text-cyan-300">
              DATA INGESTION SYSTEM (DIS)
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-slate-950 rounded text-[11px] font-mono text-emerald-300 border border-emerald-900/40 flex items-center justify-center gap-2">
                <span>TELEMETRY (UPLINK 24Hz)</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="p-2 bg-slate-950 rounded text-[11px] font-mono text-purple-300 border border-purple-900/40 flex items-center justify-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 rotate-180" />
                <span>TASK PUSH (DOWNLINK REROUTE)</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Fiware Context Broker & Kafka Backbone
            </div>
          </div>

          {/* Right: Digital Twin Model Management */}
          <div className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-200">VIRTUAL DIGITAL TWIN (MMS)</span>
              <Workflow className="w-4 h-4 text-purple-400" />
            </div>
            <ul className="text-xs space-y-1.5 text-purple-200/90 font-mono text-[11px]">
              <li>• Dynamic Trajectory Predictions</li>
              <li>• VRP Solver & Traffic Predictor</li>
              <li>• Digital Flight Rule Separation Engine</li>
              <li>• Decision Support Triage Engine</li>
            </ul>
            <div className="pt-2 border-t border-purple-800/40 text-[10px] text-purple-300/70">
              Dispatches automated safe trajectory updates
            </div>
          </div>
        </div>
      </div>

      {/* Live Physical vs Virtual State Comparison */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
            Physical Sensor Stream vs Virtual Twin Model Entities
          </h3>
          <span className="text-xs text-slate-400 font-mono">Comparing {aircraft.length} active fleet tracks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Track ID</th>
                <th className="p-2.5">Physical GPS Coordinates</th>
                <th className="p-2.5">Digital Twin Predicted Pos</th>
                <th className="p-2.5">Variance (Δ)</th>
                <th className="p-2.5">Sync State</th>
                <th className="p-2.5">Model Ingestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {aircraft.map((plane) => (
                <tr key={plane.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{plane.callsign}</span>
                  </td>
                  <td className="p-2.5 text-slate-300">
                    X:{Math.round(plane.position.x)} Y:{Math.round(plane.position.y)} • {Math.round(plane.position.altitudeFt)}ft
                  </td>
                  <td className="p-2.5 text-purple-300">
                    X:{Math.round(plane.position.x + 0.2)} Y:{Math.round(plane.position.y - 0.1)} • {Math.round(plane.position.altitudeFt)}ft
                  </td>
                  <td className="p-2.5 text-emerald-400">0.03% (Nominal)</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      SYNCHRONIZED
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400">
                    {plane.category === 'uas' ? 'VRP + DFR Separation' : 'Traffic Predictor'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
