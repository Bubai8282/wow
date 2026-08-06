import React, { useState, useEffect } from 'react';
import { RBACProvider, useRBAC } from './context/RBACContext';
import { ModuleId, RoleId } from './types/rbac';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PermissionDenied } from './components/common/PermissionDenied';
import { AuditLogModal } from './components/common/AuditLogModal';
import { CredentialsModal } from './components/common/CredentialsModal';
import { LoginPage } from './components/common/LoginPage';
import { DemoRoleDashboard } from './components/modules/DemoRoleDashboard';

// Module Component Imports
import { SuperAdminModule } from './components/modules/SuperAdminModule';
import { OperationsModule } from './components/modules/OperationsModule';
import { BookingDeskModule } from './components/modules/BookingDeskModule';
import { CustomerSupportModule } from './components/modules/CustomerSupportModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { AgentManagerModule } from './components/modules/AgentManagerModule';
import { SalesManagerModule } from './components/modules/SalesManagerModule';
import { MarketingManagerModule } from './components/modules/MarketingManagerModule';
import { ContentManagerModule } from './components/modules/ContentManagerModule';
import { ApiIntegrationModule } from './components/modules/ApiIntegrationModule';
import { QaModule } from './components/modules/QaModule';
import { HrManagerModule } from './components/modules/HrManagerModule';
import { SystemAdminModule } from './components/modules/SystemAdminModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { AffiliateModule } from './components/modules/AffiliateModule';

const MainLayout: React.FC = () => {
  const { isModuleAllowed, activeRoleId, rolesMap, isAuthenticated, setActiveRoleId } = useRBAC();
  const [activeModule, setActiveModule] = useState<ModuleId>('super_admin_panel');
  const [showAllModules, setShowAllModules] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState<boolean>(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeRoleDef = rolesMap[activeRoleId];

  // Auto-switch to the role's primary dedicated dashboard when active role changes
  useEffect(() => {
    if (activeRoleDef && activeRoleDef.allowedModules.length > 0) {
      setActiveModule(activeRoleDef.allowedModules[0]);
    }
  }, [activeRoleId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveRoleId('admin');
    }
  }, [isAuthenticated, setActiveRoleId]);

  const demoRole = activeRoleId === 'consultant' || activeRoleId === 'finance' || activeRoleId === 'operations' ? activeRoleId : 'admin';

  if (!isAuthenticated) {
    return (
      <>
        <DemoRoleDashboard role={demoRole} />
        <CredentialsModal
          isOpen={isCredentialsOpen}
          onClose={() => setIsCredentialsOpen(false)}
        />
      </>
    );
  }

  // Render active module or PermissionDenied view
  const renderActiveModuleContent = () => {
    const isAllowed = isModuleAllowed(activeModule);

    if (!isAllowed) {
      return <PermissionDenied moduleId={activeModule} />;
    }

    switch (activeModule) {
      case 'super_admin_panel':
        return <SuperAdminModule initialTab="permissions" />;
      case 'lead_management':
        return <SuperAdminModule initialTab="leads" />;
      case 'lead_messages':
        return <SuperAdminModule initialTab="messages" />;
      case 'call_logs':
        return <SuperAdminModule initialTab="calls" />;
      case 'operations':
        return <OperationsModule />;
      case 'booking_desk':
        return <BookingDeskModule />;
      case 'customer_support':
        return <CustomerSupportModule />;
      case 'finance':
        return <FinanceModule />;
      case 'agent_portal':
        return <AgentManagerModule />;
      case 'sales':
        return <SalesManagerModule />;
      case 'marketing':
        return <MarketingManagerModule />;
      case 'content_cms':
        return <ContentManagerModule />;
      case 'api_config':
        return <ApiIntegrationModule />;
      case 'qa_testing':
        return <QaModule />;
      case 'hr_staff':
        return <HrManagerModule />;
      case 'system_infrastructure':
        return <SystemAdminModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'affiliate_partners':
        return <AffiliateModule />;
      case 'audit_logs':
        return (
          <div className="p-6">
            <button
              onClick={() => setIsAuditLogsOpen(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-xs"
            >
              Open Audit Logs Viewer
            </button>
          </div>
        );
      default:
        return <SuperAdminModule initialTab="permissions" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      
      {/* Top Header */}
      <Header
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        onOpenCredentials={() => setIsCredentialsOpen(true)}
        onOpenLogin={() => {}}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Dynamic Sidebar */}
        <Sidebar
          activeModule={activeModule}
          setActiveModule={(module) => {
            setActiveModule(module);
            setIsSidebarOpen(false);
          }}
          showAllModules={showAllModules}
          setShowAllModules={setShowAllModules}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {renderActiveModuleContent()}
        </main>

      </div>

      {/* Global System Audit Log Inspector Modal */}
      <AuditLogModal
        isOpen={isAuditLogsOpen}
        onClose={() => setIsAuditLogsOpen(false)}
      />

      {/* Passwords & User Credentials Cheat Sheet Modal */}
      <CredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <RBACProvider>
      <MainLayout />
    </RBACProvider>
  );
}
