import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { Lead, CallLog } from '../../types/rbac';
import {
  ShieldAlert,
  Users,
  Search,
  MessageCircle,
  PlusCircle,
  Bell,
  Eye,
  Play,
  UserPlus,
  Trash,
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  BadgeCheck,
  CalendarDays,
  Briefcase,
  Wallet,
  UserRound,
  LayoutGrid,
  Building2,
  Receipt,
  ClipboardList,
  Phone,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface SuperAdminModuleProps {
  initialView?: 'dashboard' | 'agents' | 'staff' | 'finance' | 'clients' | 'leads' | 'social_inbox' | 'marketing' | 'calendar' | 'all_agents_performance';
}

export const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({ initialView = 'dashboard' }) => {
  const { addAuditLog, addLead, leads, callLogs, agents, tickets, transactions, updateLead, removeLead } = useRBAC();
  const [activeView, setActiveView] = useState(initialView);
  const [isDark, setIsDark] = useState(true);
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
    setActiveView(initialView);
  }, [initialView]);

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
    if (!newLeadCompany || !newLeadContact || !newLeadEmail || !newLeadPhone) return;

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
    addAuditLog('Created New Lead', 'leads', `New lead ${newLead.id} created for ${newLead.companyName}`);
    resetNewLeadForm();
    setIsAddLeadOpen(false);
    setActiveView('leads');
  };

  const filteredLeads: Lead[] = leads.filter((lead) =>
    [lead.companyName, lead.contactName, lead.email, lead.phone].some((value) =>
      value.toLowerCase().includes(leadSearch.toLowerCase())
    )
  );

  const filteredLeadMessages = leads.flatMap((lead) =>
    (lead.messages ?? []).map((message) => ({
      ...message,
      leadId: lead.id,
      leadName: lead.companyName,
      contactName: lead.contactName,
      assignedTo: lead.assignedTo
    }))
  ).filter((message) =>
    [message.leadName, message.contactName, message.text, message.sender].some((value) =>
      value.toLowerCase().includes(leadMessageSearch.toLowerCase())
    )
  );

  const filteredCalls: CallLog[] = callLogs.filter((call) =>
    [call.leadName, call.agentName, call.summary].some((value) => value.toLowerCase().includes(callSearch.toLowerCase()))
  );

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const openMessages = (lead: Lead) => {
    setSelectedLead(lead);
    setIsMessagesOpen(true);
  };

  const openView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewOpen(true);
  };

  const handleAssign = (lead: Lead) => {
    const assignee = window.prompt('Assign lead to (enter staff name):', lead.assignedTo || '');
    if (assignee) {
      updateLead(lead.id, { assignedTo: assignee });
      addAuditLog('Assigned Lead', 'leads', `Lead ${lead.id} assigned to ${assignee}`);
    }
  };

  const handleDelete = (lead: Lead) => {
    if (window.confirm(`Delete lead ${lead.id}? This action cannot be undone.`)) {
      removeLead(lead.id);
    }
  };

  const kpiCards = [
    { title: 'Total Leads', value: leads.length, change: '+12%', trend: 'up', icon: ClipboardList },
    { title: "Today's Leads", value: leads.filter((lead) => lead.createdAt === new Date().toISOString().split('T')[0]).length, change: '+8%', trend: 'up', icon: Sparkles },
    { title: 'Upcoming Meetings', value: 14, change: '+3%', trend: 'up', icon: CalendarDays },
    { title: 'Pending Payments', value: transactions.filter((tx) => tx.status === 'Pending').length, change: '-2%', trend: 'down', icon: Wallet },
    { title: 'Total Revenue', value: `$${transactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}`, change: '+18%', trend: 'up', icon: Receipt },
    { title: 'Active Cases', value: tickets.filter((t) => t.status !== 'Closed').length, change: '+5%', trend: 'up', icon: Briefcase },
    { title: 'Completed Cases', value: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length, change: '+10%', trend: 'up', icon: BadgeCheck },
    { title: 'Lost Leads', value: leads.filter((lead) => lead.status === 'Lost').length, change: '-4%', trend: 'down', icon: ArrowDownRight },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              Super Admin Dashboard
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white">Management overview with live CRM intelligence</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Monitor agents, staff, finance, clients, leads, social inbox, marketing, calendar, and agent performance from one elegant control center.</p>
          </div>
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <PlusCircle className="mr-2 inline h-4 w-4" /> Add New Lead
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.trend === 'up';
          return (
            <div key={card.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">{card.title}</div>
                <div className={`rounded-xl p-2 ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold text-white">{card.value}</div>
              <div className={`mt-2 flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {card.change} vs last month
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue growth trend</h3>
              <p className="text-sm text-slate-400">Actual vs target revenue performance</p>
            </div>
            <div className="rounded-full bg-sky-500/10 px-3 py-1 text-sm font-semibold text-sky-400">Jan – Dec</div>
          </div>
          <div className="mt-6 grid gap-3">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
              const actual = 180 + index * 22;
              const target = 175 + index * 18;
              return (
                <div key={month}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-400">
                    <span>{month}</span>
                    <span>Actual {actual}k / Target {target}k</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${Math.min(100, (actual / target) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold text-white">Smart CRM snapshot</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">Live alerts: {leads.filter((lead) => lead.status === 'New').length} new leads awaiting action</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">Social inbox: {leads.flatMap((lead) => lead.messages ?? []).length} conversations</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">Performance status: {agents.filter((agent) => agent.status === 'Approved').length} active agents</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModuleView = () => {
    switch (activeView) {
      case 'agents':
        return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Agent management, assignment, and performance view is ready for your CRM workflow.</div>;
      case 'staff':
        return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Staff directory, employee records, and role-based access can be managed here.</div>;
      case 'finance':
        return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Revenue, payments, and financial reporting views are available from this panel.</div>;
      case 'clients':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Clients</h3>
                <p className="text-sm text-slate-400">B2B agents and corporate clients overview</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input placeholder="Search clients" className="w-56 rounded-2xl border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-200" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Client ID</th>
                    <th className="py-3 px-4">Agency</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {agents.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-200">{a.id}</td>
                      <td className="py-3 px-4 text-slate-100 font-semibold">{a.agencyName}</td>
                      <td className="py-3 px-4 text-slate-300">{a.ownerName}</td>
                      <td className="py-3 px-4 text-slate-300">{a.email}</td>
                      <td className="py-3 px-4 text-slate-300">{a.phone}</td>
                      <td className="py-3 px-4 text-slate-300">{a.status}</td>
                      <td className="py-3 px-4 text-slate-300">{a.city}</td>
                      <td className="py-3 px-4 text-slate-300">{a.joinedDate}</td>
                      <td className="py-3 px-4 text-slate-300">● ● ●</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'leads':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Lead Center</h3>
                <p className="text-sm text-slate-400">Manage inbound inquiries, lead qualification data, and routing.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search leads..." className="w-64 rounded-2xl border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-200" />
                </div>
                <button onClick={() => setIsAddLeadOpen(true)} className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900">+ Add New Lead</button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Lead ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Agent</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-200 font-semibold">{lead.id}</td>
                      <td className="py-3 px-4 text-slate-100">{lead.contactName}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.phone}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.email}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.source}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.status}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.assignedTo}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.createdAt}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex items-center gap-3">
                          <button title="View" onClick={() => openView(lead)} className="p-1 rounded-full hover:bg-slate-800">
                            <Eye className="w-4 h-4 text-slate-200" />
                          </button>
                          <button title="Open Chat" onClick={() => openMessages(lead)} className="p-1 rounded-full hover:bg-slate-800">
                            <Play className="w-4 h-4 text-sky-400" />
                          </button>
                          <button title="Assign" onClick={() => handleAssign(lead)} className="p-1 rounded-full hover:bg-slate-800">
                            <UserPlus className="w-4 h-4 text-amber-400" />
                          </button>
                          <button title="Delete" onClick={() => handleDelete(lead)} className="p-1 rounded-full hover:bg-slate-800">
                            <Trash className="w-4 h-4 text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'social_inbox':
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Social inbox</h3>
                <p className="text-sm text-slate-400">Centralized conversations across WhatsApp, Facebook, Instagram, and Telegram.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input value={leadMessageSearch} onChange={(e) => setLeadMessageSearch(e.target.value)} placeholder="Search messages" className="w-56 rounded-2xl border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-200" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {['WhatsApp', 'Facebook', 'Instagram', 'Telegram'].map((channel) => (
                <div key={channel} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-sm font-semibold text-white">{channel}</div>
                  <div className="mt-2 text-sm text-slate-400">{filteredLeadMessages.filter((msg) => msg.leadName.includes(channel)).length} active conversations</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'marketing':
        return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Marketing dashboard, campaign management, and promotion planning view.</div>;
      case 'calendar':
        return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Meetings, follow-ups, events, and appointments calendar view.</div>;
      case 'all_agents_performance':
        return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">Performance matrix and productivity comparison for every agent.</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className={`rounded-3xl border p-4 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl p-2.5 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600'}`}>
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">{isDark ? 'Super Admin Dashboard' : 'Super Admin Dashboard'}</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Admin Mode • CRM • Operations • Finance</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <Search className="h-4 w-4" /> Global CRM Search
              </label>
              <button onClick={() => setIsDark(!isDark)} className={`rounded-2xl border p-2.5 ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className={`rounded-2xl border p-2.5 ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <Bell className="h-4 w-4" />
              </button>
              <button className={`rounded-2xl border p-2.5 ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <MessageCircle className="h-4 w-4" />
              </button>
              <button className={`rounded-2xl border p-2.5 ${isDark ? 'border-slate-700 bg-slate-950/70 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                <UserRound className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {renderModuleView()}
        </div>
      </div>

      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 md:p-10">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Add New Lead</h2>
                <p className="text-slate-400 text-xs mt-1">Capture the lead details and assign ownership for follow-up tracking.</p>
              </div>
              <button onClick={() => setIsAddLeadOpen(false)} className="rounded-full p-2 bg-slate-800 hover:bg-slate-700 text-slate-300">✕</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Company Name</span><input value={newLeadCompany} onChange={(e) => setNewLeadCompany(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Acme Corporate Travel" /></label>
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Contact Name</span><input value={newLeadContact} onChange={(e) => setNewLeadContact(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Sara Khan" /></label>
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Email</span><input type="email" value={newLeadEmail} onChange={(e) => setNewLeadEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="sara.khan@acme.com" /></label>
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Phone</span><input value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="+1 555 134 7890" /></label>
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Source</span><select value={newLeadSource} onChange={(e) => setNewLeadSource(e.target.value as Lead['source'])} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"><option>Website</option><option>Referral</option><option>Trade Show</option><option>Email Campaign</option><option>Partner</option><option>Inbound Call</option></select></label>
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Status</span><select value={newLeadStatus} onChange={(e) => setNewLeadStatus(e.target.value as Lead['status'])} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"><option>New</option><option>Contacted</option><option>Qualified</option><option>Proposal Sent</option><option>Negotiation</option><option>Won</option><option>Lost</option></select></label>
              <label className="space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Assigned To</span><input value={newLeadAssignedTo} onChange={(e) => setNewLeadAssignedTo(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Lead Owner" /></label>
              <label className="lg:col-span-2 space-y-1 text-slate-300"><span className="text-[11px] uppercase tracking-wider text-slate-400">Notes</span><textarea value={newLeadNotes} onChange={(e) => setNewLeadNotes(e.target.value)} className="w-full min-h-[120px] resize-y bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm" placeholder="Enter initial lead notes or qualification details" /></label>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button onClick={() => { resetNewLeadForm(); setIsAddLeadOpen(false); }} className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">Cancel</button>
              <button onClick={handleCreateLead} className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">Save Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {isViewOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Lead Details — {selectedLead.id}</h3>
                <p className="text-sm text-slate-400">{selectedLead.companyName} · {selectedLead.contactName}</p>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-slate-300">✕</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
              <div><strong>Phone:</strong> {selectedLead.phone}</div>
              <div><strong>Email:</strong> {selectedLead.email}</div>
              <div><strong>Source:</strong> {selectedLead.source}</div>
              <div><strong>Status:</strong> {selectedLead.status}</div>
              <div className="md:col-span-2"><strong>Notes:</strong> {selectedLead.notes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal (Chat) */}
      {isMessagesOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Conversations — {selectedLead.companyName}</h3>
                <p className="text-sm text-slate-400">Channel: {selectedLead.source}</p>
              </div>
              <button onClick={() => setIsMessagesOpen(false)} className="text-slate-300">✕</button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3">
              {(selectedLead.messages ?? []).length === 0 && (
                <div className="text-slate-400">No conversation threads available for this lead.</div>
              )}
              {(selectedLead.messages ?? []).map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl ${m.isStaff ? 'bg-slate-800 text-slate-200 self-end' : 'bg-slate-950 text-slate-200'}`}>
                  <div className="text-xs text-slate-400">{m.sender} · {m.timestamp}</div>
                  <div className="mt-1 text-sm">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <textarea placeholder="Write a reply..." className="w-full rounded-xl p-3 bg-slate-950 border border-slate-800 text-sm text-slate-200" />
              <div className="mt-2 flex justify-end">
                <button className="rounded-2xl bg-emerald-500 px-4 py-2 text-slate-900 font-semibold">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
