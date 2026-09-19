export type VehicleCategory = 'commercial' | 'aam' | 'uas';

export type FlightStatus = 'scheduled' | 'en_route' | 'holding' | 'rerouted' | 'conflict' | 'landing' | 'landed';

export interface Position3D {
  x: number; // 0 to 1000 coordinate space
  y: number; // 0 to 1000 coordinate space
  altitudeFt: number; // feet MSL/AGL
}

export interface Waypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  altitudeFt: number;
}

export interface Aircraft {
  id: string;
  callsign: string;
  category: VehicleCategory;
  model: string;
  operator: string;
  position: Position3D;
  headingDeg: number;
  speedKts: number;
  targetSpeedKts: number;
  batteryPct?: number;
  fuelPct?: number;
  status: FlightStatus;
  origin: string;
  destination: string;
  assignedCorridorId?: string;
  route: Waypoint[];
  currentWaypointIndex: number;
  operationalIntentId: string;
  communicationStatus: 'connected' | 'degraded' | 'relay_mode' | 'lost';
  dfrCompliant: boolean;
  geofenceRadiusMeters: number;
  telemetryHistory: { timestamp: number; x: number; y: number; altitudeFt: number; speedKts: number }[];
}

export interface AirCorridorLane {
  id: string;
  name: string;
  direction: string;
  tierAltitudeFt: number;
  entryX: number;
  entryY: number;
  exitX: number;
  exitY: number;
  speedLimitKts: number;
}

export interface AirCorridor {
  id: string;
  name: string;
  code: string;
  minAltitudeFt: number;
  maxAltitudeFt: number;
  waypoints: { x: number; y: number }[];
  widthMeters: number;
  status: 'active' | 'congested' | 'restricted';
  lanes: AirCorridorLane[];
  hasRoundabout?: boolean;
  roundaboutCenter?: { x: number; y: number };
}

export interface Vertiport {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  altitudeFt: number;
  padsCount: number;
  occupiedPads: number;
  status: 'open' | 'capacity_warning' | 'closed';
  supportedCategories: VehicleCategory[];
}

export interface WeatherEvent {
  id: string;
  type: 'microburst' | 'high_winds' | 'thunderstorm' | 'fog_low_visibility';
  title: string;
  x: number;
  y: number;
  radius: number; // in map units
  severity: 'low' | 'moderate' | 'severe' | 'critical';
  windSpeedKts: number;
  windDirectionDeg: number;
  active: boolean;
  affectedCorridorId?: string;
}

export interface AirspaceZone {
  id: string;
  name: string;
  type: 'UVR_restricted' | 'class_b' | 'class_c' | 'class_d' | 'urban_canyon';
  x: number;
  y: number;
  width: number;
  height: number;
  floorFt: number;
  ceilingFt: number;
  active: boolean;
  reason: string;
  validUntil: string;
}

export interface ConflictAlert {
  id: string;
  timestamp: string;
  primaryVehicleId: string;
  secondaryVehicleId?: string;
  type: 'separation_loss' | 'weather_intrusion' | 'no_fly_violation' | 'corridor_bottleneck' | 'speed_differential';
  severity: 'advisory' | 'warning' | 'critical';
  horizontalDistanceKm?: number;
  verticalDistanceFt?: number;
  timeToCpaSec?: number; // closest point of approach
  resolved: boolean;
  autoResolvable: boolean;
  recommendedActions: DecisionOption[];
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  actionType: 'speed_reduction' | 'airborne_reroute' | 'altitude_shift' | 'vertiport_divert' | 'hold_pattern';
  estimatedDelaySec: number;
  fuelImpactPct: number;
  safetyScorePct: number; // 0-100
}

export interface CommMessage {
  id: string;
  timestamp: string;
  senderId: string;
  receiverId: string;
  type: 'direct_u2u' | 'multi_hop_relay' | 'psu_broadcast' | 'weather_coop';
  useCase: 'collision_avoidance' | 'merging_spacing' | 'airborne_separation' | 'airborne_reroute' | 'cooperative_sensing';
  content: string;
  hopCount: number;
  signalStrengthDbm: number;
}

export interface ModelCard {
  id: string;
  name: string;
  category: 'Strategic' | 'Tactical' | 'Operational' | 'Impact Assessment';
  resolution: 'Zone level' | 'Parcel / shipment level' | 'Trajectory level';
  originPaper: 'Namuduri 2023 (AAM)' | 'Belfadel et al. 2023 (City Logistics)';
  purpose: string;
  inputs: string[];
  outputs: string[];
  status: 'active' | 'standby' | 'running';
  executionTimeMs: number;
  fidelityScore: number;
}

export interface OperationalIntent {
  id: string;
  uasId: string;
  state: 'Draft' | 'Submitted' | 'DSS_Checked' | 'FIMS_Approved' | 'Active' | 'Closed';
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  maxAltitudeFt: number;
  assignedPSU: string;
  authorizedBy: string;
}

export interface EventLogEntry {
  id: string;
  timestamp: string;
  timeDisplay: string;
  category: 'telemetry' | 'dfr' | 'conflict' | 'comms' | 'weather' | 'decision' | 'system';
  severity: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  details: string;
  source: string;
}

export type AppView =
  | 'dashboard'
  | 'live_airspace'
  | 'digital_twin'
  | 'traffic_mgmt'
  | 'digital_flight_rules'
  | 'air_corridors'
  | 'u2u_comms'
  | 'autonomous_ops'
  | 'what_if_scenarios'
  | 'decision_support'
  | 'model_management'
  | 'system_architecture'
  | 'system_status'
  | 'event_log'
  | 'research_papers';
