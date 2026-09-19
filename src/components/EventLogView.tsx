import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Info,
  Radio,
  RotateCcw,
  Search,
  Shield,
  Zap,
} from 'lucide-react';
import { useAirspace } from '../context/AirspaceContext';
import { EventLogEntry } from '../types/airspace';

export const EventLogView: React.FC = () => {
  const { eventLogs, clearEventLogs } = useAirspace();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'telemetry', 'dfr', 'conflict', 'comms', 'weather', 'decision', 'system'];

  const filteredLogs = eventLogs.filter((log) => {
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSearch =
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(eventLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `airspace-event-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              Real-Time Airspace Event & Audit Ledger
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Immutable Event Trace for DFR Compliance, Conflict Alerts & Actuation (Prompt Section 26)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The event log records all incoming sensor telemetry anomalies, Digital Flight Rules longitudinal adjustments,
          DSS discovery queries, and decision support interventions in strict chronological sequence.
        </p>
      </div>

      {/* Control Bar: Filters, Search, Export */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter events..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <button
            onClick={exportLogsAsJson}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={clearEventLogs}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-lg text-xs transition"
            title="Clear Log History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Category</th>
                <th className="p-3">Source</th>
                <th className="p-3">Event Title</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500 font-sans">
                    No matching events found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const severityBadge =
                    log.severity === 'critical'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                      : log.severity === 'warning'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                      : log.severity === 'success'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-300 border-slate-800';

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 text-slate-400 font-mono">{log.timeDisplay || log.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${severityBadge}`}>
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-cyan-300 capitalize">{log.category}</td>
                      <td className="p-3 text-slate-400">{log.source}</td>
                      <td className="p-3 font-bold text-white">{log.title}</td>
                      <td className="p-3 text-slate-300">{log.details}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
