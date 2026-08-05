import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { RoleId, ModuleId, PermissionAction, RoleDefinition } from '../../types/rbac';
import { ALL_MODULES } from '../../data/rolesConfig';
import {
  ShieldAlert,
  ShieldCheck,
  Settings,
  Users,
  Percent,
  CreditCard,
  Lock,
  Database,
  CheckCircle2,
  Sliders,
  Save,
  Key
} from 'lucide-react';

export const SuperAdminModule: React.FC = () => {
  const { rolesMap, updateRolePermission, addAuditLog } = useRBAC();
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleId>('operations_manager');
  const [markupRate, setMarkupRate] = useState<number>(4.5);
  const [b2bDefaultCommission, setB2bDefaultCommission] = useState<number>(5.0);
  const [activeTab, setActiveTab] = useState<'permissions' | 'settings' | 'markup'>('permissions');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const targetRoleDef = rolesMap[selectedRoleForEdit];

  const handlePermissionToggle = (module: ModuleId, action: PermissionAction) => {
    const currentActions = targetRoleDef.permissions[module] || [];
    const exists = currentActions.includes(action);
    const updatedActions = exists
      ? currentActions.filter((a) => a !== action)
      : [...currentActions, action];

    updateRolePermission(selectedRoleForEdit, module, updatedActions);
  };

  const handleSaveSettings = () => {
    addAuditLog(
      'Updated Global System Markup & Commission Settings',
      'super_admin_panel',
      `Flight Markup set to ${markupRate}%, B2B Commission set to ${b2bDefaultCommission}%`
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-900/50 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Super Admin Control Center</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                Root System
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Full System Control: Configure all 15 Admin Roles, fine-grained RBAC matrix, markup rules, API credentials & platform settings.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'permissions' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RBAC Permission Matrix
          </button>
          <button
            onClick={() => setActiveTab('markup')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'markup' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Markup & Commissions
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Settings
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          System configurations updated and broadcasted across all platform services.
        </div>
      )}

      {/* TAB 1: RBAC PERMISSION MATRIX EDITOR */}
      {activeTab === 'permissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-400" />
                Fine-Grained Role Permission Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Select a role to inspect or modify allowed modules and actions (Read, Write, Create, Delete, Approve, Export).
              </p>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Select Role to Edit:</span>
              <select
                value={selectedRoleForEdit}
                onChange={(e) => setSelectedRoleForEdit(e.target.value as RoleId)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {(Object.values(rolesMap) as RoleDefinition[]).map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Role Summary Card */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">{targetRoleDef.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${targetRoleDef.badgeColor}`}>
                  {targetRoleDef.accessLevel}
                </span>
              </div>
              <p className="text-slate-400">{targetRoleDef.description}</p>
            </div>
            <div className="text-right text-slate-400 shrink-0">
              <div>Allowed Modules: <strong className="text-white">{targetRoleDef.allowedModules.length}</strong> / 16</div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Subsystem Module</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Read</th>
                  <th className="py-3 px-3 text-center">Write</th>
                  <th className="py-3 px-3 text-center">Create</th>
                  <th className="py-3 px-3 text-center">Delete</th>
                  <th className="py-3 px-3 text-center">Approve</th>
                  <th className="py-3 px-3 text-center">Export</th>
                  <th className="py-3 px-3 text-center">Configure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ALL_MODULES.map((module) => {
                  const currentPerms = targetRoleDef.permissions[module.id] || [];
                  const actionsList: PermissionAction[] = ['read', 'write', 'create', 'delete', 'approve', 'export', 'configure'];

                  return (
                    <tr key={module.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{module.title}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{module.category}</td>

                      {actionsList.map((act) => {
                        const isChecked = currentPerms.includes(act);
                        return (
                          <td key={act} className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handlePermissionToggle(module.id, act)}
                              disabled={selectedRoleForEdit === 'super_admin'}
                              className="rounded border-slate-700 bg-slate-950 text-red-500 focus:ring-red-500 w-4 h-4 cursor-pointer disabled:opacity-50"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MARKUP & COMMISSION SETTINGS */}
      {activeTab === 'markup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-red-400" />
              Global Flight Pricing, Markups & Commission Rules
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Set automated GDS ticket markups, B2B agent commission rates, and tax application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-400" />
                B2C Retail Flight Ticket Markup
              </h3>
              <p className="text-slate-400 text-[11px]">
                Percentage added on top of base GDS fares (Amadeus, Sabre, Travelport) for direct passenger bookings.
              </p>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Standard Passenger Flight Markup (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={markupRate}
                  onChange={(e) => setMarkupRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                B2B Travel Agent Default Commission
              </h3>
              <p className="text-slate-400 text-[11px]">
                Default commission paid to registered travel agency partners upon confirmed flight ticket issuance.
              </p>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Default B2B Commission Split (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={b2bDefaultCommission}
                  onChange={(e) => setB2bDefaultCommission(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Markup & Commission Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-xs">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-red-400" />
              Platform Global Configuration & Master Switches
            </h2>
            <p className="text-slate-400 mt-0.5">
              Control system maintenance mode, backup snapshot execution, and security settings.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200 text-sm">System Maintenance Mode</div>
                <div className="text-slate-400 text-[11px]">Temporarily disable B2C customer flight searches during system updates.</div>
              </div>
              <input type="checkbox" className="w-4 h-4 text-red-500 rounded bg-slate-900 border-slate-700" />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200 text-sm">Automated Real-Time Database Snapshot</div>
                <div className="text-slate-400 text-[11px]">Execute scheduled hourly backups of PNRs, financial ledgers, and audit trails.</div>
              </div>
              <button
                onClick={() => addAuditLog('Triggered On-Demand Backup Snapshot', 'super_admin_panel', 'Super Admin executed full DB snapshot')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 border border-slate-700"
              >
                Run Backup Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
