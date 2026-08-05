import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { B2BAgent } from '../../types/rbac';
import {
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  DollarSign,
  Search,
  CreditCard,
  UserCheck,
  Percent,
  X
} from 'lucide-react';

export const AgentManagerModule: React.FC = () => {
  const { agents, updateAgent, addAgent, addAuditLog, hasPermission } = useRBAC();
  const [selectedAgentForTopup, setSelectedAgentForTopup] = useState<B2BAgent | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(5000);
  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);

  // New agent form
  const [agencyName, setAgencyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const canApprove = hasPermission('agent_portal', 'approve');

  const handleApproveAgent = (agentId: string) => {
    updateAgent(agentId, { status: 'Approved' });
    addAuditLog('Approved B2B Travel Agency', 'agent_portal', `Agency ID ${agentId} approved for B2B GDS ticketing access`);
  };

  const handleExecuteTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForTopup) return;

    const newBalance = selectedAgentForTopup.walletBalance + topupAmount;
    updateAgent(selectedAgentForTopup.id, { walletBalance: newBalance });
    addAuditLog('B2B Wallet Top-Up Executed', 'agent_portal', `Topped up $${topupAmount} for agency ${selectedAgentForTopup.agencyName}`);
    setSelectedAgentForTopup(null);
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !email) return;

    const newAgentObj: B2BAgent = {
      id: `B2B-AGENT-${Math.floor(100 + Math.random() * 900)}`,
      agencyName,
      ownerName,
      email,
      phone: phone || '+1-555-0912',
      status: 'Approved',
      walletBalance: 10000.0,
      creditLimit: 25000.0,
      commissionRate: 5.0,
      totalBookings: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
      city: city || 'New York',
      country: country || 'USA'
    };

    addAgent(newAgentObj);
    setIsNewAgentModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">B2B Agent Portal & Wallet Ops</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                B2B Commercial
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Agent Manager Scope: Approve travel agencies, manage B2B wallet deposits, credit line limits, and agency commission splits.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewAgentModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Onboard B2B Travel Agency
        </button>
      </div>

      {/* Agents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            Registered Travel Agency Partners
          </h2>
          <span className="text-xs text-slate-400">{agents.length} Agencies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Agency Name & ID</th>
                <th className="py-3 px-3">Contact & Location</th>
                <th className="py-3 px-3">Wallet Balance</th>
                <th className="py-3 px-3">Credit Limit</th>
                <th className="py-3 px-3">Commission %</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{agent.agencyName}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{agent.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200">{agent.ownerName} ({agent.email})</div>
                    <div className="text-[10px] text-slate-400">{agent.city}, {agent.country}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    ${agent.walletBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    ${agent.creditLimit.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-bold text-sky-400">{agent.commissionRate}%</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        agent.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    {agent.status === 'Pending Approval' && canApprove ? (
                      <button
                        onClick={() => handleApproveAgent(agent.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                      >
                        Approve Agency
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedAgentForTopup(agent)}
                        className="px-2.5 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-bold border border-indigo-500/30"
                      >
                        Deposit Wallet Funds
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPUP MODAL */}
      {selectedAgentForTopup && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Top-Up B2B Agent Wallet</h3>
            <p className="text-slate-400">Agency: <strong className="text-white">{selectedAgentForTopup.agencyName}</strong></p>
            <form onSubmit={handleExecuteTopup} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Top-Up Amount ($)</label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-bold"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAgentForTopup(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold">
                  Confirm Credit Topup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW AGENT MODAL */}
      {isNewAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Onboard New B2B Agency</h3>
            <form onSubmit={handleCreateAgentSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Agency Name *</label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAgentModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold">
                  Onboard Agency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
