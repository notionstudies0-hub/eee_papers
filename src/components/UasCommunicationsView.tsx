import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle,
  Clock,
  CloudRain,
  Layers,
  MessageSquareShare,
  Radio,
  Send,
  Share2,
  Shield,
  Split,
  Wifi,
  Workflow,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';
import { CommMessage } from '../types/airspace';

export const UasCommunicationsView: React.FC = () => {
  const { commMessages, sendCustomU2UMessage, aircraft } = useAirspace();
  const [selectedUseCase, setSelectedUseCase] = useState<CommMessage['useCase']>('airborne_separation');
  const [customText, setCustomText] = useState('');

  const rtcaCases = [
    {
      id: 'collision_avoidance',
      title: 'a) Collision Avoidance',
      desc: 'Approaching convergence zones in structured corridors or unstructured rural airspace.',
      icon: AlertTriangle,
      color: 'text-rose-400',
    },
    {
      id: 'merging_spacing',
      title: 'b) Merging / Spacing / Sequencing',
      desc: 'Entering 3D roundabouts and negotiating right-of-way timing slots in air corridors.',
      icon: Split,
      color: 'text-purple-400',
    },
    {
      id: 'airborne_separation',
      title: 'c) Airborne Separation',
      desc: 'Automated following deceleration (lead decelerates → trailing vessel slows down).',
      icon: Shield,
      color: 'text-emerald-400',
    },
    {
      id: 'airborne_reroute',
      title: 'd) Airborne Rerouting (BRLOS)',
      desc: 'Beyond Radio Line-of-Sight routing alerts and vertiport divert negotiation via multi-hop.',
      icon: Workflow,
      color: 'text-cyan-400',
    },
    {
      id: 'cooperative_sensing',
      title: 'e) Cooperative Sensing of Winds',
      desc: 'In-flight drones sharing thermal shear & microburst measurements to the entire network.',
      icon: CloudRain,
      color: 'text-amber-400',
    },
  ];

  const handleSendPreset = (useCase: CommMessage['useCase'], msg: string) => {
    sendCustomU2UMessage('UAS-01', 'UAS-02', msg, useCase);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <MessageSquareShare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              UAS-to-UAS Direct Communications & Multi-Hop Relay
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              RTCA SC-228 Standards & Cooperative Sidelink Scenarios (Namuduri 2023 Section VI & Fig. 7)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Airborne separation, collision avoidance, and sudden weather rerouting in high-density urban corridors require
          low-latency <strong>UAS-to-UAS (U2U) direct sidelink communications</strong>, supplemented by
          <strong> multi-hop mesh relays</strong> when operating Beyond Radio Line-of-Sight (BRLOS).
        </p>
      </div>

      {/* Multi-Hop Relay Architecture Graphic (Prompt Section 12) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            MULTI-HOP INFORMATION RELAY ARCHITECTURE
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
            ASTM / RTCA Sidelink Mesh
          </span>
        </div>

        {/* Multi-Hop Relay Node chain */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-slate-950 border border-cyan-800/60 rounded-xl space-y-2">
            <div className="flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="font-mono font-bold text-xs text-white">UAS-01 (Sensor Node)</div>
            <div className="text-[11px] text-slate-400">Detects Wind Shear (38kts)</div>
            <div className="text-[10px] font-mono text-cyan-300 bg-slate-900 p-1 rounded">
              Direct Sidelink Tx
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-purple-800/60 rounded-xl space-y-2">
            <div className="flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <div className="font-mono font-bold text-xs text-white">UAS-02 (Relay Node 1)</div>
            <div className="text-[11px] text-slate-400">Hop 1: Packet Forwarding</div>
            <div className="text-[10px] font-mono text-purple-300 bg-slate-900 p-1 rounded">
              -68 dBm Sidelink
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-blue-800/60 rounded-xl space-y-2">
            <div className="flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <div className="font-mono font-bold text-xs text-white">UAS-03 (Relay Node 2)</div>
            <div className="text-[11px] text-slate-400">Hop 2: BRLOS Bridge</div>
            <div className="text-[10px] font-mono text-blue-300 bg-slate-900 p-1 rounded">
              -74 dBm Sidelink
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl space-y-2">
            <div className="flex items-center justify-center">
              <Radio className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="font-mono font-bold text-xs text-emerald-200">Ground Control / PSU</div>
            <div className="text-[11px] text-slate-300">Final Destination Gate</div>
            <div className="text-[10px] font-mono text-emerald-300 bg-slate-900 p-1 rounded">
              FIMS Sync: 18ms Latency
            </div>
          </div>
        </div>
      </div>

      {/* RTCA 5 Core Use Cases Grid & Packet Injector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 5 RTCA Use Cases */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
            RTCA Five Operational Use Cases (September 2022)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rtcaCases.map((cs) => {
              const Icon = cs.icon;
              return (
                <div
                  key={cs.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 hover:border-cyan-500/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${cs.color}`} />
                      <span className="font-bold font-display text-xs text-white">{cs.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cs.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleSendPreset(
                        cs.id as any,
                        `Simulated test broadcast for RTCA ${cs.title}: verified in sector Charlie.`
                      )
                    }
                    className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono font-semibold transition"
                  >
                    Transmit Test Message
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Message Bus Feed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Live Sidelink Packets
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{commMessages.length} Recorded</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {commMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-cyan-300 font-bold">
                      {msg.senderId} → {msg.receiverId}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 font-normal leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-850">
                    <span>Use Case: {msg.useCase.replace('_', ' ')}</span>
                    <span className="text-emerald-400">{msg.signalStrengthDbm} dBm • {msg.hopCount} Hop</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Message Sender */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Inject Custom U2U Message:</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Speed throttle ACK"
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
              <button
                onClick={() => {
                  if (customText.trim()) {
                    sendCustomU2UMessage('UAS-01', 'UAS-02', customText, 'airborne_separation');
                    setCustomText('');
                  }
                }}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
