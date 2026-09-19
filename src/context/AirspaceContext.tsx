import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Aircraft,
  AirCorridor,
  AirspaceZone,
  AppView,
  CommMessage,
  ConflictAlert,
  DecisionOption,
  EventLogEntry,
  ModelCard,
  OperationalIntent,
  Position3D,
  Vertiport,
  WeatherEvent,
} from '../types/airspace';
import {
  INITIAL_AIRCRAFT,
  INITIAL_CORRIDORS,
  INITIAL_EVENT_LOGS,
  INITIAL_MODEL_LIBRARY,
  INITIAL_OPERATIONAL_INTENTS,
  INITIAL_VERTIPORTS,
  INITIAL_WEATHER,
  INITIAL_ZONES,
  INITIAL_COMM_MESSAGES,
} from '../data/initialAirspace';

export interface DemoMissionState {
  active: boolean;
  step: number;
  totalSteps: number;
  title: string;
  narrative: string;
  highlightedElement?: string;
  isAutoPlaying: boolean;
  requiresUserAction?: boolean;
}

interface DigitalTwinMetrics {
  status: 'SYNCHRONIZED' | 'UPDATING' | 'DEGRADED';
  freshnessSec: number;
  telemetryIngestionRateHz: number;
  bidirectionalActive: boolean;
  activeSensorsCount: number;
  lastSyncTimestamp: string;
  modelDriftPct: number;
}

interface AirspaceContextType {
  // Views & Selection
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  selectedCorridorId: string | null;
  setSelectedCorridorId: (id: string | null) => void;

  // Airspace Entities
  aircraft: Aircraft[];
  vertiports: Vertiport[];
  corridors: AirCorridor[];
  weather: WeatherEvent[];
  zones: AirspaceZone[];
  alerts: ConflictAlert[];
  commMessages: CommMessage[];
  models: ModelCard[];
  operationalIntents: OperationalIntent[];
  eventLogs: EventLogEntry[];

  // Simulation Controls & Modes
  simulationMode: 'human' | 'automation';
  setSimulationMode: (mode: 'human' | 'automation') => void;
  autonomyLevel: number; // 1 to 4
  setAutonomyLevel: (lvl: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  simSpeed: number; // 1, 2, 5
  setSimSpeed: (speed: number) => void;
  dtMetrics: DigitalTwinMetrics;

  // Demo Mission
  demoMission: DemoMissionState;
  startDemoMission: () => void;
  stopDemoMission: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  toggleDemoAutoPlay: () => void;

  // Interactive Scenario Triggers & Actions
  triggerWeatherHazard: (active?: boolean) => void;
  triggerNoFlyZone: (active?: boolean) => void;
  triggerLeadUasDeceleration: () => void;
  triggerProximityConflict: () => void;
  resolveAlertWithAction: (alertId: string, actionId: string) => void;
  sendCustomU2UMessage: (senderId: string, receiverId: string, content: string, useCase: CommMessage['useCase']) => void;
  executeWhatIfScenario: (scenarioId: string) => void;
  resetAirspaceToDefault: () => void;
  clearEventLogs: () => void;
  addCustomVehicle: (category: 'aam' | 'uas', callsign: string, origin: string, destination: string) => void;
}

const AirspaceContext = createContext<AirspaceContextType | undefined>(undefined);

export const AirspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('UAS-01');

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string | null>('CORRIDOR-CHARLIE');

  const [aircraft, setAircraft] = useState<Aircraft[]>(INITIAL_AIRCRAFT);
  const [vertiports] = useState<Vertiport[]>(INITIAL_VERTIPORTS);
  const [corridors, setCorridors] = useState<AirCorridor[]>(INITIAL_CORRIDORS);
  const [weather, setWeather] = useState<WeatherEvent[]>(INITIAL_WEATHER);
  const [zones, setZones] = useState<AirspaceZone[]>(INITIAL_ZONES);
  const [alerts, setAlerts] = useState<ConflictAlert[]>([]);
  const [commMessages, setCommMessages] = useState<CommMessage[]>(INITIAL_COMM_MESSAGES);
  const [models, setModels] = useState<ModelCard[]>(INITIAL_MODEL_LIBRARY);
  const [operationalIntents] = useState<OperationalIntent[]>(INITIAL_OPERATIONAL_INTENTS);
  const [eventLogs, setEventLogs] = useState<EventLogEntry[]>(INITIAL_EVENT_LOGS);

  const [simulationMode, setSimulationMode] = useState<'human' | 'automation'>('human');
  const [autonomyLevel, setAutonomyLevel] = useState<number>(3); // Level 3 (Human Monitored)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  const [dtMetrics, setDtMetrics] = useState<DigitalTwinMetrics>({
    status: 'SYNCHRONIZED',
    freshnessSec: 0.4,
    telemetryIngestionRateHz: 24,
    bidirectionalActive: true,
    activeSensorsCount: 42,
    lastSyncTimestamp: new Date().toISOString(),
    modelDriftPct: 1.2,
  });

  const [demoMission, setDemoMission] = useState<DemoMissionState>({
    active: false,
    step: 0,
    totalSteps: 16,
    title: 'UAS-01 Autonomous Delivery Demonstration',
    narrative: 'Initiate a complete closed-loop delivery from Vertiport Alpha through Sky Corridor Charlie to Vertiport Beta.',
    isAutoPlaying: false,
    requiresUserAction: false,
  });

  const addEventLog = useCallback((
    category: EventLogEntry['category'],
    severity: EventLogEntry['severity'],
    title: string,
    details: string,
    source: string
  ) => {
    const now = new Date();
    const timeDisplay = now.toTimeString().split(' ')[0];
    const newEntry: EventLogEntry = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: now.toISOString(),
      timeDisplay,
      category,
      severity,
      title,
      details,
      source,
    };
    setEventLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  }, []);

  // Distance helper in 2D coordinate space
  const getDistance = (p1: Position3D, p2: Position3D) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Main Simulation Tick Engine
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const dt = ((now - lastTickRef.current) / 1000) * simSpeed;
      lastTickRef.current = now;

      // Update positions
      setAircraft((prevAircraft) => {
        return prevAircraft.map((plane) => {
          if (plane.status === 'landed') return plane;

          // Target current waypoint
          const targetWp = plane.route[plane.currentWaypointIndex];
          if (!targetWp) return plane;

          const dx = targetWp.x - plane.position.x;
          const dy = targetWp.y - plane.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Update heading towards waypoint
          const desiredHeading = (Math.atan2(dy, dx) * 180) / Math.PI;

          // Smooth move
          const speedFactor = (plane.speedKts / 60) * 8 * dt; // simulated movement rate
          let nextX = plane.position.x;
          let nextY = plane.position.y;
          let nextAlt = plane.position.altitudeFt;
          let nextIndex = plane.currentWaypointIndex;
          let nextStatus = plane.status;

          if (dist < 15) {
            // Reached waypoint
            if (plane.currentWaypointIndex < plane.route.length - 1) {
              nextIndex = plane.currentWaypointIndex + 1;
            } else {
              nextStatus = 'landing';
            }
          } else {
            nextX += (dx / dist) * speedFactor;
            nextY += (dy / dist) * speedFactor;
            // Altitude interpolation
            const altDiff = targetWp.altitudeFt - plane.position.altitudeFt;
            if (Math.abs(altDiff) > 5) {
              nextAlt += Math.sign(altDiff) * Math.min(Math.abs(altDiff), 15 * dt);
            }
          }

          // Battery decrease for UAS
          const newBattery = plane.batteryPct !== undefined ? Math.max(5, plane.batteryPct - 0.01 * dt) : undefined;

          // Telemetry history append
          const newHist = [
            ...plane.telemetryHistory.slice(-15),
            { timestamp: now, x: Math.round(nextX), y: Math.round(nextY), altitudeFt: Math.round(nextAlt), speedKts: plane.speedKts },
          ];

          return {
            ...plane,
            position: { x: nextX, y: nextY, altitudeFt: nextAlt },
            headingDeg: Math.round((desiredHeading + 360) % 360),
            currentWaypointIndex: nextIndex,
            status: nextStatus,
            batteryPct: newBattery,
            telemetryHistory: newHist,
          };
        });
      });

      // Update Digital Twin Synchronization status
      setDtMetrics((prev) => ({
        ...prev,
        freshnessSec: +(0.2 + Math.random() * 0.4).toFixed(2),
        lastSyncTimestamp: new Date().toISOString(),
        modelDriftPct: +(1.0 + Math.random() * 0.5).toFixed(2),
      }));

    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  // Conflict and DFR rule checking engine
  useEffect(() => {
    const uas1 = aircraft.find((a) => a.id === 'UAS-01');
    const uas2 = aircraft.find((a) => a.id === 'UAS-02');

    if (uas1 && uas2) {
      const dist = getDistance(uas1.position, uas2.position);
      const altDiff = Math.abs(uas1.position.altitudeFt - uas2.position.altitudeFt);

      // Check Digital Flight Rule: Following in same corridor lane
      // If UAS-01 slowed down, and UAS-02 is trailing within 90 map units (approx ~1.5km)
      if (dist < 95 && altDiff < 150) {
        if (uas2.speedKts >= uas1.speedKts) {
          const alertExists = alerts.some((al) => al.id === 'ALERT-DFR-SEPARATION-01' && !al.resolved);
          if (!alertExists) {
            const newAlert: ConflictAlert = {
              id: 'ALERT-DFR-SEPARATION-01',
              timestamp: new Date().toLocaleTimeString(),
              primaryVehicleId: 'UAS-02',
              secondaryVehicleId: 'UAS-01',
              type: 'separation_loss',
              severity: 'warning',
              horizontalDistanceKm: +(dist * 0.02).toFixed(2),
              verticalDistanceFt: altDiff,
              timeToCpaSec: 28,
              resolved: false,
              autoResolvable: true,
              recommendedActions: [
                {
                  id: 'ACT-DFR-SPEED',
                  title: 'Option A: Cooperative Speed Throttling',
                  description: 'Throttle UAS-02 speed from 52kts to 38kts to match lead vessel and preserve 1,200m separation interval.',
                  actionType: 'speed_reduction',
                  estimatedDelaySec: 45,
                  fuelImpactPct: -2,
                  safetyScorePct: 98,
                },
                {
                  id: 'ACT-DFR-ALTITUDE',
                  title: 'Option B: Dynamic Altitude Separation (Climb 200ft)',
                  description: 'Climb UAS-02 to 800ft AGL to establish vertical separation layer while maintaining speed.',
                  actionType: 'altitude_shift',
                  estimatedDelaySec: 10,
                  fuelImpactPct: 3,
                  safetyScorePct: 92,
                },
                {
                  id: 'ACT-DFR-HOLD',
                  title: 'Option C: Orbital Holding Pattern at Waypoint',
                  description: 'Command UAS-02 to enter 180s holding circle at Spine Waypoint until corridor clears.',
                  actionType: 'hold_pattern',
                  estimatedDelaySec: 180,
                  fuelImpactPct: 6,
                  safetyScorePct: 99,
                },
              ],
            };

            setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
            addEventLog(
              'dfr',
              'warning',
              'Digital Flight Rule Event: Following Separation',
              `UAS-02 proximity to lead UAS-01 is ${dist.toFixed(0)}m. Automated cooperative separation triggered.`,
              'DFR Engine'
            );

            // If in Automation Mode, auto resolve Option A!
            if (simulationMode === 'automation') {
              setTimeout(() => {
                resolveAlertWithAction('ALERT-DFR-SEPARATION-01', 'ACT-DFR-SPEED');
              }, 1200);
            }
          }
        }
      }
    }

    // Check Weather Intrusion for UAS-01
    const activeMicroburst = weather.find((w) => w.id === 'WX-MICROBURST-01' && w.active);
    if (activeMicroburst && uas1) {
      const distToWeather = Math.sqrt(
        Math.pow(uas1.position.x - activeMicroburst.x, 2) + Math.pow(uas1.position.y - activeMicroburst.y, 2)
      );

      if (distToWeather < activeMicroburst.radius + 60) {
        const weatherAlertExists = alerts.some((al) => al.id === 'ALERT-WEATHER-MICROBURST' && !al.resolved);
        if (!weatherAlertExists) {
          const wxAlert: ConflictAlert = {
            id: 'ALERT-WEATHER-MICROBURST',
            timestamp: new Date().toLocaleTimeString(),
            primaryVehicleId: 'UAS-01',
            type: 'weather_intrusion',
            severity: 'critical',
            horizontalDistanceKm: +(distToWeather * 0.02).toFixed(2),
            timeToCpaSec: 18,
            resolved: false,
            autoResolvable: true,
            recommendedActions: [
              {
                id: 'ACT-WX-REROUTE-BYPASS',
                title: 'Option A: Western Bypass Air Corridor',
                description: 'Divert UAS-01 via West Civic Waypoint to circumvent severe shear zone (+3.2 km distance).',
                actionType: 'airborne_reroute',
                estimatedDelaySec: 140,
                fuelImpactPct: 5,
                safetyScorePct: 97,
              },
              {
                id: 'ACT-WX-DIVERT-MED',
                title: 'Option B: Immediate Precautionary Landing at Medical Port',
                description: 'Land safely at Medical District Vertiport Delta 2.8 km away and wait out wind shear.',
                actionType: 'vertiport_divert',
                estimatedDelaySec: 600,
                fuelImpactPct: -10,
                safetyScorePct: 99,
              },
              {
                id: 'ACT-WX-ALTITUDE-DESCENT',
                title: 'Option C: Low-Level Urban Canopy Descent (300ft AGL)',
                description: 'Descend beneath wind shear ceiling at reduced speed of 30kts (higher obstacle risk).',
                actionType: 'altitude_shift',
                estimatedDelaySec: 90,
                fuelImpactPct: 2,
                safetyScorePct: 74,
              },
            ],
          };

          setAlerts((prev) => [wxAlert, ...prev.filter((a) => a.id !== wxAlert.id)]);
          addEventLog(
            'weather',
            'critical',
            'Severe Weather Intrusion Hazard',
            'UAS-01 trajectory intersects Microburst UVR at Sky Corridor Charlie. Alternative flight path required.',
            'Weather Model'
          );

          if (simulationMode === 'automation') {
            setTimeout(() => {
              resolveAlertWithAction('ALERT-WEATHER-MICROBURST', 'ACT-WX-REROUTE-BYPASS');
            }, 1500);
          }
        }
      }
    }
  }, [aircraft, weather, alerts, simulationMode, addEventLog]);

  // Alert Resolution Handler (Human or Automation)
  const resolveAlertWithAction = useCallback((alertId: string, actionId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((al) => {
        if (al.id === alertId) {
          return { ...al, resolved: true };
        }
        return al;
      })
    );

    if (actionId === 'ACT-DFR-SPEED') {
      // Slow down UAS-02
      setAircraft((prev) =>
        prev.map((a) => {
          if (a.id === 'UAS-02') {
            return { ...a, speedKts: 36, targetSpeedKts: 36, status: 'en_route' };
          }
          return a;
        })
      );

      // Dispatch U2U acknowledgment message
      const newMsg: CommMessage = {
        id: `MSG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        senderId: 'UAS-02',
        receiverId: 'UAS-01',
        type: 'direct_u2u',
        useCase: 'airborne_separation',
        content: 'DFR_RESPONSE: Throttled speed to 36 kts. Safe separation buffer 1,500m established.',
        hopCount: 1,
        signalStrengthDbm: -65,
      };
      setCommMessages((prev) => [newMsg, ...prev]);

      addEventLog(
        'dfr',
        'success',
        'DFR Action Executed: Speed Throttled',
        `UAS-02 adjusted speed to 36kts (${simulationMode === 'human' ? 'Operator Human Approval' : 'Automated DFR Rule Engine'}). Safe separation maintained.`,
        'Decision Support'
      );
    } else if (actionId === 'ACT-WX-REROUTE-BYPASS') {
      // Reroute UAS-01 around weather
      setAircraft((prev) =>
        prev.map((a) => {
          if (a.id === 'UAS-01') {
            return {
              ...a,
              status: 'rerouted',
              route: [
                { id: 'W-0', name: 'Alpha Dep', x: a.position.x, y: a.position.y, altitudeFt: 550 },
                { id: 'W-WX-BYPASS', name: 'West Bypass WP', x: 380, y: 380, altitudeFt: 650 },
                { id: 'W-WX-SAFE', name: 'Clear Sky Lane', x: 620, y: 280, altitudeFt: 600 },
                { id: 'W-4', name: 'Beta Approach', x: 810, y: 230, altitudeFt: 620 },
              ],
              currentWaypointIndex: 1,
            };
          }
          return a;
        })
      );

      // Broadcast U2U reroute alert
      const newMsg: CommMessage = {
        id: `MSG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        senderId: 'UAS-01',
        receiverId: 'PSU-North-Texas-01',
        type: 'psu_broadcast',
        useCase: 'airborne_reroute',
        content: 'REROUTE_CONFIRMED: Executing Western Bypass around Microburst WX-01. ETA adjusted +140s.',
        hopCount: 1,
        signalStrengthDbm: -70,
      };
      setCommMessages((prev) => [newMsg, ...prev]);

      addEventLog(
        'decision',
        'success',
        'Airborne Reroute Executed',
        `UAS-01 diverts via West Bypass Waypoint avoiding severe turbulence zone. Digital Twin synchronized.`,
        'MMS Orchestrator'
      );
    } else if (actionId === 'ACT-DFR-ALTITUDE') {
      setAircraft((prev) =>
        prev.map((a) => {
          if (a.id === 'UAS-02') {
            return {
              ...a,
              position: { ...a.position, altitudeFt: 850 },
              status: 'en_route',
            };
          }
          return a;
        })
      );
      addEventLog('dfr', 'success', 'DFR Altitude Shift Executed', 'UAS-02 climbed to 850ft AGL vertical stratum.', 'Decision Support');
    }
  }, [simulationMode, addEventLog]);

  // Demo Mission Step Walkthrough (16 Steps from Section 34 of prompt)
  const executeDemoStep = useCallback((stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        setDemoMission((prev) => ({
          ...prev,
          step: 0,
          title: 'Step 1: Mission Planning & Intent Submission',
          narrative: 'UAS-01 is assigned from Vertiport Alpha (Downtown) to Vertiport Beta (North Gate). Operational Intent OI-2026-0811 is verified by PSU and FIMS.',
        }));
        setSelectedVehicleId('UAS-01');
        break;
      case 1:
        setDemoMission((prev) => ({
          ...prev,
          step: 1,
          title: 'Step 2: Flight Initiation & Liftoff',
          narrative: 'UAS-01 takes off autonomously from Vertiport Alpha. Digital twin establishes initial sensor correspondence.',
        }));
        addEventLog('telemetry', 'info', 'Demo Step 2: UAS-01 Airborne', 'UAS-01 ascending to 550ft AGL entering Corridor Charlie.', 'PSU-01');
        break;
      case 2:
        setDemoMission((prev) => ({
          ...prev,
          step: 2,
          title: 'Step 3: Digital Twin Real-Time Synchronization',
          narrative: 'Sensors stream GPS, velocity, and battery at 24Hz. Digital Twin creates synchronized virtual replica with 0.3s freshness.',
        }));
        setDtMetrics((prev) => ({ ...prev, status: 'SYNCHRONIZED', freshnessSec: 0.3 }));
        break;
      case 3:
        setDemoMission((prev) => ({
          ...prev,
          step: 3,
          title: 'Step 4: Corridor Entry & Telemetry Ingestion',
          narrative: 'UAS-01 joins Northbound Express Lane in Sky Corridor Charlie. Telemetry confirmed by Kafka/Context Broker pipeline.',
        }));
        break;
      case 4:
        setDemoMission((prev) => ({
          ...prev,
          step: 4,
          title: 'Step 5: Traffic Interaction Detection (UAS-02 Approaches)',
          narrative: 'UAS-02 enters the same lane trailing UAS-01 at 52 kts. The Model Management System detects convergence in the 3D corridor.',
        }));
        addEventLog('traffic_mgmt' as any, 'warning', 'Corridor Traffic Interaction', 'UAS-02 and UAS-01 detected in shared segment. Separation monitoring active.', 'MMS');
        break;
      case 5:
        setDemoMission((prev) => ({
          ...prev,
          step: 5,
          title: 'Step 6: UAS-to-UAS Direct Communication Handshake',
          narrative: 'RTCA Use Case #3: Autonomous vessels establish direct sidelink. UAS-01 broadcasts telemetry; UAS-02 verifies spacing.',
        }));
        setCommMessages((prev) => [
          {
            id: `MSG-DEMO-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            senderId: 'UAS-01',
            receiverId: 'UAS-02',
            type: 'direct_u2u',
            useCase: 'airborne_separation',
            content: 'U2U_HANDSHAKE: Lead position lock. Telemetry broadcast active at 10Hz.',
            hopCount: 1,
            signalStrengthDbm: -62,
          },
          ...prev,
        ]);
        break;
      case 6:
        setDemoMission((prev) => ({
          ...prev,
          step: 6,
          title: 'Step 7: Digital Flight Rule Speed Throttling Check',
          narrative: 'Lead UAS-01 slows for corridor terrain. Separation loss predicted. DFR separation logic engages to throttle following vehicle.',
        }));
        // Slow UAS-01 slightly to create realistic following situation
        setAircraft((prev) =>
          prev.map((a) => (a.id === 'UAS-01' ? { ...a, speedKts: 34, targetSpeedKts: 35 } : a))
        );
        break;
      case 7:
        setDemoMission((prev) => ({
          ...prev,
          step: 7,
          title: 'Step 8: Sudden Microburst Weather Event Injected',
          narrative: 'Atmospheric sensor reports localized wind shear (38 kts) across Corridor Charlie ahead of UAS-01. UVR hazard generated.',
        }));
        setWeather((prev) =>
          prev.map((w) => (w.id === 'WX-MICROBURST-01' ? { ...w, active: true } : w))
        );
        break;
      case 8:
        setDemoMission((prev) => ({
          ...prev,
          step: 8,
          title: 'Step 9: Corridor Intersection & Risk Flagged',
          narrative: 'Model Library (Weather Model + Conflict Model) detects critical route hazard. Corridor segment marked hazardous.',
        }));
        break;
      case 9:
        setDemoMission((prev) => ({
          ...prev,
          step: 9,
          title: 'Step 10: Alternative Conflict-Free Route Generated',
          narrative: 'VRP and Traffic models calculate optimal bypass corridor via West Waypoint, avoiding the turbulence boundary.',
        }));
        break;
      case 10:
        setDemoMission((prev) => ({
          ...prev,
          step: 10,
          title: 'Step 11: Decision Support Interface Active',
          narrative: `Presented with 3 triage options: A) West Bypass (+140s), B) Divert to Medical Port, C) Low Altitude Penetration. Current Mode: ${simulationMode.toUpperCase()}.`,
        }));
        break;
      case 11:
        setDemoMission((prev) => ({
          ...prev,
          step: 11,
          title: 'Step 12: Decision Selected & Executed',
          narrative: 'Option A (West Bypass Corridor) confirmed. Instructions dispatched via DIS Push Service to UAS-01 onboard autopilot.',
        }));
        resolveAlertWithAction('ALERT-WEATHER-MICROBURST', 'ACT-WX-REROUTE-BYPASS');
        break;
      case 12:
        setDemoMission((prev) => ({
          ...prev,
          step: 12,
          title: 'Step 13: Autonomous In-Flight Rerouting',
          narrative: 'UAS-01 veers West around the microburst. Physical trajectory diverges safely from original hazardous flight path.',
        }));
        break;
      case 13:
        setDemoMission((prev) => ({
          ...prev,
          step: 13,
          title: 'Step 14: Digital Twin Virtual Replica Updated',
          narrative: 'Digital Twin receives refreshed GPS coordinates from telemetry stream, reflecting new bypass path in real-time.',
        }));
        break;
      case 14:
        setDemoMission((prev) => ({
          ...prev,
          step: 14,
          title: 'Step 15: Corridor Re-entry & Approach to Destination',
          narrative: 'UAS-01 clears storm boundary and lines up with North Gate Vertiport Beta descent corridor.',
        }));
        break;
      case 15:
        setDemoMission((prev) => ({
          ...prev,
          step: 15,
          title: 'Step 16: Safe Touchdown & Closed-Loop Confirmation',
          narrative: 'Touchdown confirmed at Vertiport Beta Pad #2. Final telemetry confirms 0 safety violations. Closed-loop complete!',
        }));
        // Move UAS-01 near target and land
        setAircraft((prev) =>
          prev.map((a) =>
            a.id === 'UAS-01'
              ? {
                  ...a,
                  position: { x: 818, y: 222, altitudeFt: 620 },
                  status: 'landed',
                  speedKts: 0,
                }
              : a
          )
        );
        addEventLog('telemetry', 'success', 'Demo Mission Complete', 'UAS-01 safely landed at Vertiport Beta. Digital Twin closed loop successfully verified.', 'Operations Center');
        break;
      default:
        break;
    }
  }, [simulationMode, addEventLog, resolveAlertWithAction]);

  const startDemoMission = useCallback(() => {
    setDemoMission({
      active: true,
      step: 0,
      totalSteps: 16,
      title: 'Step 1: Mission Planning & Intent Submission',
      narrative: 'Initiating full automated mission demonstration for UAS-01.',
      isAutoPlaying: false,
    });
    // Reset positions slightly for clean demo
    setAircraft((prev) =>
      prev.map((a) => {
        if (a.id === 'UAS-01') {
          return {
            ...a,
            position: { x: 210, y: 650, altitudeFt: 550 },
            speedKts: 48,
            status: 'en_route',
            currentWaypointIndex: 1,
            route: [
              { id: 'W-0', name: 'Alpha Dep', x: 210, y: 650, altitudeFt: 550 },
              { id: 'W-1', name: 'Corridor Spine 1', x: 380, y: 520, altitudeFt: 600 },
              { id: 'W-2', name: 'Roundabout Waypoint', x: 500, y: 450, altitudeFt: 600 },
              { id: 'W-3', name: 'North Leg', x: 680, y: 320, altitudeFt: 600 },
              { id: 'W-4', name: 'Beta Approach', x: 810, y: 230, altitudeFt: 620 },
            ],
          };
        }
        if (a.id === 'UAS-02') {
          return {
            ...a,
            position: { x: 280, y: 595, altitudeFt: 600 },
            speedKts: 52,
            status: 'en_route',
          };
        }
        return a;
      })
    );
    setWeather((prev) => prev.map((w) => (w.id === 'WX-MICROBURST-01' ? { ...w, active: false } : w)));
    setAlerts([]);
    executeDemoStep(0);
  }, [executeDemoStep]);

  const stopDemoMission = useCallback(() => {
    setDemoMission((prev) => ({ ...prev, active: false, isAutoPlaying: false }));
  }, []);

  const nextDemoStep = useCallback(() => {
    setDemoMission((prev) => {
      const next = Math.min(prev.totalSteps - 1, prev.step + 1);
      executeDemoStep(next);
      return { ...prev, step: next };
    });
  }, [executeDemoStep]);

  const prevDemoStep = useCallback(() => {
    setDemoMission((prev) => {
      const prevStep = Math.max(0, prev.step - 1);
      executeDemoStep(prevStep);
      return { ...prev, step: prevStep };
    });
  }, [executeDemoStep]);

  const toggleDemoAutoPlay = useCallback(() => {
    setDemoMission((prev) => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  }, []);

  // Handle Demo auto-play interval
  useEffect(() => {
    if (!demoMission.active || !demoMission.isAutoPlaying) return;

    const timer = setInterval(() => {
      setDemoMission((prev) => {
        if (prev.step >= prev.totalSteps - 1) {
          return { ...prev, isAutoPlaying: false };
        }
        const next = prev.step + 1;
        executeDemoStep(next);
        return { ...prev, step: next };
      });
    }, 4500 / simSpeed);

    return () => clearInterval(timer);
  }, [demoMission.active, demoMission.isAutoPlaying, simSpeed, executeDemoStep]);

  // Quick Action: Trigger Weather Hazard
  const triggerWeatherHazard = useCallback((forceActive?: boolean) => {
    setWeather((prev) =>
      prev.map((w) => {
        if (w.id === 'WX-MICROBURST-01') {
          const newState = forceActive !== undefined ? forceActive : !w.active;
          addEventLog(
            'weather',
            newState ? 'critical' : 'info',
            newState ? 'Weather Event Injected: Severe Microburst' : 'Weather Hazard Cleared',
            newState
              ? 'Localized 38kt wind shear active in Corridor Charlie. Digital Twin calculating impacted routes.'
              : 'Microburst subsided. Standard corridor operations restored.',
            'Doppler Radar Feeder'
          );
          return { ...w, active: newState };
        }
        return w;
      })
    );
  }, [addEventLog]);

  // Quick Action: Trigger No-Fly Zone
  const triggerNoFlyZone = useCallback((forceActive?: boolean) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === 'UVR-EMERGENCY-01') {
          const newState = forceActive !== undefined ? forceActive : !z.active;
          addEventLog(
            'system',
            newState ? 'warning' : 'info',
            newState ? 'No-Fly Zone Activated: UVR-01 Civic Center' : 'UVR-01 Airspace Restriction Lifted',
            newState
              ? 'ASTM WK63418 restriction active up to 1,500ft AGL for VIP security escort. Flight paths intersecting must reroute.'
              : 'UVR restriction expired. Airspace reclaimed for normal UTM traffic.',
            'ASTM UVR Manager'
          );
          return { ...z, active: newState };
        }
        return z;
      })
    );
  }, [addEventLog]);

  // Quick Action: Trigger Lead UAS deceleration to show following UAS deceleration
  const triggerLeadUasDeceleration = useCallback(() => {
    setAircraft((prev) =>
      prev.map((a) => {
        if (a.id === 'UAS-01') {
          const newSpeed = a.speedKts > 35 ? 26 : 48;
          addEventLog(
            'dfr',
            'warning',
            `Lead UAS-01 Speed Throttled to ${newSpeed} kts`,
            `Simulating lead aircraft speed change to trigger trailing vessel cooperative DFR separation response.`,
            'Telemetry Feeder'
          );
          return { ...a, speedKts: newSpeed, targetSpeedKts: newSpeed };
        }
        return a;
      })
    );
  }, [addEventLog]);

  // Quick Action: Trigger proximity conflict
  const triggerProximityConflict = useCallback(() => {
    const conflictUas: Aircraft = {
      id: `UAS-CROSS-${Date.now().toString().slice(-4)}`,
      callsign: 'ROBOT-CROSS-9',
      category: 'uas',
      model: 'Wing Delivery Drone',
      operator: 'Independent Express Delivery',
      position: { x: 360, y: 550, altitudeFt: 600 },
      headingDeg: 310,
      speedKts: 50,
      targetSpeedKts: 50,
      batteryPct: 88,
      status: 'en_route',
      origin: 'VP-ALPHA',
      destination: 'VP-DELTA',
      operationalIntentId: 'OI-CROSS-01',
      communicationStatus: 'connected',
      dfrCompliant: true,
      geofenceRadiusMeters: 40,
      currentWaypointIndex: 1,
      route: [
        { id: 'CW-0', name: 'Start', x: 360, y: 550, altitudeFt: 600 },
        { id: 'CW-1', name: 'Intersect Charlie', x: 420, y: 500, altitudeFt: 600 },
        { id: 'CW-2', name: 'Dest', x: 350, y: 350, altitudeFt: 580 },
      ],
      telemetryHistory: [],
    };

    setAircraft((prev) => [conflictUas, ...prev]);
    addEventLog('conflict', 'warning', 'Crossing Traffic Injected', 'Non-scheduled UAS entering Corridor Charlie convergence sector.', 'Tactical Radar');
  }, [addEventLog]);

  // Send Custom U2U Message
  const sendCustomU2UMessage = useCallback((
    senderId: string,
    receiverId: string,
    content: string,
    useCase: CommMessage['useCase']
  ) => {
    const newMsg: CommMessage = {
      id: `MSG-USER-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      senderId,
      receiverId,
      type: 'direct_u2u',
      useCase,
      content,
      hopCount: 1,
      signalStrengthDbm: -68,
    };
    setCommMessages((prev) => [newMsg, ...prev]);
    addEventLog('comms', 'info', `UAS-to-UAS Broadcast: ${useCase}`, `${senderId} -> ${receiverId}: "${content}"`, 'RTCA Sidelink');
  }, [addEventLog]);

  // Execute one of the 7 What-If Scenarios
  const executeWhatIfScenario = useCallback((scenarioId: string) => {
    switch (scenarioId) {
      case 'scenario_normal':
        resetAirspaceToDefault();
        addEventLog('system', 'info', 'What-If: Baseline Normal Traffic', 'Standard urban parcel and AAM schedules executed with nominal separation.', 'Scenario Runner');
        break;
      case 'scenario_weather':
        triggerWeatherHazard(true);
        addEventLog('weather', 'critical', 'What-If: Sudden Microburst Storm', 'Testing dynamic reroute response under sudden convective weather.', 'Scenario Runner');
        break;
      case 'scenario_corridor_congestion':
        setCorridors((prev) =>
          prev.map((c) => (c.id === 'CORRIDOR-CHARLIE' ? { ...c, status: 'congested' } : c))
        );
        addEventLog('traffic_mgmt' as any, 'warning', 'What-If: Corridor Congestion', 'Corridor Charlie density exceeded 12 UAS/km³. Metering and holding active.', 'Scenario Runner');
        break;
      case 'scenario_comms_failure':
        setAircraft((prev) =>
          prev.map((a) => (a.id === 'UAS-02' ? { ...a, communicationStatus: 'relay_mode' } : a))
        );
        addEventLog('comms', 'warning', 'What-If: Direct BRLOS Comms Degradation', 'UAS-02 lost direct line-of-sight. Engaging multi-hop relay mesh via UAS-01.', 'Scenario Runner');
        break;
      case 'scenario_nofly_active':
        triggerNoFlyZone(true);
        break;
      case 'scenario_speed_throttle':
        triggerLeadUasDeceleration();
        break;
      case 'scenario_vertiport_closed':
        setAircraft((prev) =>
          prev.map((a) => (a.destination === 'VP-BETA' ? { ...a, status: 'holding' } : a))
        );
        addEventLog('system', 'critical', 'What-If: Vertiport Beta Unavailable', 'Pads saturated. Aircraft instructed to enter holding stacks or divert to Delta.', 'Scenario Runner');
        break;
      default:
        break;
    }
  }, [addEventLog, triggerWeatherHazard, triggerNoFlyZone, triggerLeadUasDeceleration]);

  // Reset to Clean State
  const resetAirspaceToDefault = useCallback(() => {
    setAircraft(INITIAL_AIRCRAFT);
    setWeather(INITIAL_WEATHER);
    setZones(INITIAL_ZONES);
    setAlerts([]);
    setCorridors(INITIAL_CORRIDORS);
    setDemoMission((prev) => ({ ...prev, active: false, step: 0, isAutoPlaying: false }));
    addEventLog('system', 'info', 'Airspace System Reset', 'All vehicles, corridors, and simulated weather restored to default states.', 'System Admin');
  }, [addEventLog]);

  // Add Custom Vehicle
  const addCustomVehicle = useCallback((
    category: 'aam' | 'uas',
    callsign: string,
    origin: string,
    destination: string
  ) => {
    const isUas = category === 'uas';
    const newId = `${category.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newVehicle: Aircraft = {
      id: newId,
      callsign: callsign || `${category.toUpperCase()}-${newId}`,
      category,
      model: isUas ? 'Wingcopter Cargo UAS' : 'Joby S4 Passenger eVTOL',
      operator: 'Commercial Fleet Operator',
      position: { x: 220 + Math.random() * 100, y: 640 - Math.random() * 50, altitudeFt: isUas ? 500 : 1800 },
      headingDeg: 45,
      speedKts: isUas ? 45 : 120,
      targetSpeedKts: isUas ? 45 : 120,
      batteryPct: 95,
      status: 'en_route',
      origin,
      destination,
      operationalIntentId: `OI-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      communicationStatus: 'connected',
      dfrCompliant: true,
      geofenceRadiusMeters: isUas ? 40 : 120,
      currentWaypointIndex: 1,
      route: [
        { id: 'W-0', name: 'Dep', x: 220, y: 640, altitudeFt: isUas ? 500 : 1800 },
        { id: 'W-1', name: 'Enroute', x: 500, y: 450, altitudeFt: isUas ? 600 : 2000 },
        { id: 'W-2', name: 'Arr', x: 810, y: 230, altitudeFt: isUas ? 620 : 1500 },
      ],
      telemetryHistory: [],
    };

    setAircraft((prev) => [newVehicle, ...prev]);
    setSelectedVehicleId(newId);
    addEventLog('telemetry', 'info', `New ${category.toUpperCase()} Vehicle Inserted`, `${newVehicle.callsign} assigned to Sky Corridor route.`, 'Operator Input');
  }, [addEventLog]);

  const clearEventLogs = useCallback(() => {
    setEventLogs([]);
  }, []);

  return (
    <AirspaceContext.Provider
      value={{
        currentView,
        setCurrentView,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedCorridorId,
        setSelectedCorridorId,
        aircraft,
        vertiports,
        corridors,
        weather,
        zones,
        alerts,
        commMessages,
        models,
        operationalIntents,
        eventLogs,
        simulationMode,
        setSimulationMode,
        autonomyLevel,
        setAutonomyLevel,
        isPlaying,
        setIsPlaying,
        simSpeed,
        setSimSpeed,
        dtMetrics,
        demoMission,
        startDemoMission,
        stopDemoMission,
        nextDemoStep,
        prevDemoStep,
        toggleDemoAutoPlay,
        triggerWeatherHazard,
        triggerNoFlyZone,
        triggerLeadUasDeceleration,
        triggerProximityConflict,
        resolveAlertWithAction,
        sendCustomU2UMessage,
        executeWhatIfScenario,
        resetAirspaceToDefault,
        clearEventLogs,
        addCustomVehicle,
      }}
    >
      {children}
    </AirspaceContext.Provider>
  );
};

export const useAirspace = () => {
  const context = useContext(AirspaceContext);
  if (!context) {
    throw new Error('useAirspace must be used within an AirspaceProvider');
  }
  return context;
};
