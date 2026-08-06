import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleId,
  ModuleId,
  PermissionAction,
  StaffMember,
  AuditLog,
  FlightBooking,
  SupportTicket,
  FinancialTransaction,
  B2BAgent,
  MarketingCampaign,
  CMSContent,
  ApiEndpointConfig,
  QaTestCase,
  ServerMetric,
  AffiliatePartner,
  Lead,
  CallLog,
  RoleDefinition
} from '../types/rbac';
import { ROLES_CONFIG } from '../data/rolesConfig';
import {
  INITIAL_STAFF_MEMBERS,
  INITIAL_BOOKINGS,
  INITIAL_TICKETS,
  INITIAL_TRANSACTIONS,
  INITIAL_B2B_AGENTS,
  INITIAL_CAMPAIGNS,
  INITIAL_CMS,
  INITIAL_API_CONFIGS,
  INITIAL_QA_TESTS,
  INITIAL_SERVERS,
  INITIAL_AFFILIATES,
  INITIAL_LEADS,
  INITIAL_CALL_LOGS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

interface RBACContextType {
  activeRoleId: RoleId;
  setActiveRoleId: (roleId: RoleId) => void;
  currentUser: StaffMember;
  rolesMap: Record<RoleId, RoleDefinition>;
  isAuthenticated: boolean;
  loginWithCredentials: (emailOrId: string, password: string) => { success: boolean; message?: string };
  logout: () => void;

  // Data Collections
  staffMembers: StaffMember[];
  bookings: FlightBooking[];
  tickets: SupportTicket[];
  transactions: FinancialTransaction[];
  agents: B2BAgent[];
  campaigns: MarketingCampaign[];
  cmsItems: CMSContent[];
  apiConfigs: ApiEndpointConfig[];
  qaTests: QaTestCase[];
  servers: ServerMetric[];
  affiliates: AffiliatePartner[];
  leads: Lead[];
  callLogs: CallLog[];
  auditLogs: AuditLog[];

  // RBAC Permission Helpers
  hasPermission: (module: ModuleId, action?: PermissionAction) => boolean;
  isModuleAllowed: (module: ModuleId) => boolean;

  // Actions
  addAuditLog: (action: string, module: ModuleId, details: string, status?: 'success' | 'warning' | 'failed') => void;
  addBooking: (booking: FlightBooking) => void;
  updateBooking: (pnr: string, updates: Partial<FlightBooking>) => void;
  addSupportTicket: (ticket: SupportTicket) => void;
  updateTicket: (ticketId: string, updates: Partial<SupportTicket>) => void;
  addTransaction: (tx: FinancialTransaction) => void;
  updateAgent: (agentId: string, updates: Partial<B2BAgent>) => void;
  addAgent: (agent: B2BAgent) => void;
  addCampaign: (campaign: MarketingCampaign) => void;
  addCMSContent: (cms: CMSContent) => void;
  updateCMSContent: (id: string, updates: Partial<CMSContent>) => void;
  addStaffMember: (staff: StaffMember) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  addLead: (lead: Lead) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  addCallLog: (callLog: CallLog) => void;
  updateCallLog: (callLogId: string, updates: Partial<CallLog>) => void;
  updateRolePermission: (roleId: RoleId, module: ModuleId, actions: PermissionAction[]) => void;
  toggleApiStatus: (apiId: string) => void;
  runQaTest: (testId: string) => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoleId, setActiveRoleIdState] = useState<RoleId>('super_admin');
  const [rolesMap, setRolesMap] = useState<Record<RoleId, RoleDefinition>>(ROLES_CONFIG);

  // Load persisted state or initial
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('aero_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
  });

  const [bookings, setBookings] = useState<FlightBooking[]>(() => {
    const saved = localStorage.getItem('aero_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('aero_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('aero_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [agents, setAgents] = useState<B2BAgent[]>(() => {
    const saved = localStorage.getItem('aero_agents');
    return saved ? JSON.parse(saved) : INITIAL_B2B_AGENTS;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem('aero_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [cmsItems, setCmsItems] = useState<CMSContent[]>(() => {
    const saved = localStorage.getItem('aero_cms');
    return saved ? JSON.parse(saved) : INITIAL_CMS;
  });

  const [apiConfigs, setApiConfigs] = useState<ApiEndpointConfig[]>(() => {
    const saved = localStorage.getItem('aero_apis');
    return saved ? JSON.parse(saved) : INITIAL_API_CONFIGS;
  });

  const [qaTests, setQaTests] = useState<QaTestCase[]>(() => {
    const saved = localStorage.getItem('aero_qa');
    return saved ? JSON.parse(saved) : INITIAL_QA_TESTS;
  });

  const [servers] = useState<ServerMetric[]>(INITIAL_SERVERS);
  const [affiliates] = useState<AffiliatePartner[]>(INITIAL_AFFILIATES);
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('aero_leads');
    const parsed: Lead[] = saved ? JSON.parse(saved) : INITIAL_LEADS;
    return parsed.map((lead) => ({
      ...lead,
      messages: Array.isArray(lead.messages) ? lead.messages : []
    }));
  });
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('aero_call_logs');
    return saved ? JSON.parse(saved) : INITIAL_CALL_LOGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('aero_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Login with Email, Staff ID, Role ID, or Name with Password
  const loginWithCredentials = (emailOrId: string, passwordInput: string) => {
    const rawInput = emailOrId.trim();
    const trimmedInput = rawInput.toLowerCase();
    const trimmedPass = passwordInput.trim().toLowerCase();

    // Find matching staff member by email, staff ID, role ID, or name
    const staff = staffMembers.find((s) => {
      const emailMatch = s.email.toLowerCase() === trimmedInput || s.email.toLowerCase().startsWith(trimmedInput);
      const idMatch = s.id.toLowerCase() === trimmedInput || s.id.toLowerCase().replace('usr_', '') === trimmedInput.replace('usr_', '');
      const roleMatch = s.roleId.toLowerCase() === trimmedInput || s.roleId.toLowerCase().replace(/_/g, ' ') === trimmedInput.replace(/_/g, ' ');
      const nameMatch = s.name.toLowerCase() === trimmedInput || s.name.toLowerCase().includes(trimmedInput);
      return emailMatch || idMatch || roleMatch || nameMatch;
    });

    if (staff) {
      // Validate password flexibly (exact, case-insensitive, master passwords, or role ID)
      const expectedPass = (staff.password || 'Admin@2026').toLowerCase();
      const isMasterPass = [
        'admin',
        'admin123',
        'pass2026',
        'admin2026',
        '123456',
        'password',
        'aero2026',
        staff.roleId.toLowerCase(),
        staff.id.toLowerCase()
      ].includes(trimmedPass);

      const isValidPass =
        trimmedPass === expectedPass ||
        isMasterPass ||
        trimmedPass.length >= 1; // Any non-empty password entry for matched user

      if (isValidPass) {
        setActiveRoleIdState(staff.roleId);
        setIsAuthenticated(true);
        
        // Update last login timestamp
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        setStaffMembers((prev) =>
          prev.map((m) => (m.id === staff.id ? { ...m, lastLogin: nowStr } : m))
        );

        addAuditLog(
          'User Authentication',
          'super_admin_panel',
          `Authenticated dashboard access for ${staff.name} (${ROLES_CONFIG[staff.roleId].title}) via User ID / Password.`
        );
        return { success: true };
      }
    }

    return {
      success: false,
      message: 'Invalid User ID/Email or Password. Click "IDs & Passwords" for valid credentials.'
    };
  };

  const logout = () => {
    addAuditLog(
      'User Logout',
      'super_admin_panel',
      `Staff member ${currentUser.name} logged out from ${ROLES_CONFIG[activeRoleId].title} dashboard.`
    );
    setIsAuthenticated(false);
  };

  // Current active user matches the selected active role
  const currentUser = staffMembers.find((s) => s.roleId === activeRoleId) || staffMembers[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aero_staff', JSON.stringify(staffMembers));
    localStorage.setItem('aero_bookings', JSON.stringify(bookings));
    localStorage.setItem('aero_tickets', JSON.stringify(tickets));
    localStorage.setItem('aero_txs', JSON.stringify(transactions));
    localStorage.setItem('aero_agents', JSON.stringify(agents));
    localStorage.setItem('aero_campaigns', JSON.stringify(campaigns));
    localStorage.setItem('aero_cms', JSON.stringify(cmsItems));
    localStorage.setItem('aero_apis', JSON.stringify(apiConfigs));
    localStorage.setItem('aero_qa', JSON.stringify(qaTests));
    localStorage.setItem('aero_leads', JSON.stringify(leads));
    localStorage.setItem('aero_call_logs', JSON.stringify(callLogs));
    localStorage.setItem('aero_audit', JSON.stringify(auditLogs));
  }, [staffMembers, bookings, tickets, transactions, agents, campaigns, cmsItems, apiConfigs, qaTests, leads, callLogs, auditLogs]);

  const setActiveRoleId = (newRole: RoleId) => {
    setActiveRoleIdState(newRole);
    if (newRole in ROLES_CONFIG) {
      addAuditLog('Switched Active Admin Role', 'super_admin_panel', `Switched active identity to ${ROLES_CONFIG[newRole].title}`);
    }
  };

  const isModuleAllowed = (module: ModuleId): boolean => {
    const roleDef = rolesMap[activeRoleId];
    if (!roleDef) return false;
    return roleDef.allowedModules.includes(module);
  };

  const hasPermission = (module: ModuleId, action: PermissionAction = 'read'): boolean => {
    const roleDef = rolesMap[activeRoleId];
    if (!roleDef) return false;
    if (!roleDef.allowedModules.includes(module)) return false;
    const modulePerms = roleDef.permissions[module] || [];
    return modulePerms.includes(action);
  };

  const addAuditLog = (action: string, module: ModuleId, details: string, status: 'success' | 'warning' | 'failed' = 'success') => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: currentUser.name,
      actorRole: activeRoleId,
      action,
      module,
      details,
      ipAddress: '10.0.1.24',
      status
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addBooking = (booking: FlightBooking) => {
    setBookings((prev) => [booking, ...prev]);
    addAuditLog('Created Flight Booking', 'booking_desk', `Created PNR ${booking.pnr} for ${booking.passengerName}`);
  };

  const updateBooking = (pnr: string, updates: Partial<FlightBooking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.pnr === pnr ? { ...b, ...updates } : b))
    );
    addAuditLog('Updated Booking Status', 'booking_desk', `Updated PNR ${pnr} - ${Object.keys(updates).join(', ')}`);
  };

  const addSupportTicket = (ticket: SupportTicket) => {
    setTickets((prev) => [ticket, ...prev]);
    addAuditLog('Opened Support Ticket', 'customer_support', `Ticket ${ticket.id} opened for PNR ${ticket.pnr}`);
  };

  const updateTicket = (ticketId: string, updates: Partial<SupportTicket>) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, ...updates } : t))
    );
    addAuditLog('Updated Support Ticket', 'customer_support', `Ticket ${ticketId} updated status`);
  };

  const addTransaction = (tx: FinancialTransaction) => {
    setTransactions((prev) => [tx, ...prev]);
    addAuditLog('Financial Transaction Processed', 'finance', `${tx.type} of $${tx.amount} logged for PNR ${tx.pnr}`);
  };

  const updateAgent = (agentId: string, updates: Partial<B2BAgent>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, ...updates } : a))
    );
    addAuditLog('Updated B2B Agent Record', 'agent_portal', `Agent ${agentId} status/wallet updated`);
  };

  const addAgent = (agent: B2BAgent) => {
    setAgents((prev) => [agent, ...prev]);
    addAuditLog('Onboarded New B2B Agent', 'agent_portal', `Agent ${agent.agencyName} registered`);
  };

  const addCampaign = (campaign: MarketingCampaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
    addAuditLog('Created Marketing Campaign', 'marketing', `Campaign ${campaign.title} (${campaign.code || 'Banner'}) created`);
  };

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
    addAuditLog('Added Sales Lead', 'sales', `Lead ${lead.id} created for ${lead.companyName}`);
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, ...updates } : lead)));
    addAuditLog('Updated Sales Lead', 'sales', `Lead ${leadId} updated`);
  };

  const addCallLog = (callLog: CallLog) => {
    setCallLogs((prev) => [callLog, ...prev]);
    addAuditLog('Logged Sales Call', 'sales', `Call log ${callLog.id} saved for ${callLog.leadName}`);
  };

  const updateCallLog = (callLogId: string, updates: Partial<CallLog>) => {
    setCallLogs((prev) => prev.map((log) => (log.id === callLogId ? { ...log, ...updates } : log)));
    addAuditLog('Updated Call Log', 'sales', `Call log ${callLogId} updated`);
  };

  const addCMSContent = (cms: CMSContent) => {
    setCmsItems((prev) => [cms, ...prev]);
    addAuditLog('Published CMS Content', 'content_cms', `Article/Page ${cms.title} published`);
  };

  const updateCMSContent = (id: string, updates: Partial<CMSContent>) => {
    setCmsItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addAuditLog('Updated CMS Article', 'content_cms', `Updated CMS content ${id}`);
  };

  const addStaffMember = (staff: StaffMember) => {
    setStaffMembers((prev) => [staff, ...prev]);
    addAuditLog('Provisioned Staff Account', 'hr_staff', `Created staff account for ${staff.name} (${ROLES_CONFIG[staff.roleId].title})`);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addAuditLog('Updated Staff Profile', 'hr_staff', `Updated staff record for ID ${id}`);
  };

  const updateRolePermission = (roleId: RoleId, module: ModuleId, actions: PermissionAction[]) => {
    setRolesMap((prev) => {
      const targetRole = prev[roleId];
      if (!targetRole) return prev;
      const updatedAllowed = actions.length > 0
        ? Array.from(new Set([...targetRole.allowedModules, module]))
        : targetRole.allowedModules.filter((m) => m !== module);

      return {
        ...prev,
        [roleId]: {
          ...targetRole,
          allowedModules: updatedAllowed,
          permissions: {
            ...targetRole.permissions,
            [module]: actions
          }
        }
      };
    });
    addAuditLog('Updated RBAC Permission Matrix', 'super_admin_panel', `Modified permissions for ${ROLES_CONFIG[roleId].title} on module ${module}`);
  };

  const toggleApiStatus = (apiId: string) => {
    setApiConfigs((prev) =>
      prev.map((api) => {
        if (api.id === apiId) {
          const nextStatus = api.status === 'Operational' ? 'Maintenance' : 'Operational';
          return { ...api, status: nextStatus };
        }
        return api;
      })
    );
    addAuditLog('Toggled API Health Status', 'api_config', `Toggled API status for ID ${apiId}`);
  };

  const runQaTest = (testId: string) => {
    setQaTests((prev) =>
      prev.map((t) =>
        t.id === testId
          ? {
              ...t,
              lastRunStatus: 'Passed',
              lastRunTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
            }
          : t
      )
    );
    addAuditLog('Executed Automated QA Suite', 'qa_testing', `Executed QA test run ${testId}`);
  };

  return (
    <RBACContext.Provider
      value={{
        activeRoleId,
        setActiveRoleId,
        currentUser,
        rolesMap,
        isAuthenticated,
        loginWithCredentials,
        logout,
        staffMembers,
        bookings,
        tickets,
        transactions,
        agents,
        campaigns,
        cmsItems,
        apiConfigs,
        qaTests,
        servers,
        affiliates,
        leads,
        callLogs,
        auditLogs,
        hasPermission,
        isModuleAllowed,
        addAuditLog,
        addBooking,
        updateBooking,
        addSupportTicket,
        updateTicket,
        addTransaction,
        updateAgent,
        addAgent,
        addCampaign,
        addCMSContent,
        updateCMSContent,
        addStaffMember,
        updateStaffMember,
        addLead,
        updateLead,
        addCallLog,
        updateCallLog,
        updateRolePermission,
        toggleApiStatus,
        runQaTest
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
