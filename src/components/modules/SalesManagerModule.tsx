import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { TrendingUp, DollarSign, Award, Target, Users, BarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesManagerModule: React.FC = () => {
  const { bookings } = useRBAC();

  const chartData = [
    { day: 'Mon', revenue: 14200 },
    { day: 'Tue', revenue: 18900 },
    { day: 'Wed', revenue: 22400 },
    { day: 'Thu', revenue: 19800 },
    { day: 'Fri', revenue: 28500 },
    { day: 'Sat', revenue: 34200 },
    { day: 'Sun', revenue: 31000 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-slate-900 border border-violet-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Sales Dashboard & Yield Revenue</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Commercial Sales
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sales Manager Scope: Sales velocity reports, yield revenue analysis, corporate travel accounts, and route acquisition targets.
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart className="w-4 h-4 text-violet-400" />
            Weekly Gross Flight Revenue Performance ($)
          </h2>
          <span className="text-xs text-emerald-400 font-bold">+18.4% vs Previous Week</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Corporate Accounts & Promos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-violet-400" />
            Corporate Travel Accounts
          </h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <div>
                <div className="font-bold text-slate-200">TechCorp Global Inc</div>
                <div className="text-slate-400 text-[10px]">Contracted Discount: 12% on Business Class</div>
              </div>
              <span className="text-emerald-400 font-bold">$142,000 YTD</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <div>
                <div className="font-bold text-slate-200">Apex Consulting Partners</div>
                <div className="text-slate-400 text-[10px]">Contracted Discount: 8% on All Cabins</div>
              </div>
              <span className="text-emerald-400 font-bold">$89,500 YTD</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            Sales Target Tracking
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Monthly Revenue Goal ($500,000)</span>
                <span className="font-bold text-violet-400">84% Met ($420,000)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-full w-[84%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
