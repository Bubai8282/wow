import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { RoleId } from '../../types/rbac';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet2
} from 'lucide-react';

export type DemoRoleId = 'admin' | 'consultant' | 'finance' | 'operations';

interface DemoRoleDashboardProps {
  role: DemoRoleId;
}

export const DemoRoleDashboard: React.FC<DemoRoleDashboardProps> = ({ role }) => {
  const { setActiveRoleId, currentUser } = useRBAC();

  const roleConfig: Record<DemoRoleId, { title: string; subtitle: string; accent: string; badge: string; stats: { label: string; value: string; hint: string }[]; lanes: { title: string; items: string[] }[]; spotlight: string }> = {
    admin: {
      title: 'Admin',
      subtitle: 'Full CRM command center',
      accent: 'from-sky-600 via-blue-600 to-indigo-600',
      badge: 'Executive Control',
      stats: [
        { label: 'Active leads', value: '184', hint: '+12% week over week' },
        { label: 'Open cases', value: '43', hint: '7 need urgent review' },
        { label: 'Revenue', value: '€128K', hint: 'Monthly pipeline' },
        { label: 'Team load', value: '92%', hint: 'At target capacity' }
      ],
      lanes: [
        { title: 'Priority actions', items: ['Approve new case submissions', 'Review onboarding requests', 'Monitor consultant workload'] },
        { title: 'Operations snapshot', items: ['9 consultation slots booked', '3 finance approvals pending', '2 new partnerships created'] }
      ],
      spotlight: 'You can oversee everything from one workspace while keeping each role focused on its own responsibilities.'
    },
    consultant: {
      title: 'Consultant',
      subtitle: 'Client guidance and case progress',
      accent: 'from-emerald-600 via-teal-600 to-cyan-600',
      badge: 'Case Specialist',
      stats: [
        { label: 'Clients', value: '27', hint: '12 active consultations' },
        { label: 'Conversion', value: '68%', hint: 'Above target' },
        { label: 'Follow-ups', value: '11', hint: 'Scheduled this week' },
        { label: 'Documents', value: '19', hint: 'Ready for review' }
      ],
      lanes: [
        { title: 'Today', items: ['Prepare visa checklist for 3 clients', 'Send document reminders', 'Update case milestones'] },
        { title: 'Client notes', items: ['Digital Nomad case review complete', 'Family reunification packet prepared', 'Study visa appointment confirmed'] }
      ],
      spotlight: 'The consultant dashboard keeps client requests, documents, and follow-ups visible in a single flow.'
    },
    finance: {
      title: 'Finance',
      subtitle: 'Payments, invoices, and settlement',
      accent: 'from-amber-600 via-orange-600 to-rose-600',
      badge: 'Revenue Control',
      stats: [
        { label: 'Pending fees', value: '€18.4K', hint: 'Awaiting payment' },
        { label: 'Invoices', value: '24', hint: '4 flagged for review' },
        { label: 'Refunds', value: '3', hint: 'Under processing' },
        { label: 'Collections', value: '91%', hint: 'On-time recovery' }
      ],
      lanes: [
        { title: 'Finance queue', items: ['Verify package payments', 'Send tax-ready summaries', 'Approve refund requests'] },
        { title: 'Incoming activity', items: ['2 wire transfers received', '1 package upgrade confirmed', '3 invoices generated'] }
      ],
      spotlight: 'Finance gets a fast view of revenue, fee status, and payment follow-ups without exposing unrelated operations.'
    },
    operations: {
      title: 'Operations',
      subtitle: 'Execution, coordination, and delivery',
      accent: 'from-violet-600 via-fuchsia-600 to-purple-600',
      badge: 'Delivery Desk',
      stats: [
        { label: 'Scheduled tasks', value: '36', hint: 'Next 48 hours' },
        { label: 'Case handoffs', value: '14', hint: 'Transferred today' },
        { label: 'Document issues', value: '5', hint: 'Needs support' },
        { label: 'Efficiency', value: '94%', hint: 'On-time delivery' }
      ],
      lanes: [
        { title: 'Workflow', items: ['Track appointment bookings', 'Coordinate submission tasks', 'Escalate document gaps'] },
        { title: 'Support', items: ['4 client follow-ups', '2 external agency messages', '1 courier milestone due'] }
      ],
      spotlight: 'Operations keeps every case moving from intake to final decision with clear ownership and deadlines.'
    }
  };

  const roleMeta = roleConfig[role];
  const roleOptions: Array<{ id: DemoRoleId; label: string }> = [
    { id: 'admin', label: 'Admin' },
    { id: 'consultant', label: 'Consultant' },
    { id: 'finance', label: 'Finance' },
    { id: 'operations', label: 'Operations' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className={`rounded-[28px] border border-slate-800 bg-gradient-to-br ${roleMeta.accent} p-[1px] shadow-2xl shadow-slate-950/40`}>
          <div className="rounded-[27px] bg-slate-950/95 p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-200">
                    {roleMeta.badge}
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                    Demo mode · no credentials required
                  </div>
                </div>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">AAA Business Consultancy CRM</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                  {roleMeta.subtitle} with a fast, role-based workspace inspired by the reference portal.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveRoleId(option.id as RoleId)}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${role === option.id ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roleMeta.stats.map((stat, index) => (
            <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{stat.label}</div>
              <div className="mt-2 text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-400">{stat.hint}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center gap-2 text-white">
              <LayoutDashboard className="h-4 w-4 text-sky-400" />
              <h2 className="text-lg font-semibold">{roleMeta.title} workspace</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">{roleMeta.spotlight}</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {roleMeta.lanes.map((lane) => (
                <div key={lane.title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    {lane.title}
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    {lane.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="flex items-center gap-2 text-white">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                <h2 className="text-lg font-semibold">User profile</h2>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="text-sm font-semibold text-white">{currentUser?.name ?? 'Demo User'}</div>
                <div className="mt-1 text-sm text-slate-400">{currentUser?.email ?? 'demo@aaabusinessconsultancy.com'}</div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Role access tuned for {roleMeta.title.toLowerCase()}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="flex items-center gap-2 text-white">
                <CalendarDays className="h-4 w-4 text-indigo-400" />
                <h2 className="text-lg font-semibold">Live activity</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                {[{ icon: MessageSquareText, label: 'Client messages', value: '8 unread' }, { icon: CreditCard, label: 'Payments', value: '4 pending' }, { icon: Wallet2, label: 'Budget', value: '€91K available' }, { icon: BarChart3, label: 'Performance', value: '+14% this week' }].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-sky-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-semibold text-slate-200">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-sm text-slate-400 shadow-lg">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-sky-400" />
            Role switching is instant and does not require credentials.
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 font-semibold text-slate-950">
            Explore role view <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
