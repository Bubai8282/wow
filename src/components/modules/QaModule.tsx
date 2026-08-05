import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { TestTube, Play, CheckCircle2, Bug, Clock } from 'lucide-react';

export const QaModule: React.FC = () => {
  const { qaTests, runQaTest, hasPermission } = useRBAC();

  const canTest = hasPermission('qa_testing', 'write');

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <TestTube className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">QA Testing & Automated Test Bench</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Testing Env
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Quality Assurance Scope: Validate booking creation, payment gateway webhooks, PDF e-ticket generation, and regression logs.
            </p>
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Test Scenario</th>
                <th className="py-3 px-3">Subsystem</th>
                <th className="py-3 px-3">Execution Time</th>
                <th className="py-3 px-3">Last Run Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {qaTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{test.title}</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{test.moduleTested}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{test.executionTimeMs} ms</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{test.lastRunTime}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {test.lastRunStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {canTest && (
                      <button
                        onClick={() => runQaTest(test.id)}
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 ml-auto text-[11px]"
                      >
                        <Play className="w-3 h-3" />
                        Run Test
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
