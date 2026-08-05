import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { FlightBooking } from '../../types/rbac';
import {
  Ticket,
  Plus,
  Printer,
  Mail,
  Search,
  CheckCircle2,
  X,
  Edit3,
  UserCheck,
  Plane,
  Download,
  AlertCircle
} from 'lucide-react';

export const BookingDeskModule: React.FC = () => {
  const { bookings, addBooking, updateBooking, addAuditLog, hasPermission } = useRBAC();
  const [selectedPnrForTicket, setSelectedPnrForTicket] = useState<FlightBooking | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const canCreate = hasPermission('booking_desk', 'create');
  const canModify = hasPermission('booking_desk', 'write');

  // New Booking Form State
  const [newPassengerName, setNewPassengerName] = useState('');
  const [newPassengerEmail, setNewPassengerEmail] = useState('');
  const [newPassengerPhone, setNewPassengerPhone] = useState('');
  const [newAirline, setNewAirline] = useState('Emirates');
  const [newFlightNum, setNewFlightNum] = useState('EK 504');
  const [newOrigin, setNewOrigin] = useState('JFK (New York)');
  const [newDest, setNewDest] = useState('LHR (London)');
  const [newCabinClass, setNewCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First Class'>('Business');
  const [newSeat, setNewSeat] = useState('08K');
  const [newPrice, setNewPrice] = useState(1850);

  const filteredBookings = bookings.filter(
    (b) =>
      b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassengerName || !newPassengerEmail) return;

    const generatedPnr = `PNR-${newAirline.substring(0, 2).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketNum = `176-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newBookingObj: FlightBooking = {
      pnr: generatedPnr,
      passengerName: newPassengerName,
      passengerEmail: newPassengerEmail,
      passengerPhone: newPassengerPhone || '+1-555-0192',
      flightNumber: newFlightNum,
      airline: newAirline,
      origin: newOrigin,
      destination: newDest,
      departureTime: '2026-08-25 10:00',
      arrivalTime: '2026-08-25 22:30',
      cabinClass: newCabinClass,
      seatNumber: newSeat,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Paid',
      totalAmount: newPrice,
      currency: 'USD',
      bookingDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      apiProvider: 'Amadeus',
      ticketNumber: ticketNum
    };

    addBooking(newBookingObj);
    setIsNewBookingModalOpen(false);
    // Reset form
    setNewPassengerName('');
    setNewPassengerEmail('');
  };

  const handleReissueTicket = (pnr: string) => {
    const newTicketNum = `176-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    updateBooking(pnr, { ticketNumber: newTicketNum, bookingStatus: 'Ticketed' });
    addAuditLog('Reissued Flight Ticket', 'booking_desk', `Reissued e-ticket for PNR ${pnr} - New Ticket ${newTicketNum}`);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Booking Executive Desk & E-Ticketing</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Front Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Booking Executive Scope: Create PNRs, confirm passenger details, modify cabin seats, reissue ticket numbers, and dispatch e-tickets.
            </p>
          </div>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create New PNR Booking
          </button>
        )}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PNR, passenger name, or flight number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.pnr}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                  {booking.pnr}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    booking.bookingStatus === 'Ticketed' || booking.bookingStatus === 'Confirmed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              <div>
                <div className="font-bold text-white text-base">{booking.passengerName}</div>
                <div className="text-xs text-slate-400">{booking.passengerEmail} • {booking.passengerPhone}</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-sky-400" />
                    {booking.airline} ({booking.flightNumber})
                  </span>
                  <span className="text-sky-400 font-mono text-[11px]">{booking.cabinClass} ({booking.seatNumber})</span>
                </div>
                <div className="text-slate-300 font-medium">{booking.origin} → {booking.destination}</div>
                <div className="text-[10px] text-slate-400 font-mono">Dept: {booking.departureTime}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <div>Total: <strong className="text-white text-sm">${booking.totalAmount}</strong></div>
                <div className="text-[10px] font-mono">Ticket: {booking.ticketNumber || 'Pending'}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPnrForTicket(booking)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                View E-Ticket
              </button>

              {canModify && (
                <button
                  onClick={() => handleReissueTicket(booking.pnr)}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Reissue Ticket Number"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Reissue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE BOOKING MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-400" />
                Issue New Passenger PNR Booking
              </h3>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Passenger Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Capt. James Hook"
                    value={newPassengerName}
                    onChange={(e) => setNewPassengerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="passenger@email.com"
                    value={newPassengerEmail}
                    onChange={(e) => setNewPassengerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Airline</label>
                  <select
                    value={newAirline}
                    onChange={(e) => setNewAirline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="Emirates">Emirates</option>
                    <option value="Singapore Airlines">Singapore Airlines</option>
                    <option value="Qatar Airways">Qatar Airways</option>
                    <option value="Lufthansa">Lufthansa</option>
                    <option value="Delta Air Lines">Delta Air Lines</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Flight Number</label>
                  <input
                    type="text"
                    value={newFlightNum}
                    onChange={(e) => setNewFlightNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Origin Airport</label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Destination Airport</label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Cabin Class</label>
                  <select
                    value={newCabinClass}
                    onChange={(e) => setNewCabinClass(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Seat</label>
                  <input
                    type="text"
                    value={newSeat}
                    onChange={(e) => setNewSeat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Fare ($)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Create & Confirm PNR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E-TICKET PREVIEW MODAL */}
      {selectedPnrForTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 text-slate-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Official Electronic Passenger Ticket (E-Ticket)</h3>
                  <p className="text-xs text-slate-400">IATA Standard Electronic Ticket Receipt</p>
                </div>
              </div>
              <button onClick={() => setSelectedPnrForTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ticket Printable Body */}
            <div className="bg-white text-slate-900 p-6 rounded-xl space-y-4 shadow-inner font-sans">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                <div>
                  <div className="font-extrabold text-lg text-slate-900">{selectedPnrForTicket.airline}</div>
                  <div className="text-xs text-slate-500">Electronic Ticket Passenger Receipt</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-blue-800">BOOKING REF (PNR): {selectedPnrForTicket.pnr}</div>
                  <div className="text-[11px] text-slate-600">TICKET NO: {selectedPnrForTicket.ticketNumber || '176-9018274012'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Passenger Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedPnrForTicket.passengerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Cabin & Seat</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedPnrForTicket.cabinClass} ({selectedPnrForTicket.seatNumber})</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Flight {selectedPnrForTicket.flightNumber}</span>
                  <span>Departure: {selectedPnrForTicket.departureTime}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>From: {selectedPnrForTicket.origin}</span>
                  <span>To: {selectedPnrForTicket.destination}</span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="h-10 bg-slate-900 w-48 rounded flex items-center justify-center font-mono text-white text-xs tracking-widest">
                  ||||| | |||| ||| |||||||
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  Issued By: AeroAdmin GDS Desk<br />
                  Total Paid: ${selectedPnrForTicket.totalAmount} {selectedPnrForTicket.currency}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">GDS API Engine: {selectedPnrForTicket.apiProvider}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`E-Ticket sent to ${selectedPnrForTicket.passengerEmail}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  Email Passenger
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Itinerary
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
