import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { SupportTicket } from '../../types/rbac';
import {
  Headphones,
  MessageSquare,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Search,
  Plus
} from 'lucide-react';

export const CustomerSupportModule: React.FC = () => {
  const { tickets, updateTicket, addSupportTicket, addAuditLog, hasPermission } = useRBAC();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  // New ticket fields
  const [newPnr, setNewPnr] = useState('PNR-EK8920');
  const [newCustomer, setNewCustomer] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<'Cancellation' | 'Refund' | 'Baggage' | 'Flight Change' | 'General Query'>('General Query');

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg = {
      sender: 'Customer Support Desk',
      text: replyText,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isStaff: true
    };

    updateTicket(activeTicket.id, {
      messages: [...activeTicket.messages, newMsg],
      status: 'In Progress'
    });

    setReplyText('');
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newSubject) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(8000 + Math.random() * 1000)}`,
      pnr: newPnr,
      customerName: newCustomer,
      customerEmail: `${newCustomer.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      subject: newSubject,
      category: newCategory,
      priority: 'High',
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messages: [
        {
          sender: newCustomer,
          text: newSubject,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          isStaff: false
        }
      ]
    };

    addSupportTicket(newTicket);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Customer Support & Assistance Desk</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Support Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customer Support Scope: Resolve booking inquiries, refund assistance, ticket cancellations, and live passenger chat messaging.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Customer Inbound Ticket
        </button>
      </div>

      {/* Support Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ticket List Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="font-bold text-xs text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>Support Ticket Queue ({tickets.length})</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">SLA Active</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {tickets.map((t) => {
              const isSelected = t.id === selectedTicketId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-sky-400">{t.id}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        t.status === 'Open'
                          ? 'bg-amber-500/20 text-amber-300'
                          : t.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-slate-100 truncate">{t.customerName}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.subject}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span className="font-mono text-emerald-400">PNR: {t.pnr}</span>
                    <span>{t.createdAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Chat & Resolution Desk */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[500px]">
          {activeTicket ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              
              {/* Ticket Details Bar */}
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{activeTicket.subject}</span>
                    <span className="text-xs text-sky-400 font-mono font-bold">({activeTicket.pnr})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customer: <strong className="text-slate-200">{activeTicket.customerName}</strong> ({activeTicket.customerEmail})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateTicket(activeTicket.id, { status: 'Resolved' })}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 max-h-[380px]">
                {activeTicket.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.isStaff ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                        msg.isStaff
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-80">{msg.sender}</div>
                      <div>{msg.text}</div>
                      <div className="text-[9px] text-right opacity-70 mt-1">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="flex gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Type support response or refund details..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select a ticket to begin customer support resolution.
            </div>
          )}
        </div>

      </div>

      {/* NEW TICKET MODAL */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Log Inbound Customer Inquiry</h3>
            <form onSubmit={handleCreateTicketSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Associated PNR</label>
                <input
                  type="text"
                  value={newPnr}
                  onChange={(e) => setNewPnr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Subject / Query *</label>
                <textarea
                  required
                  rows={3}
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold">
                  Save Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
