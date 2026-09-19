import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CloudRain,
  Compass,
  Layers,
  Plane,
  Radio,
  RefreshCw,
  Shield,
  ShieldCheck,
  Split,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const DashboardOverview: React.FC = () => {
  const {
    aircraft,
    weather,
    zones,
    corridors,
    alerts,
    dtMetrics,
    simulationMode,
    startDemoMission,
    demoMission,
    setCurrentView,
    setSelectedVehicleId,
    resolveAlertWithAction,
  } = useAirspace();

  const commercialCount = aircraft.filter((a) => a.category === 'commercial').length;
  const aamCount = aircraft.filter((a) => a.category === 'aam').length;
  const uasCount = aircraft.filter((a) => a.category === 'uas').length;
  const activeAlerts = alerts.filter((a) => !a.resolved);
  const activeWeather = weather.filter((w) => w.active).length;
  const activeRestrictions = zones.filter((z) => z.active).length;
  const activeCorridors = corridors.filter((c) => c.status === 'active' || c.status === 'congested').length;

  const kpis = [
    {
      title: 'Commercial Aircraft',
      value: commercialCount,
      sub: 'En-route IFR High Altitude',
      icon: Plane,
      color: 'text-blue-400',
      bg: 'bg-blue-950/30 border-blue-900/40',
      view: 'live_airspace',
    },
    {
      title: 'Active UAS (Drones)',
      value: uasCount,
      sub: 'Low Altitude (0–400ft AGL)',
      icon: Bot,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/30 border-cyan-900/40',
      view: 'autonomous_ops',
    },
    {
      title: 'AAM Vehicles',
      value: aamCount,
      sub: 'Urban eVTOL (400–3000ft)',
      icon: Compass,
      color: 'text-purple-400',
      bg: 'bg-purple-950/30 border-purple-900/40',
      view: 'traffic_mgmt',
    },
    {
      title: 'Airspace Conflicts',
      value: activeAlerts.length,
      sub: activeAlerts.length > 0 ? 'Action Required' : 'Nominal Separation',
      icon: AlertTriangle,
      color: activeAlerts.length > 0 ? 'text-rose-400' : 'text-emerald-400',
      bg: activeAlerts.length > 0 ? 'bg-rose-950/40 border-rose-800/60' : 'bg-slate-900/50 border-slate-800',
      view: 'decision_support',
    },
    {
      title: 'Weather Hazards',
      value: activeWeather,
      sub: 'Doppler Radar Monitored',
      icon: CloudRain,
      color: activeWeather > 0 ? 'text-amber-400' : 'text-slate-400',
      bg: activeWeather > 0 ? 'bg-amber-950/30 border-amber-800/40' : 'bg-slate-900/50 border-slate-800',
      view: 'live_airspace',
    },
    {
      title: 'Restricted Zones (UVR)',
      value: activeRestrictions,
      sub: 'ASTM F3548-21 Volumes',
      icon: Shield,
      color: activeRestrictions > 0 ? 'text-amber-300' : 'text-slate-400',
      bg: 'bg-slate-900/50 border-slate-800',
      view: 'air_corridors',
    },
    {
      title: 'Active Air Corridors',
      value: activeCorridors,
      sub: 'Structured 3D Skylanes',
      icon: Split,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/30 border-indigo-800/40',
      view: 'air_corridors',
    },
    {
      title: 'Autonomous Ops',
      value: 'Level 3',
      sub: 'Human-Over-The-Loop',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30 border-emerald-800/40',
      view: 'autonomous_ops',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Research Alignment & Quick Demo Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-display text-white tracking-wide">
              INTEGRATED AIRSPACE DIGITAL TWIN DASHBOARD
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              NASA/FAA DFR × MMS Framework
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Bridging the physical low-altitude airspace with a dynamic, synchronized digital model. Demonstrating
            bidirectional telemetry exchange, automated digital flight rules, air corridors, and multi-model decision orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (!demoMission.active) startDemoMission();
              setCurrentView('live_airspace');
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-900/40 flex items-center gap-2 transition"
          >
            <Radio className="w-4 h-4" />
            <span>Launch 16-Step Demo Mission</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => setCurrentView(kpi.view as any)}
              className={`p-4 rounded-xl border ${kpi.bg} cursor-pointer hover:border-slate-600 transition group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="mt-2.5">
                <div className="text-2xl font-bold font-mono text-white tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 1 / 27 / 38: The Closed-Loop Feedback Architecture Flow */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Continuous Closed-Loop Digital Twin Architecture
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Pipeline: 24 Hz</span>
            <span className="text-slate-600">•</span>
            <span>Freshness: {dtMetrics.freshnessSec}s</span>
          </div>
        </div>

        {/* Interactive Step Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500/50 transition">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">1. REAL AIRSPACE</span>
            <Plane className="w-4 h-4 text-slate-300" />
            <span className="text-[11px] text-slate-300 font-medium">Aircraft / UAS</span>
            <span className="text-[9px] text-slate-400">Sensors & GPS</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500/50 transition">
            <span className="text-[10px] font-mono text-blue-400 font-bold">2. INGESTION (DIS)</span>
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[11px] text-slate-300 font-medium">Kafka & Broker</span>
            <span className="text-[9px] text-slate-400">Context Entities</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500/50 transition">
            <span className="text-[10px] font-mono text-indigo-400 font-bold">3. DIGITIZED AIRSPACE</span>
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] text-slate-300 font-medium">Structured States</span>
            <span className="text-[9px] text-slate-400">Zones, Telemetry</span>
          </div>

          <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-lg flex flex-col items-center justify-center gap-1.5 shadow-sm shadow-purple-900/20">
            <span className="text-[10px] font-mono text-purple-300 font-bold">4. DIGITAL TWIN</span>
            <Workflow className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] text-purple-200 font-semibold">Virtual Replica</span>
            <span className="text-[9px] text-purple-300/80">Continuous Sync</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500/50 transition">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">5. MMS MODELS</span>
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] text-slate-300 font-medium">VRP & Traffic</span>
            <span className="text-[9px] text-slate-400">Weather & COPERT</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500/50 transition">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">6. DFR RULES</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-medium">Separation Mgmt</span>
            <span className="text-[9px] text-slate-400">Corridor Lanes</span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500/50 transition">
            <span className="text-[10px] font-mono text-amber-400 font-bold">7. DECISION</span>
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-slate-300 font-medium">{simulationMode.toUpperCase()}</span>
            <span className="text-[9px] text-slate-400">Reroute / Throttle</span>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg flex flex-col items-center justify-center gap-1.5">
            <span className="text-[10px] font-mono text-emerald-300 font-bold">8. FEEDBACK LOOP</span>
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-emerald-200 font-semibold">UAS Actuation</span>
            <span className="text-[9px] text-emerald-300/80">Closed-Loop ↺</span>
          </div>
        </div>
      </div>

      {/* Main Split: Live Tactical Snapshot + Active Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Fleet Snapshot */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                Active Airspace Fleet Snapshot
              </h3>
              <p className="text-[11px] text-slate-400">Real-time telemetry streaming from urban sector corridor</p>
            </div>
            <button
              onClick={() => setCurrentView('live_airspace')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium hover:underline"
            >
              Open Full 3D Radar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Vehicle Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5 rounded-l-lg">Callsign / ID</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Altitude</th>
                  <th className="p-2.5">Speed</th>
                  <th className="p-2.5">Route</th>
                  <th className="p-2.5">DFR Status</th>
                  <th className="p-2.5 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {aircraft.slice(0, 5).map((plane) => (
                  <tr key={plane.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          plane.category === 'commercial'
                            ? 'bg-blue-400'
                            : plane.category === 'aam'
                            ? 'bg-purple-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      <span>{plane.callsign}</span>
                    </td>
                    <td className="p-2.5 uppercase text-slate-400 text-[10px]">{plane.category}</td>
                    <td className="p-2.5 text-slate-200">{Math.round(plane.position.altitudeFt)} ft</td>
                    <td className="p-2.5 text-slate-200">{plane.speedKts} kts</td>
                    <td className="p-2.5 text-slate-400 truncate max-w-[120px]">
                      {plane.origin} → {plane.destination}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          plane.dfrCompliant
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {plane.dfrCompliant ? 'DFR Active' : 'IFR Standard'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <button
                        onClick={() => {
                          setSelectedVehicleId(plane.id);
                          setCurrentView('live_airspace');
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Pending Actions / Decision Support Alerts */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                Decision Triage Queue
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {simulationMode.toUpperCase()} MODE
            </span>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
              <p className="font-medium text-slate-300">Airspace Clear: No Pending Interventions</p>
              <p className="text-[11px] text-slate-400">
                All UAS and AAM vessels are maintaining prescribed DFR separation in Sky Corridor Charlie.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 bg-slate-950/80 border border-rose-900/60 rounded-xl space-y-2.5 animate-in fade-in"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-300 uppercase flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Primary Vessel: <strong className="text-white font-mono">{alert.primaryVehicleId}</strong>
                    {alert.secondaryVehicleId && ` vs ${alert.secondaryVehicleId}`}
                    {alert.horizontalDistanceKm && ` (${alert.horizontalDistanceKm} km separation)`}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Available Interventions:</div>
                    {alert.recommendedActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => resolveAlertWithAction(alert.id, action.id)}
                        className="w-full text-left p-2 rounded bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-600/50 transition text-[11px] group"
                      >
                        <div className="font-medium text-slate-200 group-hover:text-cyan-200 flex items-center justify-between">
                          <span>{action.title}</span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            Safety {action.safetyScorePct}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{action.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
