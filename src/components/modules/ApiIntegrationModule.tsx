import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw, Key, ShieldCheck, Activity } from 'lucide-react';

export const ApiIntegrationModule: React.FC = () => {
  const { apiConfigs, toggleApiStatus, hasPermission } = useRBAC();

  const canConfigure = hasPermission('api_config', 'configure');

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Flight API Integration & Provider Config</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                GDS API Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              API Integration Manager Scope: Manage Amadeus, Sabre & Travelport GDS APIs, monitor latency, error rates, and sandbox environments.
            </p>
          </div>
        </div>
      </div>

      {/* API Endpoints Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {apiConfigs.map((api) => (
          <div key={api.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="font-bold text-white text-sm">{api.name}</div>
                <div className="text-[10px] text-teal-400 font-mono">{api.provider} • {api.environment}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  api.status === 'Operational'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {api.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Avg Latency</div>
                <div className="font-mono font-bold text-sky-400">{api.latencyMs} ms</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">Error Rate</div>
                <div className="font-mono font-bold text-amber-400">{api.errorRatePercent}%</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">24h Calls</div>
                <div className="font-mono font-bold text-emerald-400">{api.totalCalls24h.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
              <div className="text-[10px] text-slate-500">Key: {api.apiKeyMasked}</div>
              <div className="text-slate-400 text-[10px] truncate">{api.endpointUrl}</div>
            </div>

            {canConfigure && (
              <button
                onClick={() => toggleApiStatus(api.id)}
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold border border-slate-700 transition-colors"
              >
                Toggle Maintenance Mode
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
