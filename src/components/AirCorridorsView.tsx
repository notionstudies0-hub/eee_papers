import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bot,
  Compass,
  Info,
  Layers,
  RotateCw,
  Split,
  Workflow,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';

export const AirCorridorsView: React.FC = () => {
  const { corridors, aircraft, selectedVehicleId, setSelectedVehicleId } = useAirspace();
  const [activeLayer, setActiveLayer] = useState<'all' | 'layer1' | 'layer2' | 'layer3'>('all');

  const selectedUas = aircraft.find((a) => a.id === (selectedVehicleId || 'UAS-01')) || aircraft[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Split className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Urban Air Mobility (UAM) 3D Corridors & Roundabouts
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Three-Dimensional Airspace Highways & Multi-Layer Intersections (Namuduri 2023 Section V & Fig. 5)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Air corridors are 3D volumes of airspace reserved for UAS and AAM traffic. In Namuduri (2023), a conceptual
          three-layer design separates directional skylanes (Layers 1 & 3) using a dedicated middle-layer roundabout (Layer 2)
          to enable safe, collision-free turning, merging, and sequencing.
        </p>
      </div>

      {/* 3D Multi-Layer Corridor Graphic (Namuduri Fig. 5) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Conceptual 3-Layer Air Corridor Design
            </h3>
            <p className="text-[11px] text-slate-400">
              Visualizing Vertical Strata Separation: Top Skylane • Roundabout Interconnect • Bottom Skylane
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            {(['all', 'layer1', 'layer2', 'layer3'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  activeLayer === layer
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {layer === 'all' ? 'All 3 Layers' : layer === 'layer1' ? 'Layer 1 (Top)' : layer === 'layer2' ? 'Layer 2 (Roundabout)' : 'Layer 3 (Bottom)'}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Isometric / Layered Diagram */}
        <div className="space-y-3">
          {/* Layer 1: Top Westbound / Southbound Skylane */}
          {(activeLayer === 'all' || activeLayer === 'layer1') && (
            <div className="p-4 bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950 border border-blue-900/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-blue-300 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  LAYER 1 — TOP SKYLANE (Altitude: 900–1,200 ft AGL)
                </span>
                <span className="text-slate-400 text-[10px]">One-Directional Standard Southbound / Westbound</span>
              </div>
              <div className="h-12 bg-blue-950/20 border border-dashed border-blue-800/40 rounded-lg flex items-center justify-between px-6 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-2 text-blue-400">
                  <ArrowRight className="w-4 h-4" /> ENTRY: Standard Southbound Lane (55 kts)
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded">
                  Descent Gate to Roundabout ↓
                </span>
              </div>
            </div>
          )}

          {/* Layer 2: Middle Roundabout / Intersection (Turning & Direction Change) */}
          {(activeLayer === 'all' || activeLayer === 'layer2') && (
            <div className="p-4 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-purple-800/60 rounded-xl space-y-2 shadow-lg shadow-purple-950/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-purple-200 flex items-center gap-2">
                  <RotateCw className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '10s' }} />
                  LAYER 2 — ROUNDABOUT & INTERSECTION (Altitude: 650–850 ft AGL)
                </span>
                <span className="text-purple-300 text-[10px]">Traffic Light Replacement via UAS Sidelink Handshakes</span>
              </div>

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-lg flex flex-col sm:flex-row items-center justify-around gap-4 text-center text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">1. ENTER ROUNDABOUT</div>
                  <p className="text-[11px] text-purple-200">Lower from Layer 1, verify spacing with approaching vessels</p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 hidden sm:block" />
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">2. QUARTER / HALF TURN</div>
                  <p className="text-[11px] text-purple-200">Orbital trajectory to align with desired outbound heading (e.g. East)</p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 hidden sm:block" />
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">3. DESCENT MERGE</div>
                  <p className="text-[11px] text-purple-200">Merge into Layer 3 Eastbound Skylane with coordinated slot timing</p>
                </div>
              </div>
            </div>
          )}

          {/* Layer 3: Bottom Eastbound / Northbound Skylane */}
          {(activeLayer === 'all' || activeLayer === 'layer3') && (
            <div className="p-4 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-900/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-cyan-300 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  LAYER 3 — BOTTOM SKYLANE (Altitude: 400–600 ft AGL)
                </span>
                <span className="text-slate-400 text-[10px]">One-Directional Standard Eastbound / Northbound</span>
              </div>
              <div className="h-12 bg-cyan-950/20 border border-dashed border-cyan-800/40 rounded-lg flex items-center justify-between px-6 text-xs text-slate-300 font-mono">
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded">
                  ↑ Merge from Layer 2 Roundabout
                </span>
                <span className="flex items-center gap-2 text-cyan-300">
                  CRUISE: Standard Northbound Express (48 kts) <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corridor Vehicle Inspector (Prompt Section 11) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center justify-between">
          <span>Active Vessel Corridor Tracking: {selectedUas.callsign}</span>
          <span className="text-xs font-mono text-cyan-400 font-normal">
            Corridor Charlie Spine
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">CURRENT CORRIDOR</div>
            <div className="text-sm font-bold text-cyan-300 mt-1">Sky Corridor Charlie</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">ASSIGNED LANE</div>
            <div className="text-sm font-bold text-white mt-1">Lane C-North (600ft)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">NEXT INTERSECTION</div>
            <div className="text-sm font-bold text-purple-300 mt-1">Roundabout WP-2</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">DESTINATION</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">{selectedUas.destination}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">TRAFFIC AHEAD</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Clear (12.4 km)</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">TRAFFIC BEHIND</div>
            <div className="text-sm font-bold text-amber-300 mt-1">UAS-02 (1.4 km)</div>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Notice: Label: 'CONCEPTUAL AAM/UAS AIR CORRIDOR'. Not an officially standardized FAA aviation corridor.</span>
        </div>
      </div>
    </div>
  );
};
