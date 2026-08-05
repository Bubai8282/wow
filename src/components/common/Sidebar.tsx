import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { ModuleId } from '../../types/rbac';
import { ALL_MODULES } from '../../data/rolesConfig';
import {
  ShieldAlert,
  PlaneTakeoff,
  Ticket,
  Headphones,
  Receipt,
  Building2,
  TrendingUp,
  Megaphone,
  FileText,
  Cpu,
  TestTube,
  Users,
  Server,
  BarChart3,
  Handshake,
  History,
  ClipboardList,
  MessageCircle,
  Phone,
  Search,
  Lock,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (mod: ModuleId) => void;
  showAllModules: boolean;
  setShowAllModules: (show: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  ShieldAlert,
  PlaneTakeoff,
  Ticket,
  Headphones,
  Receipt,
  Building2,
  TrendingUp,
  Megaphone,
  FileText,
  Cpu,
  TestTube,
  Users,
  Server,
  BarChart3,
  Handshake,
  History,
  ClipboardList,
  MessageCircle,
  Phone
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  showAllModules,
  setShowAllModules,
  isOpen,
  onClose
}) => {
  const { isModuleAllowed, activeRoleId, rolesMap, tickets, agents, apiConfigs, leads, callLogs } = useRBAC();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [moduleSearch, setModuleSearch] = useState<string>('');

  const roleDef = rolesMap[activeRoleId];

  // Calculate badge alerts
  const pendingTicketsCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const pendingAgentsCount = agents.filter((a) => a.status === 'Pending Approval').length;
  const apiDegradedCount = apiConfigs.filter((a) => a.status !== 'Operational').length;
  const newLeadCount = leads.filter((lead) => lead.status === 'New').length;
  const totalMessagesCount = leads.flatMap((lead) => lead.messages ?? []).length;
  const activeCallCount = callLogs.length;

  const categories = Array.from(new Set(ALL_MODULES.map((m) => m.category)));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] text-slate-300 select-none transition-transform duration-300 ease-in-out relative md:relative md:translate-x-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Expand/Collapse Toggle Float Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 border border-sky-400/30 transition-all hover:scale-110"
        title={isCollapsed ? 'Expand Sidebar (Slide Out)' : 'Collapse Sidebar (Slide In)'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Active Role Card Overview */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between min-h-[60px]">
        {!isCollapsed ? (
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Scope</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${roleDef.badgeColor}`}>
                {roleDef.accessLevel}
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate">{roleDef.title}</div>
          </div>
        ) : (
          <div className="mx-auto" title={`${roleDef.title} (${roleDef.accessLevel})`}>
            <div className={`p-1.5 rounded-lg border ${roleDef.badgeColor}`}>
              <Shield className="w-4 h-4 text-sky-400" />
            </div>
          </div>
        )}

        {/* Slide Toggle Button */}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-3 border-b border-slate-800 bg-slate-950/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-slate-400 uppercase tracking-wider mb-1">New Leads</div>
              <div className="text-white text-lg font-semibold">{newLeadCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-slate-400 uppercase tracking-wider mb-1">Messages</div>
              <div className="text-white text-lg font-semibold">{totalMessagesCount}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-slate-400 uppercase tracking-wider mb-1">Call Logs</div>
              <div className="text-white text-lg font-semibold">{activeCallCount}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      {!isCollapsed && (
        <div className="px-3 pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Quick Module Search</div>
            <button
              onClick={() => setModuleSearch('')}
              className="text-[10px] text-slate-400 hover:text-white transition-colors"
              title="Clear module search"
            >
              Clear
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-2 pl-10 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              placeholder="Search modules"
            />
          </div>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {categories.map((category) => {
          const categoryModules = ALL_MODULES.filter(
            (m) =>
              m.category === category &&
              (showAllModules || isModuleAllowed(m.id)) &&
              (moduleSearch.trim() === '' ||
                m.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                m.category.toLowerCase().includes(moduleSearch.toLowerCase()))
          );
          
          if (categoryModules.length === 0) return null;

          return (
            <div key={category} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                  {category}
                </div>
              )}

              {categoryModules.map((module) => {
                const allowed = isModuleAllowed(module.id);
                if (!allowed && !showAllModules) return null;

                const IconComponent = ICON_MAP[module.iconName] || ShieldAlert;
                const isActive = activeModule === module.id;

                let badgeCount = 0;
                let badgeColor = '';
                if (module.id === 'customer_support' && pendingTicketsCount > 0) {
                  badgeCount = pendingTicketsCount;
                  badgeColor = 'bg-amber-500 text-slate-950';
                } else if (module.id === 'agent_portal' && pendingAgentsCount > 0) {
                  badgeCount = pendingAgentsCount;
                  badgeColor = 'bg-indigo-500 text-white';
                } else if (module.id === 'api_config' && apiDegradedCount > 0) {
                  badgeCount = apiDegradedCount;
                  badgeColor = 'bg-rose-500 text-white';
                } else if (module.id === 'lead_management' && newLeadCount > 0) {
                  badgeCount = newLeadCount;
                  badgeColor = 'bg-emerald-500 text-slate-950';
                } else if (module.id === 'lead_messages' && totalMessagesCount > 0) {
                  badgeCount = totalMessagesCount;
                  badgeColor = 'bg-sky-500 text-slate-950';
                } else if (module.id === 'call_logs' && activeCallCount > 0) {
                  badgeCount = activeCallCount;
                  badgeColor = 'bg-fuchsia-500 text-white';
                }

                return (
                  <div key={module.id} className="relative group">
                    <button
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-2.5 py-2'
                      } rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/30'
                          : allowed
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-800/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : allowed ? 'text-sky-400' : 'text-slate-400'}`} />
                          
                          {/* Collapsed Badge Dot Indicator */}
                          {isCollapsed && badgeCount > 0 && (
                            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${badgeColor} ring-2 ring-slate-900 animate-pulse`} />
                          )}
                        </div>

                        {!isCollapsed && <span className="truncate">{module.title}</span>}
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center gap-1">
                          {/* Dynamic Badge Counters */}
                          {badgeCount > 0 && (
                            <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                              module.id === 'customer_support' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              module.id === 'agent_portal' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                              'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {badgeCount}
                            </span>
                          )}

                          {!allowed && (
                            <Lock className="w-3 h-3 text-slate-400" title="Restricted by RBAC Policy" />
                          )}
                          {allowed && isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Tooltip on Hover when Collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                        <span>{module.title}</span>
                        {!allowed && <Lock className="w-3 h-3 text-rose-400" />}
                        {badgeCount > 0 && (
                          <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold ${badgeColor}`}>
                            {badgeCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* RBAC Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-400 font-medium">Role Features Active</div>
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              className="px-2 py-1 text-[10px] font-semibold rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              title={showAllModules ? 'Show allowed modules only' : 'Show all modules'}
            >
              {showAllModules ? 'All Modules' : 'Scoped View'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex items-center justify-center p-1.5 text-sky-400 hover:text-white transition-colors"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              className="p-1 rounded-xl border border-slate-700 text-[10px] font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              title={showAllModules ? 'Show allowed modules only' : 'Show all modules'}
            >
              {showAllModules ? 'All' : 'Role'}
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};

