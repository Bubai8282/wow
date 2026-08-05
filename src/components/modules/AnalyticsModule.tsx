import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { BarChart3, PieChart, TrendingUp, Compass, Download } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const { bookings } = useRBAC();

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-slate-900 border border-orange-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Business Intelligence & Analytics Hub</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Reports & BI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Analytics Manager Scope: Route profitability heatmaps, airline load factor analysis, booking velocity, and customer insights.
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm">Top Air Corridors</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span>JFK → DXB (Dubai)</span>
              <span className="text-orange-400 font-bold">$184,000 Volume</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span>FRA → SIN (Singapore)</span>
              <span className="text-orange-400 font-bold">$129,500 Volume</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm">Cabin Revenue Share</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span>Business & First Class</span>
              <span className="text-emerald-400 font-bold">64.2% Revenue</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span>Economy & Premium Economy</span>
              <span className="text-sky-400 font-bold">35.8% Revenue</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm">GDS Provider Distribution</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span>Amadeus GDS</span>
              <span className="text-indigo-400 font-bold">52% Bookings</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span>Sabre GDS</span>
              <span className="text-indigo-400 font-bold">34% Bookings</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
