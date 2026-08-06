export type RoleId =
  | 'super_admin'
  | 'operations_manager'
  | 'booking_executive'
  | 'customer_support'
  | 'finance_manager'
  | 'agent_manager'
  | 'sales_manager'
  | 'marketing_manager'
  | 'content_manager'
  | 'api_manager'
  | 'qa_tester'
  | 'hr_manager'
  | 'system_admin'
  | 'analytics_manager'
  | 'affiliate_manager'
  | 'admin'
  | 'consultant'
  | 'finance'
  | 'operations';

export type ModuleId =
  | 'super_admin_panel'
  | 'operations'
  | 'booking_desk'
  | 'customer_support'
  | 'finance'
  | 'agent_portal'
  | 'sales'
  | 'lead_management'
  | 'lead_messages'
  | 'call_logs'
  | 'marketing'
  | 'content_cms'
  | 'api_config'
  | 'qa_testing'
  | 'hr_staff'
  | 'system_infrastructure'
  | 'analytics'
  | 'affiliate_partners'
  | 'audit_logs';

export type PermissionAction = 'read' | 'write' | 'create' | 'delete' | 'approve' | 'export' | 'configure';

export interface RoleDefinition {
  id: RoleId;
  title: string;
  category: string;
  accessLevel: string;
  badgeColor: string;
  description: string;
  responsibilities: string[];
  allowedModules: ModuleId[];
  permissions: Partial<Record<ModuleId, PermissionAction[]>>;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  roleId: RoleId;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  avatar: string;
  lastLogin: string;
  phone: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: RoleId;
  action: string;
  module: ModuleId;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failed';
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Trade Show' | 'Email Campaign' | 'Partner' | 'Inbound Call';
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  notes: string;
  messages: {
    sender: string;
    text: string;
    timestamp: string;
    isStaff: boolean;
  }[];
}

export interface CallLog {
  id: string;
  leadId: string;
  leadName: string;
  agentName: string;
  callTime: string;
  durationMinutes: number;
  outcome: 'Connected' | 'Voicemail' | 'No Answer' | 'Callback Scheduled' | 'Not Interested';
  summary: string;
  followUpDate?: string;
}

export interface FlightBooking {
  pnr: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
  seatNumber: string;
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled' | 'Ticketed' | 'On Hold';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  totalAmount: number;
  currency: string;
  bookingDate: string;
  apiProvider: string;
  agentId?: string;
  ticketNumber?: string;
}

export interface SupportTicket {
  id: string;
  pnr: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: 'Cancellation' | 'Refund' | 'Baggage' | 'Flight Change' | 'General Query';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdAt: string;
  messages: {
    sender: string;
    text: string;
    timestamp: string;
    isStaff: boolean;
  }[];
}

export interface FinancialTransaction {
  id: string;
  pnr: string;
  type: 'Payment' | 'Refund' | 'Commission' | 'Agent Topup' | 'Tax Settlement';
  amount: number;
  currency: string;
  gateway: 'Stripe' | 'PayPal' | 'Razorpay' | 'Bank Transfer';
  status: 'Verified' | 'Pending' | 'Processing' | 'Failed';
  timestamp: string;
  customerName: string;
  taxAmount: number;
  markupAmount: number;
}

export interface B2BAgent {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: 'Approved' | 'Pending Approval' | 'Suspended';
  walletBalance: number;
  creditLimit: number;
  commissionRate: number; // percentage
  totalBookings: number;
  joinedDate: string;
  city: string;
  country: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  type: 'Coupon' | 'Banner' | 'Email' | 'SEO';
  code?: string;
  discount: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Draft';
  validUntil: string;
  usageCount: number;
  targetAudience: string;
}

export interface CMSContent {
  id: string;
  title: string;
  type: 'Page' | 'FAQ' | 'Travel Guide' | 'Notice' | 'Policy';
  status: 'Published' | 'Draft' | 'In Review';
  lastUpdated: string;
  author: string;
  views: number;
  slug: string;
}

export interface ApiEndpointConfig {
  id: string;
  name: string; // e.g. Amadeus Flight Search
  provider: 'Amadeus' | 'Sabre' | 'Travelport' | 'Skyscanner' | 'FlightRadar24';
  environment: 'Sandbox' | 'Production';
  status: 'Operational' | 'Degraded' | 'Offline' | 'Maintenance';
  latencyMs: number;
  errorRatePercent: number;
  totalCalls24h: number;
  apiKeyMasked: string;
  endpointUrl: string;
}

export interface QaTestCase {
  id: string;
  title: string;
  moduleTested: string;
  lastRunStatus: 'Passed' | 'Failed' | 'Skipped' | 'Running';
  executionTimeMs: number;
  lastRunTime: string;
  assignedTester: string;
  bugReportCount: number;
}

export interface ServerMetric {
  instanceName: string;
  region: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeConnections: number;
  sslExpiryDays: number;
  dbLatencyMs: number;
  lastBackup: string;
  status: 'Healthy' | 'Warning' | 'Critical';
}

export interface AffiliatePartner {
  id: string;
  partnerName: string;
  partnerType: 'Influencer' | 'Corporate Travel' | 'Metasearch' | 'Blog';
  referralCode: string;
  clicksCount: number;
  conversionCount: number;
  totalEarned: number;
  payoutStatus: 'Paid' | 'Pending' | 'Under Review';
  agreementStatus: 'Active' | 'Pending Renewal';
}
