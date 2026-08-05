import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  PlaneTakeoff,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Ticket,
  Filter,
  Search,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

export const OperationsModule: React.FC = () => {
  const { bookings, updateBooking, addAuditLog, hasPermission } = useRBAC();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.airline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.bookingStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const canModify = hasPermission('operations', 'write');

  const handleStatusChange = (pnr: string, newStatus: any) => {
    updateBooking(pnr, { bookingStatus: newStatus });
    addAuditLog('Updated Flight Booking Status', 'operations', `PNR ${pnr} status changed to ${newStatus}`);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 border border-sky-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <PlaneTakeoff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Flight Operations & Schedule Control</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Live Ops Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Operations Manager Scope: Monitor live flight bookings, manage ticket issuance queues, schedule disruptions, and operational escalations.
            </p>
          </div>
        </div>

        {/* Operational Quick Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-slate-400 text-[10px]">Active PNRs</div>
            <div className="font-bold text-white text-base">{bookings.length}</div>
          </div>
          <div className="px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <div className="text-slate-400 text-[10px]">Ticketed</div>
            <div className="font-bold text-emerald-400 text-base">
              {bookings.filter((b) => b.bookingStatus === 'Ticketed' || b.bookingStatus === 'Confirmed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter PNR, passenger, airline, or flight number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Ticketed">Ticketed</option>
            <option value="Pending">Pending</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Live Booking Operations Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-sky-400" />
            Live Flight Schedule & Passenger Manifest Queue
          </h2>
          <span className="text-xs text-slate-400">Showing {filteredBookings.length} bookings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">PNR / Ticket</th>
                <th className="py-3 px-3">Passenger</th>
                <th className="py-3 px-3">Flight & Airline</th>
                <th className="py-3 px-3">Route & Class</th>
                <th className="py-3 px-3">Departure</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredBookings.map((b) => (
                <tr key={b.pnr} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-sky-400 font-mono">{b.pnr}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.ticketNumber || 'Ticket Pending'}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{b.passengerName}</div>
                    <div className="text-[10px] text-slate-400">{b.passengerEmail}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{b.airline} ({b.flightNumber})</div>
                    <div className="text-[10px] text-slate-400">GDS: {b.apiProvider}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-medium">{b.origin} → {b.destination}</div>
                    <div className="text-[10px] text-sky-400">{b.cabinClass} ({b.seatNumber})</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 text-[11px] font-mono">
                    {b.departureTime}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.bookingStatus === 'Ticketed' || b.bookingStatus === 'Confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : b.bookingStatus === 'Pending' || b.bookingStatus === 'On Hold'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {canModify ? (
                      <select
                        value={b.bookingStatus}
                        onChange={(e) => handleStatusChange(b.pnr, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Ticketed">Ticketed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Read-Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
