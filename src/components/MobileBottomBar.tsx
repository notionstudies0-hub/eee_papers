import React from 'react';
import {
  LayoutDashboard,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Menu,
  AlertTriangle,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';
import { AppView } from '../types/airspace';

export const MobileBottomBar: React.FC = () => {
  const { currentView, setCurrentView, toggleMobileMenu, alerts } = useAirspace();
  const activeAlerts = alerts.filter((a) => !a.resolved).length;

  const quickItems: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live_airspace', label: 'Radar', icon: Radar },
    { id: 'digital_flight_rules', label: 'DFR Rules', icon: ShieldCheck },
    { id: 'what_if_scenarios', label: 'What-If', icon: SlidersHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 px-2 flex items-center justify-around select-none">
      {quickItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex-1 flex flex-col items-center justify-center h-full py-1 min-h-[44px] transition ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition ${isActive ? 'bg-cyan-500/15' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Menu Drawer Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="flex-1 flex flex-col items-center justify-center h-full py-1 min-h-[44px] text-slate-400 hover:text-slate-200 relative transition"
      >
        <div className="p-1 rounded-lg relative">
          <Menu className="w-5 h-5" />
          {activeAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
        </div>
        <span className="text-[10px] font-mono tracking-tight mt-0.5">All Views</span>
      </button>
    </nav>
  );
};
