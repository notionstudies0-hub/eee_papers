import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudRain,
  FastForward,
  Play,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Split,
  WifiOff,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

interface ScenarioCard {
  id: string;
  number: number;
  title: string;
  category: string;
  icon: React.ElementType;
  color: string;
  currentState: string;
  event: string;
  twinUpdate: string;
  analysis: string;
  possibleResponse: string;
  result: string;
}

export const SimulationWhatIfView: React.FC = () => {
  const { executeWhatIfScenario, simulationMode, resetAirspaceToDefault } = useAirspace();
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario_normal');

  const scenarios: ScenarioCard[] = [
    {
      id: 'scenario_normal',
      number: 1,
      title: 'Scenario 1: Baseline Nominal Traffic',
      category: 'Baseline',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      currentState: 'Corridor Charlie clear; 3 UAS en-route, 2 AAM shuttles operating nominal DFR.',
      event: 'Scheduled commercial freight and passenger operations.',
      twinUpdate: 'Telemetry streaming at 24Hz with nominal 0.3s freshness and zero alerts.',
      analysis: 'VRP and Traffic models project 100% on-time arrivals.',
      possibleResponse: 'No intervention required; continue standard corridor separation.',
      result: 'Safe operations, zero delays, optimal energy consumption.',
    },
    {
      id: 'scenario_weather',
      number: 2,
      title: 'Scenario 2: Sudden Microburst Storm Hazard',
      category: 'Weather / UVR',
      icon: CloudRain,
      color: 'text-sky-400',
      currentState: 'UAS-01 cruising along Corridor Charlie at 600ft AGL towards Vertiport Beta.',
      event: 'Ground doppler detects severe 38kt wind shear centered on Corridor Spine.',
      twinUpdate: 'Weather model injects dynamic 3D UVR boundary hazard polygon in real-time.',
      analysis: 'Conflict engine identifies imminent trajectory intersection in 18 seconds.',
      possibleResponse: 'Western Bypass Corridor (+140s) vs Divert to Medical Port Delta.',
      result: 'UAS-01 rerouted safely around convective cell with zero turbulence damage.',
    },
    {
      id: 'scenario_corridor_congestion',
      number: 3,
      title: 'Scenario 3: Air Corridor Congestion Surge',
      category: 'Capacity',
      icon: Split,
      color: 'text-indigo-400',
      currentState: 'Sky Corridor Charlie running at 85% rated throughput.',
      event: 'Five additional on-demand e-commerce drones enter Spine entry gate.',
      twinUpdate: 'Corridor status transitions from ACTIVE to CONGESTED in Digital Twin.',
      analysis: 'Demand-Capacity model predicts slot starvation at 3D Roundabout.',
      possibleResponse: 'Implement entry metering and speed staggering in Lane C-North.',
      result: 'Flow smoothed, minimum 1,000m separation preserved across all vessels.',
    },
    {
      id: 'scenario_comms_failure',
      number: 4,
      title: 'Scenario 4: Direct Sidelink BRLOS Comms Loss',
      category: 'Communications',
      icon: WifiOff,
      color: 'text-amber-400',
      currentState: 'UAS-02 maintaining direct RF connection to ground station.',
      event: 'Urban skyscraper canyon creates line-of-sight signal shadowing (-92 dBm).',
      twinUpdate: 'Status changes to RELAY_MODE; multi-hop topology discovery triggered.',
      analysis: 'UAS-01 and UAS-03 detected as viable airborne relay hops.',
      possibleResponse: 'Reroute critical telemetry packets across UAS-01 to ground bridge.',
      result: 'Continuous situational awareness sustained with zero loss of telemetry.',
    },
    {
      id: 'scenario_nofly_active',
      number: 5,
      title: 'Scenario 5: Temporary No-Fly Zone (ASTM UVR-01)',
      category: 'Restricted Airspace',
      icon: ShieldAlert,
      color: 'text-rose-400',
      currentState: 'Civic Center sector open for commercial drone delivery.',
      event: 'First responder helicopter requests emergency 1,500ft UVR exclusion volume.',
      twinUpdate: 'FIMS broadcasts ASTM WK63418 restriction polygon to all active PSUs.',
      analysis: 'Three pending delivery flight paths intersect the active exclusion zone.',
      possibleResponse: 'Automatic path re-planning via outer perimeter waypoints.',
      result: 'Zero airspace encroachment; emergency medical responders operate safely.',
    },
    {
      id: 'scenario_speed_throttle',
      number: 6,
      title: 'Scenario 6: Lead Aircraft In-Corridor Deceleration',
      category: 'Digital Flight Rules',
      icon: FastForward,
      color: 'text-cyan-400',
      currentState: 'UAS-01 and UAS-02 cruising in trail at 50 kts in Lane C-North.',
      event: 'Lead UAS-01 encounters headwind gust, slowing from 48 kts to 26 kts.',
      twinUpdate: 'Telemetry shows rapidly closing longitudinal separation (< 1,200m).',
      analysis: 'DFR engine generates following aircraft deceleration requirement.',
      possibleResponse: 'Autonomous cooperative throttle command issued to UAS-02 (52 → 36 kts).',
      result: 'Longitudinal spacing stabilized at safe 1,500m buffer automatically.',
    },
    {
      id: 'scenario_vertiport_closed',
      number: 7,
      title: 'Scenario 7: Destination Vertiport Saturation',
      category: 'Infrastructure',
      icon: AlertTriangle,
      color: 'text-purple-400',
      currentState: 'Two AAM passenger aircraft en-route to Vertiport Beta.',
      event: 'Disabled ground support vehicle blocks Pad 1 and Pad 2 at Vertiport Beta.',
      twinUpdate: 'Vertiport Beta status flags CAPACITY_WARNING in Context Broker.',
      analysis: 'Inbound arrival slots exceed available physical touchdown capacity.',
      possibleResponse: 'Divert flight to Medical District Vertiport Delta (+6 min flight time).',
      result: 'Avoided unsafe holding hover; passengers redirected smoothly to nearby port.',
    },
  ];

  const currentSelected = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const CurrentIcon = currentSelected.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              What-If Scenario Simulation Engine
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Predictive & Reactive Experimentation Suite (CEUS 2023 Section 4.3 & Namuduri 2023)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Digital Twins enable urban planners and airspace operators to simulate high-stress scenarios without real-world risk.
          Select any of the seven research-grounded scenarios below to inspect how the closed-loop system reacts.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = activeScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenarioId(sc.id);
                executeWhatIfScenario(sc.id);
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-900/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">Case #{sc.number}</span>
                <Icon className={`w-3.5 h-3.5 ${sc.color}`} />
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-2 line-clamp-2">
                {sc.title.split(': ')[1]}
              </div>
              <div className="text-[9px] font-mono text-cyan-400 uppercase mt-2">
                {isSelected ? '● ACTIVE' : 'Run Scenario'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed 6-Stage Execution Lifecycle Panel (Prompt Section 19) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CurrentIcon className={`w-5 h-5 ${currentSelected.color}`} />
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                {currentSelected.title}
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Category: {currentSelected.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => executeWhatIfScenario(currentSelected.id)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute Scenario In Airspace</span>
            </button>
            <button
              onClick={resetAirspaceToDefault}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
              title="Reset Airspace"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Stage Flow: Current State -> Event -> Twin Update -> Analysis -> Response -> Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">1. CURRENT STATE</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{currentSelected.currentState}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-900/50 space-y-1">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">2. PERTURBATION EVENT</div>
            <p className="text-slate-200 leading-relaxed text-[11px]">{currentSelected.event}</p>
          </div>

          <div className="p-3.5 bg-purple-950/30 rounded-xl border border-purple-800/50 space-y-1">
            <div className="text-[10px] font-mono font-bold text-purple-300 uppercase">3. DIGITAL TWIN UPDATE</div>
            <p className="text-purple-200 leading-relaxed text-[11px]">{currentSelected.twinUpdate}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-blue-900/50 space-y-1">
            <div className="text-[10px] font-mono font-bold text-blue-400 uppercase">4. MMS MODEL ANALYSIS</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">{currentSelected.analysis}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-900/50 space-y-1">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase">5. POSSIBLE RESPONSE ({simulationMode.toUpperCase()})</div>
            <p className="text-slate-200 leading-relaxed text-[11px]">{currentSelected.possibleResponse}</p>
          </div>

          <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-800/50 space-y-1">
            <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">6. MEASURED RESULT</div>
            <p className="text-emerald-200 leading-relaxed text-[11px]">{currentSelected.result}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
