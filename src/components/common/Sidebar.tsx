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
  const { addAuditLog, addLead, leads, callLogs, agents, tickets, transactions, updateLead, removeLead, staffMembers, campaigns } = useRBAC();
  const [activeView, setActiveView] = useState(initialView);
  const [isDark, setIsDark] = useState(true);
  const [leadSearch, setLeadSearch] = useState('');
  const [agentSearch, setAgentSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [leadMessageSearch, setLeadMessageSearch] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'Facebook' | 'Instagram' | 'Telegram'>('WhatsApp');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('thread-1');
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

  const filteredAgents = agents.filter((agent) =>
    [agent.agencyName, agent.ownerName, agent.email, agent.phone, agent.city, agent.country].some((value) =>
      value.toLowerCase().includes(agentSearch.toLowerCase())
    )
  );

  const filteredClients = leads.filter((lead) =>
    [lead.companyName, lead.contactName, lead.email, lead.phone, lead.assignedTo].some((value) =>
      value.toLowerCase().includes(clientSearch.toLowerCase())
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

  const socialChannels = ['WhatsApp', 'Facebook', 'Instagram', 'Telegram'] as const;
  const socialThreads = [
    {
      id: 'thread-1',
      channel: 'WhatsApp',
      name: 'Amelia Watson',
      preview: 'Excellent, is there a booking link for the zoom call?',
      updatedAt: '10:22 AM',
      messages: [
        { sender: 'Amelia Watson', text: 'Excellent, is there a booking link for the zoom call?', time: '10:22 AM', isStaff: false },
        { sender: 'Case Agent', text: 'I have shared the calendar invite. We can also review your travel plan first.', time: '10:23 AM', isStaff: true }
      ]
    },
    {
      id: 'thread-2',
      channel: 'Facebook',
      name: 'Luis Fernandez',
      preview: 'Our team needs help finalizing the corporate travel bundle.',
      updatedAt: '09:50 AM',
      messages: [
        { sender: 'Luis Fernandez', text: 'Our team needs help finalizing the corporate travel bundle.', time: '09:50 AM', isStaff: false },
        { sender: 'Case Agent', text: 'I will prepare a custom offer for your group and send it by noon.', time: '09:52 AM', isStaff: true }
      ]
    },
    {
      id: 'thread-3',
      channel: 'Instagram',
      name: 'Nina Petrova',
      preview: 'Can I change my visa appointment to next week?',
      updatedAt: '08:35 AM',
      messages: [
        { sender: 'Nina Petrova', text: 'Can I change my visa appointment to next week?', time: '08:35 AM', isStaff: false },
        { sender: 'Case Agent', text: 'Yes, the local embassy has next-week timing available. I will update your case.', time: '08:37 AM', isStaff: true }
      ]
    },
    {
      id: 'thread-4',
      channel: 'Telegram',
      name: 'Marco Silva',
      preview: 'Please share the final invoice for the service package.',
      updatedAt: '07:12 AM',
      messages: [
        { sender: 'Marco Silva', text: 'Please share the final invoice for the service package.', time: '07:12 AM', isStaff: false },
        { sender: 'Case Agent', text: 'Invoice has been generated and sent to your email.', time: '07:14 AM', isStaff: true }
      ]
    }
  ];

  const filteredSocialThreads = socialThreads.filter((thread) =>
    (thread.name + thread.preview + thread.channel).toLowerCase().includes(chatSearch.toLowerCase())
  );
  const selectedThread = socialThreads.find((thread) => thread.id === selectedThreadId) ?? socialThreads[0];

  const clientRows = filteredClients.map((lead, index) => {
    const packageOptions = ['Full Process Package', 'Premium Package', 'Express Support Package'];
    const billingOptions = ['Under Process', 'Waiting for Payment', 'Completed', 'Request Received'];
    const progressOptions = ['Submitted - Pending Decision', 'Document Preparation', 'Visa Approved', 'Not Started'];
    const nationalities = ['Chinese', 'Mexican', 'Polish', 'Italian', 'Indian', 'American'];

    return {
      ...lead,
      nationality: nationalities[index % nationalities.length],
      selectedPackage: packageOptions[index % packageOptions.length],
      billingStatus: billingOptions[index % billingOptions.length],
      immigrationProgress: progressOptions[index % progressOptions.length],
      caseManager: lead.assignedTo || 'Sofia Rodriguez'
    };
  });

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

  const demoCalendarEvents = [
    { title: 'Executive QBR', date: '2026-08-10', time: '10:00', location: 'Teams', attendees: '6 attendees' },
    { title: 'Client Renewal Review', date: '2026-08-12', time: '14:30', location: 'Dubai Office', attendees: '4 attendees' },
    { title: 'Agent Enablement Session', date: '2026-08-14', time: '16:00', location: 'Zoom', attendees: '12 attendees' }
  ];

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
      <div className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-sky-300">
              <ShieldAlert className="w-4 h-4" />
              Super Admin Control Center
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Dynamic operations hub for agents, clients, finance, marketing, and social inbox.</h2>
              <p className="mt-3 text-base leading-7 text-slate-400">Full-featured Super Admin dashboard with live CRM insights, employee activity, deal progress, and support intelligence—built for demo content and realistic control.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <button onClick={() => setActiveView('leads')} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">View Leads Pipeline</button>
            <button onClick={() => setActiveView('clients')} className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-500 hover:text-white">Open Client Cases</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white">Live performance metrics</h3>
          <div className="mt-5 grid gap-4">
            {kpiCards.slice(0, 3).map((card) => {
              const Icon = card.icon;
              const isPositive = card.trend === 'up';
              return (
                <div key={card.title} className="flex items-start justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="space-y-2">
                    <div className="text-sm text-slate-400">{card.title}</div>
                    <div className="text-2xl font-bold text-white">{card.value}</div>
                  </div>
                  <div className={`rounded-2xl p-3 ${isPositive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white">Executive summary</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-white">Agent pipeline health</span>
                <span className="text-emerald-300">{agents.filter((agent) => agent.status === 'Approved').length} active</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-400" style={{ width: '76%' }} /></div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-white">Client follow-ups</span>
                <span className="text-sky-300">{clientRows.length} open cases</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-sky-400" style={{ width: '58%' }} /></div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-white">Marketing reach</span>
                <span className="text-amber-300">{campaigns.length} campaigns</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-amber-400" style={{ width: '69%' }} /></div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white">Today's action items</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="font-semibold text-white">New leads to qualify</div>
              <div className="mt-2 text-slate-400">Review {leads.filter((lead) => lead.status === 'New').length} fresh inquiries and assign case managers.</div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="font-semibold text-white">Pending payments</div>
              <div className="mt-2 text-slate-400">Resolve {transactions.filter((tx) => tx.status === 'Pending').length} billing items before EOD.</div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="font-semibold text-white">Social inbox follow-up</div>
              <div className="mt-2 text-slate-400">Continue conversation with {socialThreads.length} clients across WhatsApp, Facebook, Instagram, and Telegram.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent client work</h3>
              <p className="text-sm text-slate-400">Latest client cases and billing progress.</p>
            </div>
            <button onClick={() => setActiveView('clients')} className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-sky-500">View all clients</button>
          </div>
          <div className="mt-6 space-y-3">
            {clientRows.slice(0, 3).map((client) => (
              <div key={client.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 sm:flex sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-white">{client.companyName}</div>
                  <div className="mt-1 text-sm text-slate-400">{client.contactName} • {client.country}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{client.selectedPackage}</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{client.billingStatus}</span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{client.immigrationProgress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white">Marketing pulse</h3>
            <div className="mt-5 grid gap-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{campaign.title}</div>
                      <div className="text-sm text-slate-400">{campaign.type} • {campaign.targetAudience}</div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">{campaign.status}</span>
                  </div>
                  <div className="mt-3 text-sm text-slate-400">{campaign.discount} • Valid until {campaign.validUntil}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white">Recent conversations</h3>
            <div className="mt-5 space-y-3">
              {socialThreads.slice(0, 3).map((thread) => (
                <div key={thread.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white">{thread.name}</div>
                      <div className="text-sm text-slate-400">{thread.channel} • {thread.updatedAt}</div>
                    </div>
                    <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">{thread.channel}</span>
                  </div>
                  <div className="mt-3 text-sm text-slate-400">{thread.preview}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModuleView = () => {
    switch (activeView) {
      case 'agents':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Agents</h3>
                <p className="text-sm text-slate-400">Overview of partner agencies, onboarding status, and account health.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input value={agentSearch} onChange={(e) => setAgentSearch(e.target.value)} placeholder="Search agents" className="w-64 rounded-2xl border border-slate-700 bg-slate-950/70 py-2 pl-10 pr-3 text-sm text-slate-200" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Agent ID</th>
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
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-200 font-semibold">{agent.id}</td>
                      <td className="py-3 px-4 text-slate-100">{agent.agencyName}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.ownerName}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.email}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.phone}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.status}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.city}</td>
                      <td className="py-3 px-4 text-slate-300">{agent.joinedDate}</td>
                      <td className="py-3 px-4 text-slate-300">● ● ●</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Staff Directory</h3>
                <p className="text-sm text-slate-400">Role-based people roster for operations, support, finance, and admin teams.</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Staff ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {staffMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-200 font-semibold">{member.id}</td>
                      <td className="py-3 px-4 text-slate-100">{member.name}</td>
                      <td className="py-3 px-4 text-slate-300">{member.department}</td>
                      <td className="py-3 px-4 text-slate-300">{member.roleId}</td>
                      <td className="py-3 px-4 text-slate-300">{member.status}</td>
                      <td className="py-3 px-4 text-slate-300">{member.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'finance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Finance Overview</h3>
                <p className="text-sm text-slate-400">Live payment, refund, and settlement activity for the demo CRM.</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-200 font-semibold">{tx.id}</td>
                      <td className="py-3 px-4 text-slate-100">{tx.customerName}</td>
                      <td className="py-3 px-4 text-slate-300">{tx.type}</td>
                      <td className="py-3 px-4 text-slate-300">${tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-300">{tx.status}</td>
                      <td className="py-3 px-4 text-slate-300">{tx.gateway}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Clients</h3>
                  <p className="text-sm text-slate-400">Case management view for client packages, billing status, and progress tracking.</p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="Search clients" className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-slate-200" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-[1.75rem] border border-slate-800 bg-slate-950/80">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-[0.18em]">
                    <tr>
                      <th className="py-5 px-6 text-base">Nationality</th>
                      <th className="py-5 px-6 text-base">Target Visa</th>
                      <th className="py-5 px-6 text-base">Selected Package</th>
                      <th className="py-5 px-6 text-base">Billing Status</th>
                      <th className="py-5 px-6 text-base">Immigration Progress</th>
                      <th className="py-5 px-6 text-base">Case Manager</th>
                      <th className="py-5 px-6 text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {clientRows.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-900/80 transition-colors">
                        <td className="py-5 px-6 font-semibold text-base text-white">{client.nationality}</td>
                        <td className="py-5 px-6 text-base text-slate-300">Non-Lucrative Visa (NLV)</td>
                        <td className="py-5 px-6 text-base text-slate-300">{client.selectedPackage}</td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            client.billingStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-300' :
                            client.billingStatus === 'Waiting for Payment' ? 'bg-amber-500/10 text-amber-300' :
                            'bg-sky-500/10 text-sky-300'
                          }`}>{client.billingStatus}</span>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            client.immigrationProgress === 'Visa Approved' ? 'bg-emerald-500/10 text-emerald-300' :
                            client.immigrationProgress === 'Document Preparation' ? 'bg-slate-700 text-slate-100' :
                            'bg-sky-500/10 text-sky-300'
                          }`}>{client.immigrationProgress}</span>
                        </td>
                        <td className="py-5 px-6 text-base text-slate-300">{client.caseManager}</td>
                        <td className="py-5 px-6 text-base text-slate-300"> <button className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500">View</button> </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Social Inbox</h3>
                  <p className="text-sm text-slate-400">Real-time conversations across WhatsApp, Facebook, Instagram, and Telegram.</p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} placeholder="Search chats" className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-slate-200" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.35fr_0.35fr_0.9fr]">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Channels</div>
                <div className="space-y-3">
                  {socialChannels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${selectedChannel === channel ? 'bg-sky-500/10 text-sky-200 border border-sky-500/30' : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'}`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Conversations</div>
                    <div className="text-xs text-slate-500">{filteredSocialThreads.filter((thread) => thread.channel === selectedChannel).length} active</div>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">{selectedChannel}</span>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {filteredSocialThreads.filter((thread) => thread.channel === selectedChannel).map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full rounded-3xl border px-5 py-5 text-left transition ${selectedThreadId === thread.id ? 'border-sky-500/40 bg-slate-950/80' : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-base font-semibold text-white">{thread.name}</div>
                          <div className="mt-1 text-sm text-slate-400">{thread.preview}</div>
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{thread.updatedAt}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedThread.name}</h4>
                    <div className="text-sm text-slate-400">{selectedThread.channel} chat</div>
                  </div>
                  <button className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-sky-500">New Lead</button>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[55vh] pr-1">
                  {selectedThread.messages.map((message, idx) => (
                    <div key={idx} className={`rounded-3xl p-5 ${message.isStaff ? 'bg-slate-950 text-slate-200 self-end' : 'bg-slate-900 text-slate-100'}`}>
                      <div className="text-sm font-semibold text-slate-400">{message.sender}</div>
                      <div className="mt-3 text-base leading-7">{message.text}</div>
                      <div className="mt-3 text-xs text-slate-500">{message.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-3">
                  <input placeholder="Type a reply..." className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 outline-none" />
                  <button className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950">Send</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'marketing':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Marketing Campaigns</h3>
                <p className="text-sm text-slate-400">Demo promotions, offers, and audience targeting for the Super Admin team.</p>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Campaign</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Usage</th>
                    <th className="py-3 px-4">Audience</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-100">{campaign.title}</td>
                      <td className="py-3 px-4 text-slate-300">{campaign.type}</td>
                      <td className="py-3 px-4 text-slate-300">{campaign.discount}</td>
                      <td className="py-3 px-4 text-slate-300">{campaign.status}</td>
                      <td className="py-3 px-4 text-slate-300">{campaign.usageCount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-300">{campaign.targetAudience}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Calendar</h3>
                <p className="text-sm text-slate-400">Demo events, meetings, and follow-ups for the Super Admin team.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {demoCalendarEvents.map((event) => (
                <div key={event.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-sm font-semibold text-white">{event.title}</div>
                  <div className="mt-2 text-sm text-slate-400">{event.date} · {event.time}</div>
                  <div className="mt-1 text-sm text-slate-400">{event.location}</div>
                  <div className="mt-3 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">{event.attendees}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'all_agents_performance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
              <div>
                <h3 className="text-lg font-semibold text-white">All Agents Performance</h3>
                <p className="text-sm text-slate-400">Performance matrix and productivity comparison for every agent.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="text-sm font-semibold text-white">{agent.agencyName}</div>
                  <div className="mt-2 text-sm text-slate-400">{agent.ownerName}</div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
                    <span>Bookings</span>
                    <span className="font-semibold text-white">{agent.totalBookings}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Commission</span>
                    <span className="font-semibold text-white">{agent.commissionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
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
