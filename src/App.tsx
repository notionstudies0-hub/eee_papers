import React from 'react';
import { AirspaceProvider, useAirspace } from './context/AirspaceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { DemoMissionModal } from './components/DemoMissionModal';
import { DashboardOverview } from './components/DashboardOverview';
import { LiveAirspaceView } from './components/LiveAirspaceView';
import { DigitalTwinView } from './components/DigitalTwinView';
import { TrafficManagementView } from './components/TrafficManagementView';
import { DigitalFlightRulesView } from './components/DigitalFlightRulesView';
import { AirCorridorsView } from './components/AirCorridorsView';
import { UasCommunicationsView } from './components/UasCommunicationsView';
import { AutonomousOperationsView } from './components/AutonomousOperationsView';
import { SimulationWhatIfView } from './components/SimulationWhatIfView';
import { DecisionSupportView } from './components/DecisionSupportView';
import { DataModelManagementView } from './components/DataModelManagementView';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { SystemStatusView } from './components/SystemStatusView';
import { EventLogView } from './components/EventLogView';
import { ResearchContextView } from './components/ResearchContextView';
import { AppView } from './types/airspace';

const MainContent: React.FC = () => {
  const { currentView } = useAirspace();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'live_airspace':
        return <LiveAirspaceView />;
      case 'digital_twin':
        return <DigitalTwinView />;
      case 'traffic_mgmt':
        return <TrafficManagementView />;
      case 'digital_flight_rules':
        return <DigitalFlightRulesView />;
      case 'air_corridors':
        return <AirCorridorsView />;
      case 'u2u_comms':
        return <UasCommunicationsView />;
      case 'autonomous_ops':
        return <AutonomousOperationsView />;
      case 'what_if_scenarios':
        return <SimulationWhatIfView />;
      case 'decision_support':
        return <DecisionSupportView />;
      case 'model_management':
        return <DataModelManagementView />;
      case 'system_architecture':
        return <SystemArchitectureView />;
      case 'system_status':
        return <SystemStatusView />;
      case 'event_log':
        return <EventLogView />;
      case 'research_papers':
        return <ResearchContextView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
      {/* View Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6 pb-24 lg:pb-6">
        {renderView()}
      </main>

      {/* Engineering & Educational Disclaimer Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 sm:px-6 py-4 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 pb-24 lg:pb-4">
        <div>
          Advanced Air Mobility (AAM) Digital Twin Prototype • IEEE OJVT (Namuduri 2023) & CEUS (Belfadel et al. 2023)
        </div>
        <div className="text-slate-400 text-center sm:text-right">
          Research Simulation Platform — Not for Real-World Flight Control or Certified Avionics
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AirspaceProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Top Operational Navigation */}
        <Navbar />

        {/* Core Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>

        {/* Mobile Persistent Bottom Bar (Hidden on desktop) */}
        <MobileBottomBar />

        {/* Guided 16-Step Demo Mission Modal */}
        <DemoMissionModal />
      </div>
    </AirspaceProvider>
  );
}
