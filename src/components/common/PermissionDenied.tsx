import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { ModuleId, RoleId, RoleDefinition } from '../../types/rbac';
import { ALL_MODULES } from '../../data/rolesConfig';
import { ShieldAlert, Lock, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

interface PermissionDeniedProps {
  moduleId: ModuleId;
}

export const PermissionDenied: React.FC<PermissionDeniedProps> = ({ moduleId }) => {
  const { activeRoleId, setActiveRoleId, rolesMap } = useRBAC();

  const currentRole = rolesMap[activeRoleId];
  const targetModule = ALL_MODULES.find((m) => m.id === moduleId);

  // Find authorized roles that can access this module
  const authorizedRoles = (Object.values(rolesMap) as RoleDefinition[]).filter((role) =>
    role.allowedModules.includes(moduleId)
  );

  return (
    <div className="flex-1 p-6 md:p-10 flex items-center justify-center bg-slate-950/40 min-h-[500px]">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          Access Restricted by RBAC Policy
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {targetModule ? targetModule.title : 'Restricted Module'}
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
          Your current active identity <strong className="text-sky-400">{currentRole.title}</strong> does not have permission to access the <strong className="text-slate-100">{targetModule?.title}</strong> module under system authorization policies.
        </p>

        {/* Current Role Scope Box */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-left mb-6 text-xs text-slate-300">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-2">
            <span>Current Role Scope: {currentRole.title}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${currentRole.badgeColor}`}>
              {currentRole.accessLevel}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mb-3">{currentRole.description}</p>
          
          <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
            Allowed Subsystems ({currentRole.allowedModules.length}):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentRole.allowedModules.map((modId) => {
              const mod = ALL_MODULES.find((m) => m.id === modId);
              return (
                <span
                  key={modId}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium"
                >
                  {mod?.title || modId}
                </span>
              );
            })}
          </div>
        </div>

        {/* Authorized Roles List */}
        <div className="text-left mb-6">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Authorized Roles for this Subsystem</span>
            <span className="text-[10px] text-slate-400">{authorizedRoles.length} Roles Authorized</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {authorizedRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRoleId(role.id as RoleId)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate group-hover:text-sky-300">{role.title}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-sky-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Switch to Super Admin Quick Button */}
        <button
          onClick={() => setActiveRoleId('super_admin')}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          Switch to Super Admin (Full Control)
        </button>

      </div>
    </div>
  );
};
