import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { Handshake, Link, DollarSign, ExternalLink } from 'lucide-react';

export const AffiliateModule: React.FC = () => {
  const { affiliates } = useRBAC();

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-lime-950 via-slate-900 to-slate-900 border border-lime-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center shrink-0">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Affiliate & Partner Network Desk</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 border border-lime-500/30">
                Partner Relations
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Affiliate Manager Scope: Manage travel metasearch links, blog referral codes, corporate partner agreements, and commission payouts.
            </p>
          </div>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Partner Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Referral Code</th>
                <th className="py-3 px-3">Clicks / Conversions</th>
                <th className="py-3 px-3">Earned Commission</th>
                <th className="py-3 px-3">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {affiliates.map((aff) => (
                <tr key={aff.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{aff.partnerName}</td>
                  <td className="py-3 px-3 text-lime-400 font-bold">{aff.partnerType}</td>
                  <td className="py-3 px-3 font-mono text-slate-200">{aff.referralCode}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {aff.clicksCount.toLocaleString()} / <strong className="text-white">{aff.conversionCount}</strong>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">${aff.totalEarned.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {aff.payoutStatus}
                    </span>
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
