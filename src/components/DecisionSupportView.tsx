import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Info,
  Layers,
  Scale,
  Shield,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const DecisionSupportView: React.FC = () => {
  const {
    alerts,
    simulationMode,
    setSimulationMode,
    resolveAlertWithAction,
    aircraft,
    weather,
  } = useAirspace();

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                Decision Support & Conflict Triage Workbench
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Model-Based Tactical Decision Support System (Namuduri 2023 & Belfadel et al. 2023 Section 4.2)
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSimulationMode('human')}
              className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                simulationMode === 'human'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Human Decision Mode
            </button>
            <button
              onClick={() => setSimulationMode('automation')}
              className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                simulationMode === 'automation'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Simulated Automation Mode
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The Decision System evaluates real-time outputs from the Model Library (traffic delay bounds, COPERT emissions,
          VRP routes, and NASA DFR separation margins) to synthesize actionable intervention options for human supervisors
          or autonomous execution.
        </p>
      </div>

      {/* Mode Explanation Notice (Prompt Section 17 & 18) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div
          className={`p-4 rounded-xl border transition ${
            simulationMode === 'human'
              ? 'bg-blue-950/30 border-blue-600/70 shadow-md shadow-blue-950/40'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-blue-300 font-bold">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> HUMAN DECISION MODE
            </span>
            {simulationMode === 'human' && (
              <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded">ACTIVE</span>
            )}
          </div>
          <p className="text-slate-300 text-[11px] mt-2 leading-relaxed">
            When conflict is detected, the system presents calculated Options A, B, and C with safety ratings,
            fuel penalties, and time delays. Execution requires explicit human confirmation.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition ${
            simulationMode === 'automation'
              ? 'bg-purple-950/30 border-purple-600/70 shadow-md shadow-purple-950/40'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-purple-300 font-bold">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> SIMULATED AUTOMATION MODE
            </span>
            {simulationMode === 'automation' && (
              <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded">ACTIVE</span>
            )}
          </div>
          <p className="text-slate-300 text-[11px] mt-2 leading-relaxed">
            Data → Rule Check → Risk Analysis → Automated Response → Aircraft Action.
            The engine automatically selects the optimal safety-preserving action and dispatches it via Task Push.
          </p>
        </div>
      </div>

      {/* Active Conflict Queue & Interactive Triage */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Pending Tactical Interventions ({activeAlerts.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-Time Conflict Detection Active</span>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
            <div className="font-semibold text-white text-sm">All Airspace Sectors Nominal</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No loss of separation, convective weather intrusion, or corridor congestion events currently active.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-5 bg-slate-950 border border-rose-800/80 rounded-xl space-y-4 shadow-xl shadow-rose-950/20"
              >
                {/* Alert Heading & Metrics */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-rose-300 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      {alert.type.replace('_', ' ')} • Severity: {alert.severity.toUpperCase()}
                    </span>
                    <div className="text-xs text-slate-300 mt-1">
                      Primary Involved Vessel: <strong className="text-white font-mono">{alert.primaryVehicleId}</strong>
                      {alert.secondaryVehicleId && (
                        <span> vs Secondary: <strong className="text-cyan-300 font-mono">{alert.secondaryVehicleId}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    {alert.horizontalDistanceKm && (
                      <span className="text-slate-300">Separation: <strong>{alert.horizontalDistanceKm} km</strong></span>
                    )}
                    {alert.timeToCpaSec && (
                      <span className="text-amber-400">Time to CPA: <strong>{alert.timeToCpaSec}s</strong></span>
                    )}
                  </div>
                </div>

                {/* Options A, B, C Buttons */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                    Synthesized Tactical Options (MMS Orchestrator):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {alert.recommendedActions.map((action, idx) => {
                      const letter = String.fromCharCode(65 + idx);
                      return (
                        <div
                          key={action.id}
                          className="p-3.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col justify-between space-y-3 transition"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-cyan-300">
                                OPTION {letter}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                Safety {action.safetyScorePct}%
                              </span>
                            </div>
                            <div className="font-semibold text-xs text-white">{action.title}</div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{action.description}</p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                            <div className="flex justify-between">
                              <span>Est. Delay:</span>
                              <span className="text-white">+{action.estimatedDelaySec}s</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fuel / Battery:</span>
                              <span className="text-white">{action.fuelImpactPct > 0 ? `+${action.fuelImpactPct}%` : `${action.fuelImpactPct}%`}</span>
                            </div>

                            <button
                              onClick={() => resolveAlertWithAction(alert.id, action.id)}
                              className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                            >
                              <span>SELECT OPTION {letter}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved History Audit Log */}
        {resolvedAlerts.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Recent Decision Audit Trail:
            </h4>
            <div className="space-y-1.5">
              {resolvedAlerts.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="p-2 bg-slate-950 rounded border border-slate-850 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {res.type.replace('_', ' ')}: Resolved on {res.primaryVehicleId}
                  </span>
                  <span className="text-slate-500 text-[10px]">{res.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Notice: Educational decision support simulation. Not an automatic real-world flight authorization system.</span>
        </div>
      </div>
    </div>
  );
};
