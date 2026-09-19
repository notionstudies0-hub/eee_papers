import React from 'react';
import {
  LayoutDashboard,
  Radar,
  Network,
  GitBranch,
  ShieldCheck,
  Split,
  MessageSquareShare,
  Bot,
  SlidersHorizontal,
  Scale,
  Database,
  Workflow,
  HeartPulse,
  ScrollText,
  BookOpen,
  X,
  Compass,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';
import { AppView } from '../types/airspace';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  section: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    alerts,
    commMessages,
    aircraft,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useAirspace();

  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const activeUas = aircraft.filter((a) => a.category === 'uas' && a.status !== 'landed').length;

  const navItems: NavItem[] = [
    // Operations Group
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, section: 'OPERATIONS' },
    { id: 'live_airspace', label: 'Live Airspace Radar', icon: Radar, badge: aircraft.length, section: 'OPERATIONS' },
    { id: 'digital_twin', label: 'Digital Twin Model', icon: Network, badge: 'SYNC', badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40', section: 'OPERATIONS' },
    { id: 'traffic_mgmt', label: 'Traffic Management (PSU)', icon: GitBranch, section: 'OPERATIONS' },

    // Digital Flight & Autonomy
    { id: 'digital_flight_rules', label: 'Digital Flight Rules (DFR)', icon: ShieldCheck, section: 'RULES & CORRIDORS' },
    { id: 'air_corridors', label: 'Air Corridors (3D Lanes)', icon: Split, section: 'RULES & CORRIDORS' },
    { id: 'u2u_comms', label: 'UAS-to-UAS Comms', icon: MessageSquareShare, badge: commMessages.length, section: 'RULES & CORRIDORS' },
    { id: 'autonomous_ops', label: 'Autonomous Operations', icon: Bot, badge: `${activeUas} UAS`, section: 'RULES & CORRIDORS' },

    // Simulation & Decision
    { id: 'what_if_scenarios', label: 'What-If Simulations', icon: SlidersHorizontal, badge: '7 Cases', section: 'ANALYTICS & DECISION' },
    {
      id: 'decision_support',
      label: 'Decision Support',
      icon: Scale,
      badge: activeAlerts > 0 ? activeAlerts : undefined,
      badgeColor: 'text-rose-300 bg-rose-950/80 border-rose-800/60 animate-pulse',
      section: 'ANALYTICS & DECISION',
    },

    // Computing Architecture & Data
    { id: 'model_management', label: 'Model Library & M2', icon: Database, section: 'SYSTEM ARCHITECTURE' },
    { id: 'system_architecture', label: 'Architecture & Feedback', icon: Workflow, section: 'SYSTEM ARCHITECTURE' },
    { id: 'system_status', label: 'System Health Status', icon: HeartPulse, section: 'SYSTEM ARCHITECTURE' },
    { id: 'event_log', label: 'Event & Alert Log', icon: ScrollText, section: 'SYSTEM ARCHITECTURE' },

    // Research Integration
    { id: 'research_papers', label: 'Paper Synthesis & Limits', icon: BookOpen, section: 'RESEARCH CONTEXT' },
  ];

  // Group items by section
  const sections = Array.from(new Set(navItems.map((item) => item.section)));

  const handleSelectView = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full overflow-y-auto select-none p-3 space-y-4">
      {/* Mobile Drawer Header with Close Button */}
      <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-800 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-bold text-xs text-white uppercase tracking-wider">
              AAM Airspace System
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">15 Operational Modules</div>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {sections.map((sectionName) => (
        <div key={sectionName}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-semibold">
            {sectionName}
          </div>
          <div className="space-y-0.5 mt-1">
            {navItems
              .filter((item) => item.section === sectionName)
              .map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 lg:py-2 rounded-lg text-xs font-medium transition group text-left min-h-[44px] lg:min-h-0 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 active:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition shrink-0 ${
                          isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                          item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      ))}

      {/* Footer Academic Notice */}
      <div className="mt-auto p-3 m-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
          Closed-Loop Airspace
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          Physical Telemetry ↔ Digitized Airspace ↔ Virtual Twin ↔ MMS Orchestration ↔ Actions.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar (Visible on lg+ screens) */}
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800 flex-col h-[calc(100vh-4rem)] shrink-0 select-none">
        {navContent}
      </aside>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>
    </>
  );
};
