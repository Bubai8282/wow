import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { Server, Activity, ShieldCheck, Database, Lock, RefreshCw } from 'lucide-react';

export const SystemAdminModule: React.FC = () => {
  const { servers, addAuditLog, hasPermission } = useRBAC();

  const canManage = hasPermission('system_infrastructure', 'configure');

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">System Infrastructure & IT Security</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Server & Security
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              System Administrator Scope: Cloud Run container instances, database latency monitoring, SSL cert expiry, and disaster recovery.
            </p>
          </div>
        </div>
      </div>

      {/* Server Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {servers.map((srv, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="font-bold text-white text-sm">{srv.instanceName}</div>
                <div className="text-[10px] text-emerald-400 font-mono">{srv.region}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {srv.status}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>CPU Load ({srv.cpuUsagePercent}%)</span>
                  <span>Normal</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${srv.cpuUsagePercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Memory Usage ({srv.memoryUsagePercent}%)</span>
                  <span>Normal</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${srv.memoryUsagePercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <div>Active Connections: <strong className="text-white">{srv.activeConnections}</strong></div>
              <div>DB Query Latency: <strong className="text-emerald-400">{srv.dbLatencyMs} ms</strong></div>
              <div>SSL Certificate Expiry: <strong className="text-sky-400">{srv.sslExpiryDays} days remaining</strong></div>
              <div>Last Backup: <strong className="text-slate-300">{srv.lastBackup}</strong></div>
            </div>

            {canManage && (
              <button
                onClick={() => addAuditLog('Executed Disaster Recovery Simulation', 'system_infrastructure', `Ran failover test on ${srv.instanceName}`)}
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold border border-slate-700"
              >
                Simulate Disaster Recovery Failover
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
