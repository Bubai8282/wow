import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { RoleId, RoleDefinition } from '../../types/rbac';
import {
  Key,
  X,
  Search,
  Copy,
  Check,
  Shield,
  LogIn,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
  Mail,
  Building
} from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose }) => {
  const { staffMembers, rolesMap, loginWithCredentials } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredStaff = staffMembers.filter((staff) => {
    const roleDef = rolesMap[staff.roleId];
    const query = searchTerm.toLowerCase();
    return (
      staff.name.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.id.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query) ||
      (roleDef && roleDef.title.toLowerCase().includes(query))
    );
  });

  const handleQuickLogin = (email: string, pass: string) => {
    loginWithCredentials(email, pass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Dashboard User Credentials & Passwords
                <span className="text-xs bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full border border-sky-500/30">
                  4 Roles
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Authorized credentials for accessing the four supported dashboard roles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search role, email, user ID, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>All 15 dashboards accessible via ID & Password</span>
            </div>
          </div>

          {/* Credentials Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-[55vh] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Dashboard Role</th>
                  <th className="px-4 py-3">User / Staff Member</th>
                  <th className="px-4 py-3">Login ID / Email</th>
                  <th className="px-4 py-3">Password</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {filteredStaff.map((staff) => {
                  const roleDef = rolesMap[staff.roleId];
                  const pass = staff.password || 'Admin@2026';
                  const isPassVisible = showPasswords[staff.id];

                  return (
                    <tr key={staff.id} className="hover:bg-slate-800/50 transition-colors">
                      {/* Role */}
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${roleDef?.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                            {roleDef?.title || staff.roleId}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-500" />
                          {staff.department}
                        </div>
                      </td>

                      {/* Staff Member */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-200">{staff.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {staff.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email / ID */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-sky-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800 max-w-xs">
                          <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                          <span className="truncate">{staff.email}</span>
                          <button
                            onClick={() => handleCopy(staff.email, `email_${staff.id}`)}
                            className="ml-auto text-slate-400 hover:text-white p-1"
                            title="Copy Email"
                          >
                            {copiedField === `email_${staff.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800 max-w-xs">
                          <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isPassVisible ? pass : '••••••••'}</span>
                          <div className="ml-auto flex items-center gap-1">
                            <button
                              onClick={() => toggleShowPassword(staff.id)}
                              className="text-slate-400 hover:text-white p-1"
                              title={isPassVisible ? 'Hide Password' : 'Show Password'}
                            >
                              {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => handleCopy(pass, `pass_${staff.id}`)}
                              className="text-slate-400 hover:text-white p-1"
                              title="Copy Password"
                            >
                              {copiedField === `pass_${staff.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Quick Login Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleQuickLogin(staff.email, pass)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md shadow-sky-600/20 transition-all"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Login</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Tip: You can login using either <span className="text-sky-300 font-mono">User Email</span> or <span className="text-sky-300 font-mono">Staff ID</span> with password.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Credentials Window
          </button>
        </div>

      </div>
    </div>
  );
};
