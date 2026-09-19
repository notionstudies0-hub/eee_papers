import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Battery,
  Bot,
  CloudRain,
  Compass,
  Eye,
  EyeOff,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  Plane,
  Plus,
  Radio,
  RotateCcw,
  Shield,
  Split,
  Wind,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';
import { Aircraft } from '../types/airspace';

export const LiveAirspaceView: React.FC = () => {
  const {
    aircraft,
    vertiports,
    corridors,
    weather,
    zones,
    selectedVehicleId,
    setSelectedVehicleId,
    triggerWeatherHazard,
    triggerNoFlyZone,
    triggerLeadUasDeceleration,
    triggerProximityConflict,
    addCustomVehicle,
  } = useAirspace();

  // Layer Visibility Toggles
  const [showCommercial, setShowCommercial] = useState(true);
  const [showAam, setShowAam] = useState(true);
  const [showUas, setShowUas] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [altitudeFilter, setAltitudeFilter] = useState<'all' | 'uas' | 'aam' | 'commercial'>('all');

  // Custom vehicle addition modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<'aam' | 'uas'>('uas');
  const [newCallsign, setNewCallsign] = useState('');

  const selectedPlane = aircraft.find((a) => a.id === selectedVehicleId) || aircraft[0];

  // Filter aircraft by layers & altitude
  const filteredAircraft = aircraft.filter((plane) => {
    if (plane.category === 'commercial' && !showCommercial) return false;
    if (plane.category === 'aam' && !showAam) return false;
    if (plane.category === 'uas' && !showUas) return false;

    if (altitudeFilter === 'uas' && plane.position.altitudeFt > 400 && plane.category !== 'uas') return false;
    if (altitudeFilter === 'aam' && (plane.position.altitudeFt < 400 || plane.position.altitudeFt > 3000)) return false;
    if (altitudeFilter === 'commercial' && plane.position.altitudeFt < 3000) return false;

    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header & Layer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Tactical Airspace 3D Radar & Situational Display
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Urban Low-Altitude Air Mobility Corridor Grid (0–10,000 ft MSL)
            </p>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowUas(!showUas)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition border ${
              showUas
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Bot className="w-3 h-3" />
            UAS (UTM)
          </button>

          <button
            onClick={() => setShowAam(!showAam)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition border ${
              showAam
                ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Compass className="w-3 h-3" />
            AAM (eVTOL)
          </button>

          <button
            onClick={() => setShowCommercial(!showCommercial)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition border ${
              showCommercial
                ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Plane className="w-3 h-3" />
            Commercial
          </button>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition border ${
              showCorridors
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Split className="w-3 h-3" />
            Air Corridors
          </button>

          <button
            onClick={() => setShowWeather(!showWeather)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition border ${
              showWeather
                ? 'bg-sky-950/80 text-sky-300 border-sky-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            Weather
          </button>

          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] font-mono transition border ${
              showZones
                ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <Shield className="w-3 h-3" />
            Restricted Zones
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-medium flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-3 h-3" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Main Radar Screen + Inspection Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Radar View Canvas/SVG container (3 Cols) */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden h-[380px] sm:h-[480px] md:h-[540px] lg:h-[620px] shadow-2xl flex flex-col justify-between select-none">
          {/* Top Overlay Stats */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/85 backdrop-blur px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-800 text-[10px] sm:text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RADAR: 24Hz</span>
            <span className="text-slate-600">•</span>
            <span className="hidden xs:inline">Range: 45 NM</span>
            <span className="text-slate-600 hidden xs:inline">•</span>
            <span className="hidden sm:inline">DFW Basin</span>
          </div>

          {/* Altitude Stratum Filter Tabs */}
          <div className="absolute bottom-2 sm:bottom-auto sm:top-3 right-2 sm:right-3 z-20 flex items-center gap-1 bg-slate-900/85 backdrop-blur p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            {(['all', 'uas', 'aam', 'commercial'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setAltitudeFilter(tier)}
                className={`px-1.5 sm:px-2 py-1 sm:py-0.5 rounded uppercase font-semibold transition ${
                  altitudeFilter === tier
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tier === 'all' ? 'All' : tier === 'uas' ? '<400ft' : tier === 'aam' ? 'AAM' : 'High'}
              </button>
            ))}
          </div>

          {/* Tactical SVG Map */}
          <div className="relative w-full h-full">
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full bg-[#070b12]"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Radial radar grid pattern */}
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.04" />
                  <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.01" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                </radialGradient>

                <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="weatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
                </linearGradient>

                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2,4" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="1000" height="1000" fill="url(#grid)" />
              <circle cx="500" cy="500" r="480" fill="url(#radarGlow)" />

              {/* Concentric Radar Distance Rings */}
              <circle cx="500" cy="500" r="150" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,6" />
              <circle cx="500" cy="500" r="300" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,6" />
              <circle cx="500" cy="500" r="450" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeDasharray="6,8" />
              <line x1="500" y1="20" x2="500" y2="980" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,5" />
              <line x1="20" y1="500" x2="980" y2="500" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,5" />

              {/* Rotating Radar Sweep Line */}
              <g className="radar-sweep" style={{ transformOrigin: '500px 500px' }}>
                <line x1="500" y1="500" x2="500" y2="20" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.4" />
                <path
                  d="M 500 500 L 500 20 A 480 480 0 0 1 839 160 Z"
                  fill="url(#radarGlow)"
                  opacity="0.3"
                />
              </g>

              {/* Airspace Zones (UVR No-Fly & Class B) */}
              {showZones &&
                zones.map((zone) => (
                  <g key={zone.id}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      rx="8"
                      fill={zone.type === 'UVR_restricted' ? (zone.active ? '#ef4444' : '#64748b') : '#3b82f6'}
                      fillOpacity={zone.active ? 0.18 : 0.05}
                      stroke={zone.type === 'UVR_restricted' ? (zone.active ? '#ef4444' : '#64748b') : '#3b82f6'}
                      strokeWidth={zone.active ? '1.8' : '1'}
                      strokeDasharray={zone.active ? 'none' : '4,4'}
                    />
                    <text
                      x={zone.x + 8}
                      y={zone.y + 16}
                      fill={zone.active ? '#fca5a5' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {zone.name}
                    </text>
                    <text
                      x={zone.x + 8}
                      y={zone.y + 28}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      FL: {zone.floorFt}ft - {zone.ceilingFt}ft {zone.active ? '[RESTRICTED]' : '[INACTIVE]'}
                    </text>
                  </g>
                ))}

              {/* Air Corridors (3D Skylanes) */}
              {showCorridors &&
                corridors.map((corridor) => {
                  const pathString = corridor.waypoints.reduce(
                    (acc, wp, idx) => (idx === 0 ? `M ${wp.x} ${wp.y}` : `${acc} L ${wp.x} ${wp.y}`),
                    ''
                  );

                  return (
                    <g key={corridor.id}>
                      {/* Corridor Buffer Zone / Outer Geofence */}
                      <path
                        d={pathString}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="38"
                        strokeOpacity="0.08"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Corridor Center Skylane */}
                      <path
                        d={pathString}
                        fill="none"
                        stroke="url(#corridorGrad)"
                        strokeWidth="10"
                        strokeOpacity="0.75"
                        strokeDasharray={corridor.status === 'congested' ? '8,4' : 'none'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Direction Arrow marks */}
                      {corridor.waypoints.map((wp, i) => (
                        <circle
                          key={i}
                          cx={wp.x}
                          cy={wp.y}
                          r="4"
                          fill="#38bdf8"
                          fillOpacity="0.6"
                          stroke="#0284c7"
                          strokeWidth="1"
                        />
                      ))}

                      {/* 3D Roundabout / Intersection Hub (Namuduri Section V) */}
                      {corridor.hasRoundabout && corridor.roundaboutCenter && (
                        <g>
                          <circle
                            cx={corridor.roundaboutCenter.x}
                            cy={corridor.roundaboutCenter.y}
                            r="32"
                            fill="#8b5cf6"
                            fillOpacity="0.12"
                            stroke="#8b5cf6"
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                          />
                          <circle
                            cx={corridor.roundaboutCenter.x}
                            cy={corridor.roundaboutCenter.y}
                            r="12"
                            fill="#8b5cf6"
                            fillOpacity="0.4"
                          />
                          <text
                            x={corridor.roundaboutCenter.x - 38}
                            y={corridor.roundaboutCenter.y - 38}
                            fill="#c4b5fd"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            3D ROUNDABOUT
                          </text>
                        </g>
                      )}

                      {/* Corridor Label */}
                      <text
                        x={corridor.waypoints[1].x + 12}
                        y={corridor.waypoints[1].y - 8}
                        fill="#7dd3fc"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {corridor.code} (400–1200ft)
                      </text>
                    </g>
                  );
                })}

              {/* Weather Hazards (Microburst Convective Cell) */}
              {showWeather &&
                weather
                  .filter((w) => w.active)
                  .map((w) => (
                    <g key={w.id} className="animate-pulse-ring">
                      <circle
                        cx={w.x}
                        cy={w.y}
                        r={w.radius}
                        fill="url(#weatherGrad)"
                        stroke="#f43f5e"
                        strokeWidth="2"
                        strokeDasharray="6,4"
                      />
                      <circle
                        cx={w.x}
                        cy={w.y}
                        r={w.radius * 0.4}
                        fill="#f43f5e"
                        fillOpacity="0.3"
                      />
                      <text
                        x={w.x - 45}
                        y={w.y - w.radius - 8}
                        fill="#fb7185"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        ⚠ {w.title} ({w.windSpeedKts} kts)
                      </text>
                    </g>
                  ))}

              {/* Vertiports */}
              {vertiports.map((vp) => (
                <g key={vp.id} className="cursor-pointer">
                  <circle
                    cx={vp.x}
                    cy={vp.y}
                    r="16"
                    fill="#0f172a"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={vp.x}
                    cy={vp.y}
                    r="6"
                    fill="#06b6d4"
                  />
                  {/* H landing pad letter */}
                  <text
                    x={vp.x - 3}
                    y={vp.y + 3}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    H
                  </text>
                  <text
                    x={vp.x + 20}
                    y={vp.y + 4}
                    fill="#e2e8f0"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {vp.name}
                  </text>
                  <text
                    x={vp.x + 20}
                    y={vp.y + 15}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    Pads: {vp.occupiedPads}/{vp.padsCount} • Elev: {vp.altitudeFt}ft
                  </text>
                </g>
              ))}

              {/* Aircraft Trails */}
              {showTrails &&
                filteredAircraft.map((plane) => {
                  if (!plane.telemetryHistory || plane.telemetryHistory.length < 2) return null;
                  const trailPoints = plane.telemetryHistory.map((p) => `${p.x},${p.y}`).join(' ');
                  return (
                    <polyline
                      key={`trail-${plane.id}`}
                      points={trailPoints}
                      fill="none"
                      stroke={
                        plane.category === 'commercial'
                          ? '#60a5fa'
                          : plane.category === 'aam'
                          ? '#c084fc'
                          : '#22d3ee'
                      }
                      strokeWidth="1.2"
                      strokeDasharray="2,3"
                      strokeOpacity="0.6"
                    />
                  );
                })}

              {/* Aircraft Targets / Blips */}
              {filteredAircraft.map((plane) => {
                const isSelected = plane.id === selectedVehicleId;
                const isLeadInCharlie = plane.id === 'UAS-01';

                return (
                  <g
                    key={plane.id}
                    onClick={() => setSelectedVehicleId(plane.id)}
                    className="cursor-pointer transition-transform duration-200"
                    style={{
                      transform: `translate(${plane.position.x}px, ${plane.position.y}px)`,
                    }}
                  >
                    {/* Mobile Touch Area Hitbox */}
                    <circle cx="0" cy="0" r="32" fill="transparent" pointerEvents="all" />

                    {/* Selection Ring */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="animate-spin"
                        style={{ animationDuration: '6s' }}
                      />
                    )}

                    {/* Geofence Safety Buffer */}
                    <circle
                      cx="0"
                      cy="0"
                      r={plane.category === 'commercial' ? 30 : 16}
                      fill={
                        plane.category === 'commercial'
                          ? '#3b82f6'
                          : plane.category === 'aam'
                          ? '#a855f7'
                          : '#06b6d4'
                      }
                      fillOpacity="0.12"
                      stroke={isSelected ? '#22d3ee' : '#475569'}
                      strokeWidth="0.8"
                    />

                    {/* Aircraft Symbol with Heading Rotation */}
                    <g transform={`rotate(${plane.headingDeg})`}>
                      {plane.category === 'commercial' ? (
                        // Airplane shape
                        <path
                          d="M 0 -12 L 4 -2 L 14 3 L 4 5 L 3 10 L 6 12 L 0 11 L -6 12 L -3 10 L -4 5 L -14 3 L -4 -2 Z"
                          fill="#60a5fa"
                          stroke="#1e3a8a"
                          strokeWidth="0.8"
                        />
                      ) : plane.category === 'aam' ? (
                        // eVTOL Quad/Hex tiltrotor shape
                        <path
                          d="M -7 -7 L 7 -7 L 0 -12 Z M -7 7 L 7 7 L 0 12 Z M -3 -7 L -3 7 L 3 7 L 3 -7 Z"
                          fill="#c084fc"
                          stroke="#581c87"
                          strokeWidth="0.8"
                        />
                      ) : (
                        // UAS Drone Quadrotor shape
                        <g>
                          <circle cx="-5" cy="-5" r="3" fill="#22d3ee" />
                          <circle cx="5" cy="-5" r="3" fill="#22d3ee" />
                          <circle cx="-5" cy="5" r="3" fill="#22d3ee" />
                          <circle cx="5" cy="5" r="3" fill="#22d3ee" />
                          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#0891b2" strokeWidth="1.2" />
                          <line x1="-5" y1="5" x2="5" y2="-5" stroke="#0891b2" strokeWidth="1.2" />
                          <circle cx="0" cy="0" r="3" fill="#ffffff" />
                        </g>
                      )}
                    </g>

                    {/* Data Block Tag (ICAO style) */}
                    <text
                      x="14"
                      y="-4"
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {plane.callsign}
                    </text>
                    <text
                      x="14"
                      y="7"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {Math.round(plane.position.altitudeFt)}ft • {plane.speedKts}kt
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Quick Status Strip */}
          <div className="bg-slate-950/90 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between text-xs font-mono text-slate-400 z-20">
            <div className="flex items-center gap-4">
              <span>Displaying {filteredAircraft.length} of {aircraft.length} Tracks</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400">DFR Autonomy: ACTIVE</span>
              <span className="text-slate-600">|</span>
              <span className="text-purple-400">Corridor Charlie: NOMINAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">● 0 Fatalities Target</span>
            </div>
          </div>
        </div>

        {/* Right Inspection Column (1 Col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold font-display uppercase tracking-wider text-white flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                Track Telemetry Inspection
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  selectedPlane.category === 'commercial'
                    ? 'bg-blue-950 text-blue-300'
                    : selectedPlane.category === 'aam'
                    ? 'bg-purple-950 text-purple-300'
                    : 'bg-cyan-950 text-cyan-300'
                }`}
              >
                {selectedPlane.category.toUpperCase()}
              </span>
            </div>

            {/* Vehicle Card Header */}
            <div>
              <div className="text-lg font-bold font-mono text-white">{selectedPlane.callsign}</div>
              <div className="text-xs text-slate-400">{selectedPlane.model}</div>
              <div className="text-[11px] text-slate-400">{selectedPlane.operator}</div>
            </div>

            {/* Structured Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">ALTITUDE</div>
                <div className="text-sm font-bold text-white">
                  {Math.round(selectedPlane.position.altitudeFt)} ft
                </div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">AIRSPEED</div>
                <div className="text-sm font-bold text-white">{selectedPlane.speedKts} kts</div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">HEADING</div>
                <div className="text-sm font-bold text-white">{selectedPlane.headingDeg}°</div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">BATTERY / FUEL</div>
                <div className="text-sm font-bold text-emerald-400">
                  {selectedPlane.batteryPct !== undefined ? `${Math.round(selectedPlane.batteryPct)}%` : `${selectedPlane.fuelPct}%`}
                </div>
              </div>
            </div>

            {/* Route & Mission info */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>Origin: <strong className="text-slate-200">{selectedPlane.origin}</strong></span>
                <span>Dest: <strong className="text-slate-200">{selectedPlane.destination}</strong></span>
              </div>
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>Corridor: <strong className="text-cyan-300">{selectedPlane.assignedCorridorId || 'Direct IFR'}</strong></span>
                <span>Status: <strong className="text-emerald-400 uppercase">{selectedPlane.status}</strong></span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="text-slate-400 text-[10px]">OPERATIONAL INTENT (OI)</div>
                <div className="text-cyan-300 font-semibold">{selectedPlane.operationalIntentId}</div>
                <div className="text-[10px] text-slate-400">
                  Comms: <span className="text-slate-200 uppercase">{selectedPlane.communicationStatus}</span> • Geofence: {selectedPlane.geofenceRadiusMeters}m
                </div>
              </div>
            </div>
          </div>

          {/* Quick Vehicle Interventions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
              Live Tactical Injections
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={triggerLeadUasDeceleration}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition text-center"
              >
                Throttle Lead
              </button>
              <button
                onClick={() => triggerWeatherHazard()}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition text-center"
              >
                Inject Storm
              </button>
              <button
                onClick={() => triggerNoFlyZone()}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition text-center"
              >
                UVR Zone
              </button>
              <button
                onClick={triggerProximityConflict}
                className="p-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 rounded text-[11px] font-medium transition text-center"
              >
                Cross Conflict
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-96 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Insert Custom Aircraft to Airspace
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Vehicle Category</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewCategory('uas')}
                    className={`flex-1 py-1.5 rounded font-mono ${
                      newCategory === 'uas' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    UAS Cargo
                  </button>
                  <button
                    onClick={() => setNewCategory('aam')}
                    className={`flex-1 py-1.5 rounded font-mono ${
                      newCategory === 'aam' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    AAM Passenger
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Callsign</label>
                <input
                  type="text"
                  value={newCallsign}
                  onChange={(e) => setNewCallsign(e.target.value)}
                  placeholder="e.g. SKY-TAXI-07"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addCustomVehicle(newCategory, newCallsign, 'VP-ALPHA', 'VP-BETA');
                  setShowAddModal(false);
                  setNewCallsign('');
                }}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Add to Flight Line
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
