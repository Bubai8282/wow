import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { RoleId, RoleDefinition } from '../../types/rbac';
import {
  Plane,
  Shield,
  ChevronDown,
  Search,
  History,
  CheckCircle2,
  AlertCircle,
  Bell,
  Lock,
  User,
  Sparkles,
  Key,
  LogIn,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenAuditLogs: () => void;
  onOpenCredentials: () => void;
  onOpenLogin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuditLogs,
  onOpenCredentials,
  onOpenLogin,
  searchQuery,
  setSearchQuery
}) => {
  const { activeRoleId, setActiveRoleId, currentUser, rolesMap, auditLogs, logout } = useRBAC();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const activeRoleDef = rolesMap[activeRoleId];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="/Logo_main.com (1).png"
              alt="Logo"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PNR (e.g. PNR-EK8920), passenger, staff, or API..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Header Actions & Profile */}
          <div className="flex items-center gap-2.5">

            {/* Audit Logs Button */}
            <button
              onClick={onOpenAuditLogs}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
              title="View Platform System Audit Logs"
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden lg:inline">Audit Logs</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-900 rounded-full text-slate-300 border border-slate-700">
                {auditLogs.length}
              </span>
            </button>

            {/* Current Logged In Role & Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-sky-500/50 shrink-0"
                  />
                  <div className="hidden md:block pr-1">
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                      <span>{currentUser.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${activeRoleDef?.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                        {activeRoleDef?.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      ID: {currentUser.id} • {currentUser.department}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 text-slate-200 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-sky-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate text-white">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                        <div className="text-[10px] text-sky-400 font-semibold mt-0.5">{activeRoleDef.title}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <div className="flex justify-between">
                        <span>Staff User ID:</span>
                        <span className="text-sky-300 font-mono font-medium">{currentUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Department:</span>
                        <span className="text-slate-200 font-medium">{currentUser.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role Password:</span>
                        <span className="text-amber-400 font-mono font-medium">{currentUser.password || 'Admin@2026'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Login:</span>
                        <span className="text-slate-200 font-medium">{currentUser.lastLogin}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-center px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-rose-500/30"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Sign Out from Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Direct Sign Out Button */}
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 transition-all"
                title="Sign Out from Dashboard"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

