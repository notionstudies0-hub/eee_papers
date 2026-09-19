import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code,
  Cpu,
  Database,
  FileCode,
  Layers,
  Network,
  RefreshCw,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';
import { ModelCard } from '../types/airspace';

export const DataModelManagementView: React.FC = () => {
  const { models } = useAirspace();
  const [selectedModelId, setSelectedModelId] = useState<string>('MOD-TRAFFIC-01');

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Model Library (MLib) & Meta-Model (M2) Orchestration
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Generic Multi-Model Architecture & Connector Functions (Belfadel et al. CEUS 2023 Section 4.3 & Fig. 5)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Model Management System (MMS) categorizes models across decision time horizons (Strategic, Tactical, Operational,
          and Impact Assessment) and resolutions (Zone vs Trajectory). Models are linked via explicit 1-to-1 connector functions,
          allowing diverse simulation tools (MATSim, MASS-GT, COPERT, and VRP solvers) to interoperate seamlessly.
        </p>
      </div>

      {/* Model Orchestration Pipeline Flow (Prompt Section 21) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            Model Integration & Orchestration Pipeline
          </h3>
          <span className="text-[10px] font-mono text-emerald-400">1-to-1 Connector Functions Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 hover:border-cyan-500/40 transition">
            <div className="text-[10px] text-cyan-400 font-bold">1. TRAFFIC MODEL</div>
            <div className="text-slate-200 font-semibold text-[11px]">Dynamic Travel Times</div>
            <div className="text-[9px] text-slate-500">Inputs: GPS trajectories</div>
            <div className="text-[10px] text-purple-300 pt-1 border-t border-slate-850">→ Connector Func 1</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 hover:border-cyan-500/40 transition">
            <div className="text-[10px] text-sky-400 font-bold">2. WEATHER MODEL</div>
            <div className="text-slate-200 font-semibold text-[11px]">Microburst Boundaries</div>
            <div className="text-[9px] text-slate-500">Inputs: Anemometers & Radar</div>
            <div className="text-[10px] text-purple-300 pt-1 border-t border-slate-850">→ Connector Func 2</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 hover:border-cyan-500/40 transition">
            <div className="text-[10px] text-emerald-400 font-bold">3. CONFLICT ENGINE</div>
            <div className="text-slate-200 font-semibold text-[11px]">DFR Separation Margins</div>
            <div className="text-[9px] text-slate-500">Inputs: UTM 4D Vectors</div>
            <div className="text-[10px] text-purple-300 pt-1 border-t border-slate-850">→ Connector Func 3</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 hover:border-cyan-500/40 transition">
            <div className="text-[10px] text-amber-400 font-bold">4. VRP SOLVER</div>
            <div className="text-slate-200 font-semibold text-[11px]">Deconflicted Routes</div>
            <div className="text-[9px] text-slate-500">Inputs: Parcel demand list</div>
            <div className="text-[10px] text-purple-300 pt-1 border-t border-slate-850">→ Connector Func 4</div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg space-y-1">
            <div className="text-[10px] text-emerald-300 font-bold">5. DECISION SUPPORT</div>
            <div className="text-white font-semibold text-[11px]">Synthesized Options</div>
            <div className="text-[9px] text-emerald-300/80">Dispatches Actions via DIS</div>
            <div className="text-[10px] text-emerald-400 pt-1 border-t border-emerald-900">Task Push Uplink ↺</div>
          </div>
        </div>
      </div>

      {/* Model Cards Catalog (Prompt Section 20) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cards Grid */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
            Model Library (MLib) Meta-Model Catalog
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {models.map((mod) => {
              const isSelected = mod.id === selectedModelId;
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModelId(mod.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-900/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-300">
                        {mod.category.toUpperCase()} • {mod.resolution}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                        {mod.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{mod.name}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{mod.purpose}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Latency: {mod.executionTimeMs}ms</span>
                    <span className="text-cyan-400">Fidelity: {mod.fidelityScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Model Specification & Connector Inspector */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">{selectedModel.id}</span>
            <h3 className="text-sm font-bold font-display text-white uppercase mt-0.5">
              {selectedModel.name}
            </h3>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Source: {selectedModel.originPaper}
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Purpose:</span>
              <p className="text-[11px] text-slate-300 mt-1 font-sans leading-relaxed">
                {selectedModel.purpose}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Inputs:</span>
              <ul className="mt-1 space-y-1 text-slate-300 text-[11px]">
                {selectedModel.inputs.map((inp, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-cyan-400">•</span> {inp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Outputs:</span>
              <ul className="mt-1 space-y-1 text-emerald-300 text-[11px]">
                {selectedModel.outputs.map((out, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> {out}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Transformation Pipeline (Prompt Section 22) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          Data Ingestion & Normalization Transformation Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Raw Ingestion Payload */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>RAW SENSOR TELEMETRY (MQTT / KAFKA)</span>
              <span className="text-[10px] text-amber-400">Unprocessed</span>
            </div>
            <pre className="text-[11px] text-slate-300 bg-slate-900/80 p-3 rounded border border-slate-850 overflow-x-auto leading-relaxed">
{`{
  "dev_id": "0x4A19B",
  "lat": 32.7767,
  "lon": -96.7970,
  "alt_m": 182.88,
  "gspd_mps": 24.69,
  "hdg_rad": 0.733,
  "soc_pct": 91.2,
  "rssi_dbm": -68,
  "ts": 1726718400122
}`}
            </pre>
          </div>

          {/* Normalized Common Object */}
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 space-y-2">
            <div className="flex items-center justify-between text-cyan-300 text-[11px]">
              <span>NORMALIZED DIGITAL TWIN ENTITY (FIWARE / NGSI-LD)</span>
              <span className="text-[10px] text-emerald-400">Validated</span>
            </div>
            <pre className="text-[11px] text-cyan-200 bg-slate-900/80 p-3 rounded border border-cyan-900/40 overflow-x-auto leading-relaxed">
{`{
  "id": "UAS-01",
  "category": "uas",
  "position": { "x": 210, "y": 650, "altitudeFt": 600 },
  "speedKts": 48,
  "headingDeg": 42,
  "status": "en_route",
  "dfrCompliant": true,
  "assignedCorridor": "CORRIDOR-CHARLIE",
  "freshness": "0.3s"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
