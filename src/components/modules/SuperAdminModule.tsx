import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { Lead, CallLog, RoleId, ModuleId, PermissionAction, RoleDefinition } from '../../types/rbac';
import { ALL_MODULES } from '../../data/rolesConfig';
import {
  ShieldAlert,
  Users,
  Lock,
  CheckCircle2,
  Phone,
  ClipboardList,
  Search,
  MessageCircle,
  PlusCircle,
  Sliders
} from 'lucide-react';

interface SuperAdminModuleProps {
  initialTab?: 'permissions' | 'leads' | 'messages' | 'calls';
}

export const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ initialTab = 'permissions' }) => {
  const { rolesMap, updateRolePermission, addAuditLog, addLead, leads, callLogs } = useRBAC();
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleId>('agent');
  const [activeTab, setActiveTab] = useState<'permissions' | 'leads' | 'messages' | 'calls'>(initialTab);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadMessageSearch, setLeadMessageSearch] = useState('');
  const [callSearch, setCallSearch] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadContact, setNewLeadContact] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadSource, setNewLeadSource] = useState<Lead['source']>('Website');
  const [newLeadStatus, setNewLeadStatus] = useState<Lead['status']>('New');
  const [newLeadAssignedTo, setNewLeadAssignedTo] = useState('Elena Rostova');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const resetNewLeadForm = () => {
    setNewLeadCompany('');
    setNewLeadContact('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadSource('Website');
    setNewLeadStatus('New');
    setNewLeadAssignedTo('Elena Rostova');
    setNewLeadNotes('');
  };

  const handleCreateLead = () => {
    if (!newLeadCompany || !newLeadContact || !newLeadEmail || !newLeadPhone) {
      return;
    }

    const newLead: Lead = {
      id: `LD-${Date.now().toString().slice(-5)}`,
      companyName: newLeadCompany,
      contactName: newLeadContact,
      email: newLeadEmail,
      phone: newLeadPhone,
      source: newLeadSource,
      status: newLeadStatus,
      assignedTo: newLeadAssignedTo,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Just created',
      notes: newLeadNotes || 'New prospect added via Super Admin dashboard.',
      messages: []
    };

    addLead(newLead);
    addAuditLog('Created New Lead', 'sales', `New lead ${newLead.id} created for ${newLead.companyName}`);
    resetNewLeadForm();
    setIsAddLeadOpen(false);
    setActiveTab('leads');
  };

  const targetRoleDef = rolesMap[selectedRoleForEdit];

  const handlePermissionToggle = (module: ModuleId, action: PermissionAction) => {
    const currentActions = targetRoleDef.permissions[module] || [];
    const exists = currentActions.includes(action);
    const updatedActions = exists
      ? currentActions.filter((a) => a !== action)
      : [...currentActions, action];

    updateRolePermission(selectedRoleForEdit, module, updatedActions);
  };


  const filteredLeads: Lead[] = leads.filter(
    (lead) =>
      lead.companyName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phone.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const filteredLeadMessages = leads
    .flatMap((lead) =>
      (lead.messages ?? []).map((message) => ({
        ...message,
        leadId: lead.id,
        leadName: lead.companyName,
        contactName: lead.contactName,
        assignedTo: lead.assignedTo
      }))
    )
    .filter((message) =>
      message.leadName.toLowerCase().includes(leadMessageSearch.toLowerCase()) ||
      message.contactName.toLowerCase().includes(leadMessageSearch.toLowerCase()) ||
      message.text.toLowerCase().includes(leadMessageSearch.toLowerCase()) ||
      message.sender.toLowerCase().includes(leadMessageSearch.toLowerCase())
    );

  const filteredCalls: CallLog[] = callLogs.filter(
    (call) =>
      call.leadName.toLowerCase().includes(callSearch.toLowerCase()) ||
      call.agentName.toLowerCase().includes(callSearch.toLowerCase()) ||
      call.summary.toLowerCase().includes(callSearch.toLowerCase())
  );

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
              Full System Control: Configure the four role dashboards, fine-grained RBAC permissions, and platform financial and operations settings.
            </p>
          </div>
        </div>

        {/* No top tabs here. Module navigation is handled by the sidebar only. */}
      </div>

      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 md:p-10">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Add New Lead</h2>
                <p className="text-slate-400 text-xs mt-1">Capture the lead details and assign ownership for follow-up tracking.</p>
              </div>
              <button
                onClick={() => setIsAddLeadOpen(false)}
                className="rounded-full p-2 bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Company Name</span>
                <input
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Acme Corporate Travel"
                />
              </label>
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Contact Name</span>
                <input
                  value={newLeadContact}
                  onChange={(e) => setNewLeadContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Sara Khan"
                />
              </label>
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Email</span>
                <input
                  type="email"
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="sara.khan@acme.com"
                />
              </label>
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Phone</span>
                <input
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+1 555 134 7890"
                />
              </label>
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Source</span>
                <select
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value as Lead['source'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>Website</option>
                  <option>Referral</option>
                  <option>Trade Show</option>
                  <option>Email Campaign</option>
                  <option>Partner</option>
                  <option>Inbound Call</option>
                </select>
              </label>
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Status</span>
                <select
                  value={newLeadStatus}
                  onChange={(e) => setNewLeadStatus(e.target.value as Lead['status'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Proposal Sent</option>
                  <option>Negotiation</option>
                  <option>Won</option>
                  <option>Lost</option>
                </select>
              </label>
              <label className="space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Assigned To</span>
                <input
                  value={newLeadAssignedTo}
                  onChange={(e) => setNewLeadAssignedTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Lead Owner"
                />
              </label>
              <label className="lg:col-span-2 space-y-1 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Notes</span>
                <textarea
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  className="w-full min-h-[120px] resize-y bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter initial lead notes or qualification details"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                onClick={() => {
                  resetNewLeadForm();
                  setIsAddLeadOpen(false);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLead}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
              >
                Save Lead
              </button>
            </div>
          </div>
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

      {/* TAB 3: LEAD MANAGEMENT */}
      {activeTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-400" />
                Lead Management & Opportunity Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                Monitor new business leads, qualification status, lead assignment, and follow-up scheduling for corporate accounts.
              </p>
            </div>
            <div className="relative text-slate-400 text-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search leads by company, contact, email or phone"
                className="pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                Pipeline Summary
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between"><span>New Leads</span><strong>{leads.filter((lead) => lead.status === 'New').length}</strong></div>
                <div className="flex justify-between"><span>Contacted</span><strong>{leads.filter((lead) => lead.status === 'Contacted').length}</strong></div>
                <div className="flex justify-between"><span>Qualified</span><strong>{leads.filter((lead) => lead.status === 'Qualified').length}</strong></div>
                <div className="flex justify-between"><span>Proposals Sent</span><strong>{leads.filter((lead) => lead.status === 'Proposal Sent').length}</strong></div>
                <div className="flex justify-between"><span>Won / Lost</span><strong>{leads.filter((lead) => lead.status === 'Won' || lead.status === 'Lost').length}</strong></div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-sky-400" />
                    Quick Lead Actions
                  </h3>
                  <p className="text-slate-400 text-[11px]">Create or assign new leads to executive sales owners in a single view.</p>
                </div>
                <button
                    onClick={() => setIsAddLeadOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-slate-700"
                  >
                    New Lead
                  </button>
              </div>
              <div className="text-slate-300 text-[11px] space-y-2">
                <div>Top account owners: Elena Rostova, Marcus Vance, Carlos Mendez</div>
                <div>Next follow-up: 2 scheduled calls this week</div>
                <div>Avg. lead response time: 4.1 hrs</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Owner</th>
                  <th className="py-3 px-3">Last Activity</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{lead.companyName}</td>
                    <td className="py-3 px-3 text-slate-300">{lead.contactName} · {lead.phone}</td>
                    <td className="py-3 px-3 text-slate-400">{lead.source}</td>
                    <td className="py-3 px-3 text-slate-300"><span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-200">{lead.status}</span></td>
                    <td className="py-3 px-3 text-slate-300">{lead.assignedTo}</td>
                    <td className="py-3 px-3 text-slate-400">{lead.lastActivity}</td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-[220px]">{lead.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CALL LOGS */}
      {activeTab === 'messages' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-red-400" />
                Lead Messages & Conversation Threads
              </h2>
              <p className="text-xs text-slate-400">
                Review lead conversations in a unified inbox, filter messages, and track response handoff for sales opportunities.
              </p>
            </div>
            <div className="relative text-slate-400 text-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={leadMessageSearch}
                onChange={(e) => setLeadMessageSearch(e.target.value)}
                placeholder="Search lead messages by company, contact, sender or content"
                className="pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                Message Inbox Summary
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between"><span>Total Messages</span><strong>{filteredLeadMessages.length}</strong></div>
                <div className="flex justify-between"><span>Open Lead Threads</span><strong>{leads.filter((lead) => lead.messages.length > 0).length}</strong></div>
                <div className="flex justify-between"><span>Staff Replies</span><strong>{filteredLeadMessages.filter((msg) => msg.isStaff).length}</strong></div>
                <div className="flex justify-between"><span>Customer Inquiries</span><strong>{filteredLeadMessages.filter((msg) => !msg.isStaff).length}</strong></div>
              </div>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <PlusCircle className="w-4 h-4 text-sky-400" />
                Quick Message Actions
              </div>
              <button className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-slate-700">
                Review Recent Replies
              </button>
              <p className="text-slate-400 text-[11px]">See top lead conversations and ensure staff responses remain timely.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Users className="w-4 h-4 text-indigo-400" />
                Top Lead Threads
              </div>
              <div className="text-slate-300 text-[11px] space-y-2">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                    <div className="font-semibold text-slate-100">{lead.companyName}</div>
                    <div>{lead.contactName} · {lead.status}</div>
                    <div className="text-[11px] text-slate-400">{lead.messages.length} messages · last activity {lead.lastActivity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Lead / Company</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Sender</th>
                  <th className="py-3 px-3">Message</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeadMessages.map((message, idx) => (
                  <tr key={`${message.leadId}-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{message.leadName}</td>
                    <td className="py-3 px-3 text-slate-300">{message.contactName}</td>
                    <td className="py-3 px-3 text-slate-300">{message.sender}</td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-[260px]">{message.text}</td>
                    <td className="py-3 px-3 text-slate-300">{message.isStaff ? 'Staff' : 'Lead'}</td>
                    <td className="py-3 px-3 text-slate-400">{message.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'calls' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                Sales Call Logs & Follow-Up Tracker
              </h2>
              <p className="text-xs text-slate-400">
                Review logged call outcomes, connected conversations, voicemail attempts, and scheduled callbacks.
              </p>
            </div>
            <div className="relative text-slate-400 text-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={callSearch}
                onChange={(e) => setCallSearch(e.target.value)}
                placeholder="Search call logs by lead, agent, or notes"
                className="pl-10 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Call Activity Summary
              </div>
              <div className="text-slate-300 space-y-2">
                <div className="flex justify-between"><span>Total Calls</span><strong>{callLogs.length}</strong></div>
                <div className="flex justify-between"><span>Connected</span><strong>{callLogs.filter((log) => log.outcome === 'Connected').length}</strong></div>
                <div className="flex justify-between"><span>Callbacks Scheduled</span><strong>{callLogs.filter((log) => log.outcome === 'Callback Scheduled').length}</strong></div>
                <div className="flex justify-between"><span>Voicemail</span><strong>{callLogs.filter((log) => log.outcome === 'Voicemail').length}</strong></div>
              </div>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ClipboardList className="w-4 h-4 text-sky-400" />
                Next Follow-Ups
              </div>
              <div className="text-slate-300 text-[11px] space-y-2">
                {callLogs.filter((log) => log.followUpDate).slice(0, 3).map((log) => (
                  <div key={log.id} className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
                    <div className="font-semibold text-slate-100">{log.leadName}</div>
                    <div>{log.followUpDate} · {log.agentName}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <PlusCircle className="w-4 h-4 text-sky-400" />
                Quick Call Actions
              </div>
              <button className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-slate-700">
                Log New Call
              </button>
              <p className="text-slate-400 text-[11px]">Use the sales call record system to capture outcomes and next step commitments.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Lead</th>
                  <th className="py-3 px-3">Agent</th>
                  <th className="py-3 px-3">Call Time</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Outcome</th>
                  <th className="py-3 px-3">Summary</th>
                  <th className="py-3 px-3">Follow-Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{call.leadName}</td>
                    <td className="py-3 px-3 text-slate-300">{call.agentName}</td>
                    <td className="py-3 px-3 text-slate-400">{call.callTime}</td>
                    <td className="py-3 px-3 text-slate-400">{call.durationMinutes} mins</td>
                    <td className="py-3 px-3 text-slate-300">{call.outcome}</td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-[220px]">{call.summary}</td>
                    <td className="py-3 px-3 text-slate-400">{call.followUpDate || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


    </div>
  );
};
