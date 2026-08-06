import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  Plane,
  Lock,
  Mail,
  Shield,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginPageProps {
  onOpenCredentials?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = () => {
  const { loginWithCredentials } = useRBAC();
  const [emailOrId, setEmailOrId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = loginWithCredentials(emailOrId, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid Email/User ID or Password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-sky-600/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Header / Brand */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-slate-900 via-sky-950/30 to-slate-900 border-b border-slate-800/80">
          <img
            src="/Logo_main.com (1).png"
            alt="Logo"
            className="h-14 sm:h-16 w-auto object-contain mx-auto mb-3"
          />
          
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Dedicated Dashboard Per Role</span>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                User ID or Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="Enter Email or User ID (e.g. usr_001)"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition-all transform active:scale-[0.99] cursor-pointer"
              >
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-3.5 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            4 Role-Isolated Dashboards
          </span>
          <span className="font-mono text-slate-400">Secure GDS Session</span>
        </div>
      </div>
    </div>
  );
};

