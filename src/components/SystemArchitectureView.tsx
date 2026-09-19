import React, { useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bot,
  Compass,
  Cpu,
  Database,
  Layers,
  Network,
  Plane,
  Radio,
  RefreshCw,
  Scale,
  ShieldCheck,
  Split,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const SystemArchitectureView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(4);

  const architectureLayers = [
    {
      level: 1,
      name: 'LAYER 1 — PHYSICAL WORLD',
      subtitle: 'Physical Airspace, Vehicles & Infrastructure',
      icon: Plane,
      color: 'text-blue-400',
      border: 'border-blue-800/60',
      bg: 'bg-blue-950/30',
      components: ['Commercial Jets (AAL142)', 'eVTOL Air Taxis (Joby S4)', 'Cargo Drones (UAS-01)', 'Vertiports Alpha/Beta', 'Atmospheric Weather Systems'],
      tech: 'Sensors, GPS, IMU, ADS-B Out, Barometric Altimeters',
      role: 'Generates ground truth physical telemetry and physically acts upon flight guidance instructions.',
    },
    {
      level: 2,
      name: 'LAYER 2 — DATA ACQUISITION & INGESTION (DIS)',
      subtitle: 'Data Ingestion System (DIS Core)',
      icon: RefreshCw,
      color: 'text-cyan-400',
      border: 'border-cyan-800/60',
      bg: 'bg-cyan-950/30',
      components: ['Kafka Event Streaming Backbone', 'Fiware Orion Context Broker', 'Device & Protocol Manager (MQTT/AMQP/HTTP)', 'Semantic Manager & Ontologies'],
      tech: 'Apache Kafka, Eclipse Ditto, Orion-LD Context Broker',
      role: 'Captures high-frequency vehicle telemetry (24Hz) and exposes uniform APIs to the digital twin.',
    },
    {
      level: 3,
      name: 'LAYER 3 — DIGITIZED AIRSPACE',
      subtitle: 'Structured Digital State Records',
      icon: Layers,
      color: 'text-indigo-400',
      border: 'border-indigo-800/60',
      bg: 'bg-indigo-950/30',
      components: ['Relational & Time-Series Repositories', 'Point-in-Time GIS Coordinate Matrices', 'ASTM UVR No-Fly Boundaries', 'Vertiport Availability Indexes'],
      tech: 'InfluxDB, MongoDB, PostGIS, GeoJSON',
      role: 'Stores verified, structured tabular records of the physical world snapshot.',
    },
    {
      level: 4,
      name: 'LAYER 4 — DIGITAL TWIN (THE LIVING TWIN)',
      subtitle: 'Dynamic Virtual Mirror & Synchronizer',
      icon: Network,
      color: 'text-purple-400',
      border: 'border-purple-800/70',
      bg: 'bg-purple-950/40',
      components: ['Virtual Reality Engine', 'Continuous Synchronization Broker', 'Drift & Freshness Monitor', 'Spatial Trajectory Predictor'],
      tech: 'Cesium 3D, AirSim, WebGL Vector Engine',
      role: 'Maintains an active, evolving cyber replica of the airspace with bidirectional communication to physical assets.',
    },
    {
      level: 5,
      name: 'LAYER 5 — MODEL MANAGEMENT SYSTEM (MMS)',
      subtitle: 'Model Library & Orchestration (M2)',
      icon: Database,
      color: 'text-sky-400',
      border: 'border-sky-800/60',
      bg: 'bg-sky-950/30',
      components: ['Urban Traffic Model', 'Multi-UAS VRP Solver', 'Doppler Weather Predictor', 'COPERT Emission Calculator', 'Long-term Demand Model'],
      tech: 'MATSim, MASS-GT, COPERT 5, Python Solver',
      role: 'Orchestrates multi-domain models using 1-to-1 connector functions to predict future states and evaluate what-if scenarios.',
    },
    {
      level: 6,
      name: 'LAYER 6 — INTEGRATED AIRSPACE MANAGEMENT',
      subtitle: 'NASA/FAA Rules & Urban Air Corridors',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-800/60',
      bg: 'bg-emerald-950/30',
      components: ['Digital Flight Rules (DFR) Engine', '3-Layer Sky Corridors & Roundabouts', 'UAS-to-UAS Sidelink Mesh (RTCA)', 'Provider of Services for UAM (PSU)'],
      tech: 'RTCA SC-228, ASTM F3548-21, FAA Innovate28',
      role: 'Enforces automatic cooperative self-separation, speed throttling, and corridor lane management.',
    },
    {
      level: 7,
      name: 'LAYER 7 — DECISION SUPPORT (HUMAN / AUTO)',
      subtitle: 'Tactical Intervention Triage',
      icon: Scale,
      color: 'text-amber-400',
      border: 'border-amber-800/60',
      bg: 'bg-amber-950/30',
      components: ['Human-in-the-Loop Triage Workbench', 'Simulated Automation Engine', 'Multi-Criteria Option Synthesizer', 'Action Authorization Token Gate'],
      tech: 'Bayesian Inference, Multi-Criteria Decision Analysis (MCDA)',
      role: 'Formulates conflict resolution options (A, B, C) and evaluates safety versus operational delay tradeoffs.',
    },
    {
      level: 8,
      name: 'LAYER 8 — PHYSICAL ACTION & CLOSED LOOP',
      subtitle: 'Actuation & Feedback Uplink',
      icon: Zap,
      color: 'text-emerald-300',
      border: 'border-emerald-700/80',
      bg: 'bg-emerald-950/40',
      components: ['DIS Task Push Service', 'Onboard Autopilot Guidance Update', 'Flight Path Divert & Speed Command', 'Telemetry Refresh Loop ↺'],
      tech: 'MAVLink, Direct Sidelink, ASTM UVR Push',
      role: 'Closes the loop: Dispatches actions back to aircraft, generating fresh physical telemetry that streams back into Layer 1.',
    },
  ];

  const current = architectureLayers.find((l) => l.level === selectedLayer) || architectureLayers[3];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              End-to-End 8-Layer Digital Twin System Architecture
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Combining Namuduri (IEEE OJVT 2023) Domain Model with Belfadel et al. (CEUS 2023) Computing Framework
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The architecture bridges the gap between raw physical flight dynamics and advanced virtual orchestration.
          Explore each layer below to observe how telemetry ascends through ingestion and digital modeling,
          undergoes simulation and decision analysis, and closes the loop with physical flight actuation.
        </p>
      </div>

      {/* Interactive 8-Layer Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stack List */}
        <div className="lg:col-span-2 space-y-2">
          {architectureLayers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = layer.level === selectedLayer;
            return (
              <div
                key={layer.level}
                onClick={() => setSelectedLayer(layer.level)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? `${layer.bg} ${layer.border} shadow-lg shadow-purple-950/20`
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    L{layer.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white">{layer.name}</span>
                      <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                    </div>
                    <div className="text-[11px] text-slate-400">{layer.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {layer.level === 8 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      CLOSED LOOP ↺
                    </span>
                  )}
                  <ArrowRight
                    className={`w-4 h-4 transition ${
                      isSelected ? 'text-white' : 'text-slate-600'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Selected Layer Deep Dive */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                SYSTEM LAYER {current.level} DEEP DIVE
              </span>
              <h3 className="text-sm font-bold font-display text-white uppercase mt-0.5">
                {current.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{current.subtitle}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Architectural Role:
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px] mt-1 font-sans">
                  {current.role}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Core Subsystems / Entities:
                </span>
                <ul className="mt-1 space-y-1 font-mono text-[11px] text-slate-300">
                  {current.components.map((comp, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-cyan-400">•</span> {comp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Technologies / Standards:
                </span>
                <div className="mt-1 p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
                  {current.tech}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Validated against TOGAF Enterprise Architecture & ASTM F3548
          </div>
        </div>
      </div>
    </div>
  );
};
