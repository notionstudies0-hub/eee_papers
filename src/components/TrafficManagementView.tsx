import React from 'react';
import {
  GitBranch,
  Layers,
  Plane,
  Bot,
  Compass,
  Shield,
  Clock,
  Radio,
  Share2,
  CheckCircle,
  AlertCircle,
  Database,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const TrafficManagementView: React.FC = () => {
  const { aircraft, operationalIntents, corridors, vertiports } = useAirspace();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Integrated Airspace Traffic Management (UTM / PSU / FIMS)
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Cooperative Air Traffic Architecture for UAM & UAS Operations (Namuduri 2023 Section III)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In contrast to conventional air traffic control where human controllers separate individual flights via VHF voice,
          Advanced Air Mobility relies on <strong>Providers of Services for UAM (PSU)</strong> and <strong>UAS Service Suppliers (USS)</strong>
          cooperating via the <strong>Discovery Synchronization Service (DSS)</strong> and <strong>Flight Information Management System (FIMS)</strong>.
        </p>
      </div>

      {/* Altitude Modality Stratification: UTM vs AAM vs ATM (Namuduri Fig. 3) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Airspace Stratification: Shared Resource Modalities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* UTM Tier */}
          <div className="p-4 bg-slate-950/70 border border-cyan-900/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">1. UTM (Small UAS)</span>
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">Surface to 400 ft AGL</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              High-density cargo drones and last-mile logistics. Governed by ASTM F3548 UAS Service Supplier (USS) networks
              and cooperative vehicle-to-vehicle separation.
            </p>
            <div className="text-[10px] font-mono text-cyan-400 pt-1 border-t border-slate-800">
              Active Flights: {aircraft.filter((a) => a.category === 'uas').length}
            </div>
          </div>

          {/* AAM Tier */}
          <div className="p-4 bg-purple-950/30 border border-purple-900/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-200">2. AAM (Urban Air Mobility)</span>
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">400 ft to 3,000 ft AGL</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Passenger eVTOL air shuttles and air ambulances. Governed by Providers of Services for UAM (PSU) with
              automated deconfliction and air corridors.
            </p>
            <div className="text-[10px] font-mono text-purple-300 pt-1 border-t border-purple-900/50">
              Active Flights: {aircraft.filter((a) => a.category === 'aam').length}
            </div>
          </div>

          {/* Legacy Commercial ATM */}
          <div className="p-4 bg-slate-950/70 border border-blue-900/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-300">3. Commercial Aviation (ATM)</span>
              <Plane className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white">18,000 ft to 40,000 ft</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard civil airliners operating under FAA Instrument Flight Rules (IFR) with Class A/B/C terminal air traffic control.
            </p>
            <div className="text-[10px] font-mono text-blue-400 pt-1 border-t border-slate-800">
              Active Flights: {aircraft.filter((a) => a.category === 'commercial').length}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Intents (OI) Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Active Operational Intents (OI) Registry
            </h3>
            <p className="text-[11px] text-slate-400">
              Pre-flight deconfliction contracts submitted to PSU and synchronized across DSS
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> FIMS Authentication Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">OI ID</th>
                <th className="p-2.5">Vehicle Track</th>
                <th className="p-2.5">State</th>
                <th className="p-2.5">Departure / Arrival Window</th>
                <th className="p-2.5">Assigned PSU</th>
                <th className="p-2.5">Ceiling</th>
                <th className="p-2.5">Authorizing Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {operationalIntents.map((oi) => (
                <tr key={oi.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-2.5 font-bold text-cyan-300">{oi.id}</td>
                  <td className="p-2.5 text-white font-bold">{oi.uasId}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {oi.state}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-300">
                    {oi.departureTime} → {oi.arrivalTime}
                  </td>
                  <td className="p-2.5 text-slate-400">{oi.assignedPSU}</td>
                  <td className="p-2.5 text-slate-300">{oi.maxAltitudeFt} ft AGL</td>
                  <td className="p-2.5 text-slate-400">{oi.authorizedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
