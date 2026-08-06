import React, { useMemo, useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { FlightBooking } from '../../types/rbac';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  LifeBuoy,
  Percent,
  Plane,
  Plus,
  Receipt,
  Search,
  Shield,
  Sparkles,
  Users,
  Wallet,
  X
} from 'lucide-react';

export const AgentManagerModule: React.FC = () => {
  const {
    agents,
    bookings,
    tickets,
    transactions,
    addBooking,
    addSupportTicket,
    addTransaction,
    updateBooking,
    updateTicket,
    currentUser,
    addAuditLog
  } = useRBAC();

  const currentAgent = agents[0] ?? null;
  const walletBalance = currentAgent?.walletBalance ?? 12500;

  const [searchForm, setSearchForm] = useState({
    origin: 'JFK',
    destination: 'DXB',
    departureDate: '2026-08-10',
    passengers: 1,
    cabinClass: 'Business' as FlightBooking['cabinClass']
  });

  const [bookingForm, setBookingForm] = useState({
    passengerName: currentUser.name,
    passengerEmail: currentUser.email,
    passengerPhone: '+971-50-111-2222',
    cabinClass: 'Business' as FlightBooking['cabinClass'],
    totalAmount: 2450
  });

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'General Query' as string,
    priority: 'Medium' as string
  });

  const bookingStats = useMemo(() => {
    const paidBookings = bookings.filter((booking) => booking.paymentStatus === 'Paid').length;
    const pendingRefunds = tickets.filter((ticket) => ticket.category === 'Refund').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const commissionEarned = transactions
      .filter((tx) => tx.type === 'Payment')
      .reduce((sum, tx) => sum + tx.amount * 0.05, 0);

    return {
      paidBookings,
      pendingRefunds,
      totalRevenue,
      commissionEarned
    };
  }, [bookings, tickets, transactions]);

  const liveFlightOptions = [
    { airline: 'Emirates', flight: 'EK 202', route: 'JFK → DXB', time: '22:30', fare: '$2,450', status: 'Best Fare' },
    { airline: 'Qatar Airways', flight: 'QR 008', route: 'JFK → DOH', time: '08:00', fare: '$2,180', status: 'Flexible' },
    { airline: 'Singapore Airlines', flight: 'SQ 025', route: 'JFK → SIN', time: '11:45', fare: '$2,920', status: 'Premium' }
  ];

  const customerProfiles = bookings.slice(0, 4).map((booking) => ({
    name: booking.passengerName,
    route: `${booking.origin} → ${booking.destination}`,
    status: booking.bookingStatus,
    pnr: booking.pnr
  }));

  const recentNotifications = [
    { title: 'Booking confirmed', detail: 'PNR-EK8920 is ready for ticket issuance.' },
    { title: 'Refund update', detail: 'Your refund request is now under review.' },
    { title: 'Schedule change', detail: 'Flight EK 202 departure moved by 15 minutes.' }
  ];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const pnr = `PNR-TRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const booking: FlightBooking = {
      pnr,
      passengerName: bookingForm.passengerName || currentUser.name,
      passengerEmail: bookingForm.passengerEmail || currentUser.email,
      passengerPhone: bookingForm.passengerPhone || '+971-50-111-2222',
      flightNumber: `${searchForm.origin}-${searchForm.destination}`,
      airline: 'SkyBridge Air',
      origin: searchForm.origin,
      destination: searchForm.destination,
      departureTime: `${searchForm.departureDate} 08:00`,
      arrivalTime: `${searchForm.departureDate} 15:20`,
      cabinClass: bookingForm.cabinClass,
      seatNumber: '08C',
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: bookingForm.totalAmount,
      currency: 'USD',
      bookingDate: new Date().toISOString().slice(0, 10),
      apiProvider: 'Live GDS',
      agentId: currentAgent?.id,
      ticketNumber: `TKT-${Math.floor(100000 + Math.random() * 900000)}`
    };

    addBooking(booking);
    addTransaction({
      id: `TXN-${Date.now()}`,
      pnr,
      type: 'Payment',
      amount: booking.totalAmount,
      currency: 'USD',
      gateway: 'Stripe',
      status: 'Verified',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      customerName: booking.passengerName,
      taxAmount: booking.totalAmount * 0.08,
      markupAmount: booking.totalAmount * 0.05
    });
    addAuditLog('Created Travel Agent Booking', 'agent_portal', `Booked ${booking.pnr} for ${booking.passengerName}`);
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject) return;

    addSupportTicket({
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      pnr: `PNR-TRV-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: bookingForm.passengerName || currentUser.name,
      customerEmail: bookingForm.passengerEmail || currentUser.email,
      subject: ticketForm.subject,
      category: ticketForm.category as 'Cancellation' | 'Refund' | 'Baggage' | 'Flight Change' | 'General Query',
      priority: ticketForm.priority as 'Low' | 'Medium' | 'High' | 'Urgent',
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messages: []
    });
    setTicketForm({ subject: '', category: 'General Query', priority: 'Medium' });
  };

  const handleBookingAction = (pnr: string, status: 'Cancelled' | 'Ticketed') => {
    updateBooking(pnr, {
      bookingStatus: status,
      paymentStatus: status === 'Cancelled' ? 'Refunded' : 'Paid'
    });
    updateTicket(tickets[0]?.id ?? 'TKT-0000', { status: 'Resolved' });
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white">Travel Agent Dashboard</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                B2B Travel Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Search flights, manage bookings, track wallet activity, process refunds, and serve customers from one secure workspace.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-300">
            <div className="font-semibold">Wallet</div>
            <div className="font-bold text-white">${walletBalance.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-sky-300">
            <div className="font-semibold">Commission</div>
            <div className="font-bold text-white">${bookingStats.commissionEarned.toFixed(0)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Bookings', value: bookings.length.toString(), note: `${bookingStats.paidBookings} paid`, icon: Plane },
          { label: 'Customers', value: customerProfiles.length.toString(), note: 'Active profiles', icon: Users },
          { label: 'Refund Requests', value: bookingStats.pendingRefunds.toString(), note: 'Needs follow-up', icon: Receipt },
          { label: 'Revenue', value: `$${bookingStats.totalRevenue.toLocaleString()}`, note: 'This month', icon: DollarSign }
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400">{card.label}</div>
                  <div className="text-xl font-bold text-white mt-1">{card.value}</div>
                </div>
                <div className="rounded-xl bg-indigo-500/10 text-indigo-300 p-2">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-3">{card.note}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2"><Search className="w-4 h-4 text-indigo-400" /> Real-Time Flight Search</h2>
              <p className="text-xs text-slate-400 mt-1">Search, compare fares, and launch new bookings instantly.</p>
            </div>
            <button className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300">Live GDS</button>
          </div>

          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={searchForm.origin} onChange={(e) => setSearchForm({ ...searchForm, origin: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Origin" />
            <input value={searchForm.destination} onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Destination" />
            <input type="date" value={searchForm.departureDate} onChange={(e) => setSearchForm({ ...searchForm, departureDate: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" />
            <select value={searchForm.cabinClass} onChange={(e) => setSearchForm({ ...searchForm, cabinClass: e.target.value as FlightBooking['cabinClass'] })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white">
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
            <input type="number" min="1" value={searchForm.passengers} onChange={(e) => setSearchForm({ ...searchForm, passengers: Number(e.target.value) })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" />
            <input value={bookingForm.passengerName} onChange={(e) => setBookingForm({ ...bookingForm, passengerName: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Passenger Name" />
            <input value={bookingForm.passengerEmail} onChange={(e) => setBookingForm({ ...bookingForm, passengerEmail: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Passenger Email" />
            <input value={bookingForm.passengerPhone} onChange={(e) => setBookingForm({ ...bookingForm, passengerPhone: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Passenger Phone" />
            <input type="number" value={bookingForm.totalAmount} onChange={(e) => setBookingForm({ ...bookingForm, totalAmount: Number(e.target.value) })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Amount" />
            <button type="submit" className="md:col-span-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:bg-indigo-500">
              <Plus className="w-4 h-4" /> Create Booking
            </button>
          </form>

          <div className="grid gap-2">
            {liveFlightOptions.map((option) => (
              <div key={option.flight} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-sm">
                <div>
                  <div className="font-semibold text-white">{option.airline} · {option.flight}</div>
                  <div className="text-xs text-slate-400">{option.route} · {option.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-300">{option.fare}</div>
                  <div className="text-[11px] text-slate-400">{option.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" /> Quick Actions</h2>
            <p className="text-xs text-slate-400 mt-1">All core travel-agent capabilities are available from this workspace.</p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { title: 'Booking Management', detail: 'Modify, cancel, and reissue tickets' },
              { title: 'Wallet & Payments', detail: 'View balance and payment history' },
              { title: 'Commission Dashboard', detail: 'Track earnings and reports' },
              { title: 'Support & Refunds', detail: 'Open tickets and follow updates' }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="font-semibold text-white">{item.title}</div>
                <div className="text-xs text-slate-400">{item.detail}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
            <div className="font-semibold">Restrictions</div>
            <div className="mt-1">You can manage your own customers, bookings, wallet activity, tickets, and reports, but not platform-wide settings or other agents&apos; data.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Plane className="w-4 h-4 text-indigo-400" /> Booking Management</h2>
            <button className="text-xs text-slate-400">Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2 pr-3">PNR</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Route</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.pnr} className="hover:bg-slate-800/40">
                    <td className="py-2 pr-3 text-slate-200">{booking.pnr}</td>
                    <td className="py-2 pr-3 text-white">{booking.passengerName}</td>
                    <td className="py-2 pr-3 text-slate-400">{booking.origin} → {booking.destination}</td>
                    <td className="py-2 pr-3">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">{booking.bookingStatus}</span>
                    </td>
                    <td className="py-2">
                      <button onClick={() => handleBookingAction(booking.pnr, booking.bookingStatus === 'Confirmed' ? 'Ticketed' : 'Cancelled')} className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-200">{booking.bookingStatus === 'Confirmed' ? 'Reissue' : 'Cancel'}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Wallet className="w-4 h-4 text-indigo-400" /> Wallet & Payment History</h2>
            <button className="text-xs text-slate-400 flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Receipts</button>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 mb-3">
            <div className="text-[11px] uppercase tracking-wider text-emerald-300">Available balance</div>
            <div className="text-2xl font-bold text-white">${walletBalance.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm">
                <div>
                  <div className="font-semibold text-white">{tx.type}</div>
                  <div className="text-xs text-slate-400">{tx.customerName}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald-300">${tx.amount.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /> Customer Management</h2>
            <button className="text-xs text-slate-400">View Profiles</button>
          </div>
          <div className="space-y-2">
            {customerProfiles.map((customer) => (
              <div key={customer.pnr} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3">
                <div>
                  <div className="font-semibold text-white">{customer.name}</div>
                  <div className="text-xs text-slate-400">{customer.route}</div>
                </div>
                <div className="text-right">
                  <div className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300">{customer.status}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{customer.pnr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Percent className="w-4 h-4 text-indigo-400" /> Commission & Reports</h2>
            <button className="text-xs text-slate-400 flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> Export</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Earnings</div>
              <div className="text-xl font-bold text-white mt-1">${bookingStats.commissionEarned.toFixed(0)}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Report Types</div>
              <div className="text-sm text-slate-200 mt-1">Daily · Monthly · Sales · Revenue</div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
            <div className="font-semibold text-white mb-1">Performance highlights</div>
            <div className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4 confirmed bookings and 2 pending follow-ups this week.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-indigo-400" /> Notifications & Alerts</h2>
            <button className="text-xs text-slate-400">Center</button>
          </div>
          <div className="space-y-2">
            {recentNotifications.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="font-semibold text-white">{item.title}</div>
                <div className="text-xs text-slate-400">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><LifeBuoy className="w-4 h-4 text-indigo-400" /> Support Ticket System</h2>
            <button className="text-xs text-slate-400">Open Ticket</button>
          </div>
          <form onSubmit={handleCreateSupportTicket} className="space-y-2">
            <input value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white" placeholder="Support subject" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <select value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white">
                <option>General Query</option>
                <option>Cancellation</option>
                <option>Refund</option>
                <option>Baggage</option>
                <option>Flight Change</option>
              </select>
              <select value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create Support Ticket
            </button>
          </form>
          <div className="space-y-2">
            {tickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white">{ticket.subject}</div>
                  <div className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">{ticket.status}</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{ticket.category} · {ticket.priority}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-400" /> Profile & Security Settings</h2>
          <button className="text-xs text-slate-400">Update</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Business Info</div>
            <div className="font-semibold text-white mt-1">{currentAgent?.agencyName ?? 'Atlas Global Travel'}</div>
            <div className="text-slate-400">{currentAgent?.email ?? currentUser.email}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Security</div>
            <div className="font-semibold text-white mt-1">Two-factor authentication enabled</div>
            <div className="text-slate-400">Backup codes and password reset available</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-400">Documents</div>
            <div className="font-semibold text-white mt-1">Company logo & contracts uploaded</div>
            <div className="text-slate-400 flex items-center gap-1 mt-1"><Download className="w-3.5 h-3.5" /> Download profile package</div>
          </div>
        </div>
      </div>
    </div>
  );
};
