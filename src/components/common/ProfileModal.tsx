import React from 'react';
import { Lead, B2BAgent } from '../../types/rbac';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'agent' | 'lead' | 'client';
  lead?: Lead | null;
  agent?: B2BAgent | null;
  onMessage?: () => void;
  onAssign?: () => void;
  onDelete?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, type, lead, agent, onMessage, onAssign, onDelete }) => {
  if (!isOpen) return null;

  const title = type === 'agent' ? agent?.agencyName : lead?.companyName ?? 'Profile';
  const subtitle = type === 'agent' ? `Agent ID: ${agent?.id} | Owner: ${agent?.ownerName}` : `Lead ID: ${lead?.id} | Contact: ${lead?.contactName}`;

  const initials = (text?: string) => {
    if (!text) return 'AG';
    return text.split(' ').slice(0,2).map(s => s[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold text-white">
              {type === 'agent' ? initials(agent?.agencyName) : initials(lead?.companyName)}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{type === 'agent' ? 'Agent Profile' : 'Lead Profile'}</div>
              <h3 className="mt-1 text-2xl font-bold text-white">{title}</h3>
              <div className="text-sm text-slate-400 mt-1">{subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onMessage && (
              <button onClick={onMessage} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Message</button>
            )}
            {onAssign && (
              <button onClick={onAssign} className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200">Assign</button>
            )}
            <button onClick={onClose} className="ml-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200">✕</button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Contact Info</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-900 p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</div>
                  <div className="mt-2 text-base font-semibold text-white">{type === 'agent' ? agent?.email : lead?.email}</div>
                </div>
                <div className="rounded-xl bg-slate-900 p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Phone</div>
                  <div className="mt-2 text-base font-semibold text-white">{type === 'agent' ? agent?.phone : lead?.phone}</div>
                </div>
                <div className="rounded-xl bg-slate-900 p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Location</div>
                  <div className="mt-2 text-base font-semibold text-white">{type === 'agent' ? `${agent?.city}, ${agent?.country}` : lead?.notes || '—'}</div>
                </div>
                <div className="rounded-xl bg-slate-900 p-4">
                  <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</div>
                  <div className="mt-2 text-base font-semibold text-white">{type === 'agent' ? agent?.status : lead?.status}</div>
                </div>
              </div>
            </div>

            {type === 'agent' ? (
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Financial Snapshot</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-900 p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Wallet Balance</div>
                    <div className="mt-2 text-base font-semibold text-white">${agent?.walletBalance?.toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Credit Limit</div>
                    <div className="mt-2 text-base font-semibold text-white">${agent?.creditLimit?.toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Commission</div>
                    <div className="mt-2 text-base font-semibold text-white">{agent?.commissionRate}%</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-4">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Bookings</div>
                    <div className="mt-2 text-base font-semibold text-white">{agent?.totalBookings}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Lead Qualification</div>
                <div className="mt-4 rounded-xl bg-slate-900 p-4 text-slate-300">{lead?.notes || 'No qualification data available.'}</div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Notes & Activity</div>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-900 p-4 text-slate-300">
                <div className="text-sm text-slate-200 font-semibold">Assigned owner</div>
                <div className="mt-2 text-sm text-slate-400">{type === 'agent' ? agent?.ownerName : lead?.assignedTo}</div>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 text-slate-300">
                <div className="text-sm text-slate-200 font-semibold">Recent activity</div>
                <div className="mt-2 text-sm text-slate-400">{type === 'agent' ? 'Agent has been actively managing bookings and onboarding new clients.' : lead?.lastActivity}</div>
              </div>

              <div className="pt-2 flex w-full gap-2">
                {onDelete && (
                  <button onClick={onDelete} className="flex-1 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                )}
                <button onClick={onMessage} className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200">Open Messages</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
