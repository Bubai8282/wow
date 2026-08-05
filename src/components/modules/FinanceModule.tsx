import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { FinancialTransaction } from '../../types/rbac';
import {
  Receipt,
  DollarSign,
  CheckCircle2,
  FileText,
  CreditCard,
  Building2,
  ArrowUpRight,
  Printer,
  X
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const { transactions, addTransaction, addAuditLog, hasPermission } = useRBAC();
  const [selectedInvoice, setSelectedInvoice] = useState<FinancialTransaction | null>(null);

  const canApproveRefund = hasPermission('finance', 'approve');

  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalTax = transactions.reduce((acc, t) => acc + t.taxAmount, 0);
  const totalMarkup = transactions.reduce((acc, t) => acc + t.markupAmount, 0);

  const handleApproveRefund = (txId: string) => {
    addAuditLog('Approved Refund Disbursement', 'finance', `Refund transaction ${txId} disbursed to customer bank`);
    alert(`Refund ${txId} approved and initiated via gateway payment processor.`);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Finance, Payments & Settlement Hub</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Finance Desk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Finance Manager Scope: Payment gateway verification, refund processing, tax management, commission settlements, and invoice generation.
            </p>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">Processed Revenue</div>
            <div className="font-extrabold text-amber-400 text-sm">${totalVolume.toLocaleString()}</div>
          </div>
          <div className="px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">Net Markup Revenue</div>
            <div className="font-extrabold text-emerald-400 text-sm">${totalMarkup.toLocaleString()}</div>
          </div>
          <div className="px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">Tax / VAT Collected</div>
            <div className="font-extrabold text-sky-400 text-sm">${totalTax.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            Financial Transaction & Gateway Ledger
          </h2>
          <span className="text-xs text-slate-400">{transactions.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">TXN ID & PNR</th>
                <th className="py-3 px-3">Passenger / Agency</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Gateway</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Tax & Markup</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-slate-200">{tx.id}</div>
                    <div className="text-[10px] text-amber-400">{tx.pnr}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">{tx.customerName}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.type === 'Payment' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{tx.gateway}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">${tx.amount} {tx.currency}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    Tax: ${tx.taxAmount} | Markup: ${tx.markupAmount}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(tx)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-medium"
                    >
                      Tax Invoice
                    </button>
                    {tx.type === 'Refund' && canApproveRefund && (
                      <button
                        onClick={() => handleApproveRefund(tx.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/30"
                      >
                        Authorize Disbursal
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TAX INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Official Tax Invoice & Receipt</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white text-slate-900 p-5 rounded-xl space-y-3 font-sans text-xs">
              <div className="flex justify-between border-b pb-2">
                <div className="font-bold text-sm">AeroAdmin Flight Services LLC</div>
                <div className="text-right font-mono text-[11px]">INVOICE #: INV-{selectedInvoice.id}</div>
              </div>
              <div className="space-y-1">
                <div>Billed To: <strong>{selectedInvoice.customerName}</strong></div>
                <div>PNR Reference: <strong className="font-mono">{selectedInvoice.pnr}</strong></div>
                <div>Payment Gateway: <strong>{selectedInvoice.gateway}</strong></div>
              </div>

              <div className="p-3 bg-slate-100 rounded border space-y-1 text-slate-800 font-mono">
                <div className="flex justify-between">
                  <span>Base Airfare:</span>
                  <span>${selectedInvoice.amount - selectedInvoice.taxAmount - selectedInvoice.markupAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Airline Tax & Airport GST:</span>
                  <span>${selectedInvoice.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee & Service Markup:</span>
                  <span>${selectedInvoice.markupAmount}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1 text-slate-900">
                  <span>Total Charges Paid:</span>
                  <span>${selectedInvoice.amount} {selectedInvoice.currency}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Official Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
