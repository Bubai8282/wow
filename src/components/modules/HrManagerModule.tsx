import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { StaffMember, RoleId, RoleDefinition } from '../../types/rbac';
import { Users, Plus, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export const HrManagerModule: React.FC = () => {
  const { staffMembers, addStaffMember, rolesMap, hasPermission } = useRBAC();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState<RoleId>('operations_manager');
  const [dept, setDept] = useState('Flight Operations');

  const canProvision = hasPermission('hr_staff', 'create');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newStaff: StaffMember = {
      id: `usr_${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      roleId,
      department: dept,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastLogin: new Date().toISOString().slice(0, 10),
      phone: '+1 (555) 019-8800'
    };

    addStaffMember(newStaff);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border border-rose-800/40 rounded-2xl p-6 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">HR & Staff Account Management</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Staff Management
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              HR Manager Scope: Provision staff accounts, assign administrative roles, maintain staff directory and internal corporate notices.
            </p>
          </div>
        </div>

        {canProvision && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Provision Staff Account
          </button>
        )}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {staffMembers.map((staff) => {
          const roleDef = rolesMap[staff.roleId];
          return (
            <div key={staff.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex items-start gap-3">
              <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-bold text-white text-sm truncate">{staff.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{staff.email}</div>
                <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${roleDef?.badgeColor}`}>
                  {roleDef?.title}
                </div>
                <div className="text-[10px] text-slate-500 pt-1">Dept: {staff.department}</div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Provision New Staff Account</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Assign Admin Role</label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value as RoleId)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {(Object.values(rolesMap) as RoleDefinition[]).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.accessLevel})
                    </option>
                  ))}
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
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold">
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
