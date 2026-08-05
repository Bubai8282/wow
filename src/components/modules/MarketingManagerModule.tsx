import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { MarketingCampaign } from '../../types/rbac';
import { Megaphone, Plus, Tag, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export const MarketingManagerModule: React.FC = () => {
  const { campaigns, addCampaign, addAuditLog, hasPermission } = useRBAC();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  const canCreate = hasPermission('marketing', 'create');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newCmp: MarketingCampaign = {
      id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
      title,
      type: 'Coupon',
      code: code || 'SUMMER2026',
      discount: discount || '10% OFF',
      status: 'Active',
      validUntil: '2026-12-31',
      usageCount: 0,
      targetAudience: 'All Passengers'
    };

    addCampaign(newCmp);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Marketing & Campaign Suite</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Promotions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Marketing Manager Scope: Promo coupon codes, homepage promotional flight banners, SEO metadata, and email blasts.
            </p>
          </div>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Launch New Promo Coupon
          </button>
        )}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-400 font-bold text-xs bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {c.code || c.type}
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded">
                {c.status}
              </span>
            </div>
            <div className="font-bold text-white text-sm">{c.title}</div>
            <div className="text-xs text-slate-300 font-medium">{c.discount}</div>
            <div className="text-[10px] text-slate-400 flex justify-between border-t border-slate-800 pt-2">
              <span>Valid Until: {c.validUntil}</span>
              <span>Used: {c.usageCount} times</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Create Flight Discount Campaign</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Coupon Code (e.g. FLY2026)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Discount Offer Details</label>
                <input
                  type="text"
                  placeholder="e.g. 15% Off International Business Class"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-bold">
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
