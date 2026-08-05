import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { CMSContent } from '../../types/rbac';
import { FileText, Plus, Eye, CheckCircle2, Edit } from 'lucide-react';

export const ContentManagerModule: React.FC = () => {
  const { cmsItems, addCMSContent, hasPermission } = useRBAC();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Page' | 'FAQ' | 'Travel Guide' | 'Notice' | 'Policy'>('Travel Guide');

  const canCreate = hasPermission('content_cms', 'create');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newCms: CMSContent = {
      id: `CMS-${Math.floor(100 + Math.random() * 900)}`,
      title,
      type,
      status: 'Published',
      lastUpdated: new Date().toISOString().slice(0, 10),
      author: 'Content Team',
      views: 0,
      slug: title.toLowerCase().replace(/\s+/g, '-')
    };

    addCMSContent(newCms);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-fuchsia-950 via-slate-900 to-slate-900 border border-fuchsia-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Content Management System (CMS)</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                Website Content
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Content Manager Scope: Travel destination guides, passenger FAQs, Terms & Conditions, and travel advisory notices.
            </p>
          </div>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Publish New Content Page
          </button>
        )}
      </div>

      {/* Content List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Page Title</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cmsItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{item.title}</td>
                  <td className="py-3 px-3 text-fuchsia-400 font-bold">{item.type}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{item.views.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{item.lastUpdated}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Publish CMS Article</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="Travel Guide">Travel Guide</option>
                  <option value="FAQ">FAQ</option>
                  <option value="Policy">Policy</option>
                  <option value="Notice">Notice</option>
                  <option value="Page">Page</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-fuchsia-600 text-white font-bold">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
