import {
  StaffMember,
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
  AuditLog,
  Lead,
  CallLog
} from '../types/rbac';

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'usr_001',
    name: 'Elena Rostova',
    email: 'elena.rostova@aeroadmin.com',
    password: 'Admin@2026',
    roleId: 'super_admin',
    department: 'Executive Leadership',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-05 03:15 AM',
    phone: '+1 (555) 019-2831'
  },
  {
    id: 'usr_002',
    name: 'Marcus Vance',
    email: 'marcus.vance@aeroadmin.com',
    password: 'Ops@2026',
    roleId: 'operations',
    department: 'Flight Operations',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-05 02:40 AM',
    phone: '+1 (555) 014-9920'
  },
  {
    id: 'usr_003',
    name: 'Priya Sharma',
    email: 'priya.sharma@aeroadmin.com',
    password: 'Finance@2026',
    roleId: 'finance',
    department: 'Finance & Accounts',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-04 11:45 PM',
    phone: '+1 (555) 016-5520'
  },
  {
    id: 'usr_004',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@aeroadmin.com',
    password: 'Agent@2026',
    roleId: 'agent',
    department: 'B2B Commercial',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    lastLogin: '2026-08-04 09:30 PM',
    phone: '+1 (555) 013-8821'
  }
];

export const INITIAL_BOOKINGS: FlightBooking[] = [
  {
    pnr: 'PNR-EK8920',
    passengerName: 'Jonathan Sterling',
    passengerEmail: 'j.sterling@company.com',
    passengerPhone: '+1-555-8291',
    flightNumber: 'EK 202',
    airline: 'Emirates',
    origin: 'JFK (New York)',
    destination: 'DXB (Dubai)',
    departureTime: '2026-08-10 22:30',
    arrivalTime: '2026-08-11 19:15',
    cabinClass: 'Business',
    seatNumber: '04A',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    totalAmount: 3450.00,
    currency: 'USD',
    bookingDate: '2026-08-04 14:20',
    apiProvider: 'Amadeus',
    ticketNumber: '176-2918204918'
  },
  {
    pnr: 'PNR-SQ4012',
    passengerName: 'Amara Okafor',
    passengerEmail: 'amara.okafor@techglobal.org',
    passengerPhone: '+44-7700-90012',
    flightNumber: 'SQ 025',
    airline: 'Singapore Airlines',
    origin: 'FRA (Frankfurt)',
    destination: 'SIN (Singapore)',
    departureTime: '2026-08-12 11:45',
    arrivalTime: '2026-08-13 06:20',
    cabinClass: 'First Class',
    seatNumber: '01F',
    bookingStatus: 'Ticketed',
    paymentStatus: 'Paid',
    totalAmount: 6800.00,
    currency: 'USD',
    bookingDate: '2026-08-04 09:15',
    apiProvider: 'Sabre',
    ticketNumber: '618-9021830192'
  },
  {
    pnr: 'PNR-QR9102',
    passengerName: 'Liam O\'Brien',
    passengerEmail: 'liam.ob@investments.ie',
    passengerPhone: '+353-87-1234567',
    flightNumber: 'QR 008',
    airline: 'Qatar Airways',
    origin: 'LHR (London Heathrow)',
    destination: 'DOH (Doha)',
    departureTime: '2026-08-15 08:00',
    arrivalTime: '2026-08-15 16:45',
    cabinClass: 'Economy',
    seatNumber: '24C',
    bookingStatus: 'Pending',
    paymentStatus: 'Pending',
    totalAmount: 720.00,
    currency: 'USD',
    bookingDate: '2026-08-05 01:10',
    apiProvider: 'Travelport',
    agentId: 'B2B-AGENT-102'
  },
  {
    pnr: 'PNR-LH3021',
    passengerName: 'Clara Schumann',
    passengerEmail: 'clara.s@arts.de',
    passengerPhone: '+49-171-555019',
    flightNumber: 'LH 400',
    airline: 'Lufthansa',
    origin: 'MUC (Munich)',
    destination: 'JFK (New York)',
    departureTime: '2026-08-18 15:50',
    arrivalTime: '2026-08-18 18:40',
    cabinClass: 'Premium Economy',
    seatNumber: '14H',
    bookingStatus: 'Confirmed',
    paymentStatus: 'Paid',
    totalAmount: 1420.00,
    currency: 'USD',
    bookingDate: '2026-08-03 18:30',
    apiProvider: 'Amadeus',
    ticketNumber: '220-4910293810'
  },
  {
    pnr: 'PNR-DL8810',
    passengerName: 'Marcus Brodie',
    passengerEmail: 'marcus.brodie@museum.org',
    passengerPhone: '+1-555-0912',
    flightNumber: 'DL 106',
    airline: 'Delta Air Lines',
    origin: 'ATL (Atlanta)',
    destination: 'CDG (Paris)',
    departureTime: '2026-08-20 17:15',
    arrivalTime: '2026-08-21 07:35',
    cabinClass: 'Business',
    seatNumber: '06B',
    bookingStatus: 'On Hold',
    paymentStatus: 'Pending',
    totalAmount: 2890.00,
    currency: 'USD',
    bookingDate: '2026-08-05 02:45',
    apiProvider: 'Sabre',
    agentId: 'B2B-AGENT-105'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-8021',
    pnr: 'PNR-EK8920',
    customerName: 'Jonathan Sterling',
    customerEmail: 'j.sterling@company.com',
    subject: 'Request for special dietary meal preference (Kosher/Gluten-Free)',
    category: 'General Query',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'David Miller',
    createdAt: '2026-08-04 16:30',
    messages: [
      {
        sender: 'Jonathan Sterling',
        text: 'Hi, I booked flight EK 202 on Business Class. Could you please confirm if my special dietary meal has been logged in the system?',
        timestamp: '2026-08-04 16:30',
        isStaff: false
      },
      {
        sender: 'David Miller',
        text: 'Hello Mr. Sterling, I am checking with Emirates GDS SSR records right now and will confirm shortly.',
        timestamp: '2026-08-04 17:05',
        isStaff: true
      }
    ]
  },
  {
    id: 'TKT-8022',
    pnr: 'PNR-QR9102',
    customerName: 'Liam O\'Brien',
    customerEmail: 'liam.ob@investments.ie',
    subject: 'Refund status inquiry for cancelled baggage protection plan',
    category: 'Refund',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-08-05 00:15',
    messages: [
      {
        sender: 'Liam O\'Brien',
        text: 'I submitted a cancellation request for the add-on baggage coverage. When can I expect the $45 refund to reflect in my bank account?',
        timestamp: '2026-08-05 00:15',
        isStaff: false
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TXN-90812',
    pnr: 'PNR-EK8920',
    type: 'Payment',
    amount: 3450.00,
    currency: 'USD',
    gateway: 'Stripe',
    status: 'Verified',
    timestamp: '2026-08-04 14:22',
    customerName: 'Jonathan Sterling',
    taxAmount: 245.00,
    markupAmount: 180.00
  },
  {
    id: 'TXN-90813',
    pnr: 'PNR-SQ4012',
    type: 'Payment',
    amount: 6800.00,
    currency: 'USD',
    gateway: 'PayPal',
    status: 'Verified',
    timestamp: '2026-08-04 09:18',
    customerName: 'Amara Okafor',
    taxAmount: 510.00,
    markupAmount: 420.00
  },
  {
    id: 'TXN-90814',
    pnr: 'PNR-LH3021',
    type: 'Payment',
    amount: 1420.00,
    currency: 'USD',
    gateway: 'Razorpay',
    status: 'Verified',
    timestamp: '2026-08-03 18:35',
    customerName: 'Clara Schumann',
    taxAmount: 110.00,
    markupAmount: 95.00
  },
  {
    id: 'TXN-90815',
    pnr: 'PNR-REF-109',
    type: 'Refund',
    amount: 450.00,
    currency: 'USD',
    gateway: 'Stripe',
    status: 'Processing',
    timestamp: '2026-08-05 02:10',
    customerName: 'Robert Langdon',
    taxAmount: 32.00,
    markupAmount: 0
  }
];

export const INITIAL_B2B_AGENTS: B2BAgent[] = [
  {
    id: 'B2B-AGENT-101',
    agencyName: 'Atlas Global Travels LLC',
    ownerName: 'Tariq Al-Mansoor',
    email: 'tariq@atlasglobaltravel.com',
    phone: '+971-4-889-1029',
    status: 'Approved',
    walletBalance: 42800.00,
    creditLimit: 100000.00,
    commissionRate: 5.5,
    totalBookings: 342,
    joinedDate: '2025-01-15',
    city: 'Dubai',
    country: 'UAE'
  },
  {
    id: 'B2B-AGENT-102',
    agencyName: 'Horizon Express Travel Management',
    ownerName: 'Samantha Cole',
    email: 'scole@horizontravels.co.uk',
    phone: '+44-20-7946-0912',
    status: 'Approved',
    walletBalance: 12450.00,
    creditLimit: 50000.00,
    commissionRate: 4.8,
    totalBookings: 189,
    joinedDate: '2025-04-10',
    city: 'London',
    country: 'UK'
  },
  {
    id: 'B2B-AGENT-103',
    agencyName: 'Pacific Rim Journeys Inc',
    ownerName: 'Hiroshi Tanaka',
    email: 'tanaka@pacificrimjourneys.jp',
    phone: '+81-3-5555-0143',
    status: 'Pending Approval',
    walletBalance: 0,
    creditLimit: 25000.00,
    commissionRate: 4.0,
    totalBookings: 0,
    joinedDate: '2026-08-04',
    city: 'Tokyo',
    country: 'Japan'
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'CMP-001',
    title: 'Summer Sky Deals 2026',
    type: 'Coupon',
    code: 'FLY2026',
    discount: '15% Off International Flights',
    status: 'Active',
    validUntil: '2026-08-31',
    usageCount: 1482,
    targetAudience: 'All Registered Passengers'
  },
  {
    id: 'CMP-002',
    title: 'Business Class Upgrade Promotion',
    type: 'Banner',
    discount: 'Flat $200 Cashback on Business Class',
    status: 'Active',
    validUntil: '2026-09-15',
    usageCount: 391,
    targetAudience: 'Corporate & Premium Travelers'
  }
];

export const INITIAL_CMS: CMSContent[] = [
  {
    id: 'CMS-101',
    title: 'International Flight Baggage Allowance & Restricted Items 2026',
    type: 'Travel Guide',
    status: 'Published',
    lastUpdated: '2026-08-01',
    author: 'Sophia Dupont',
    views: 18420,
    slug: 'baggage-allowance-guide'
  },
  {
    id: 'CMS-102',
    title: 'Passenger Rights & Ticket Refund Policy',
    type: 'Policy',
    status: 'Published',
    lastUpdated: '2026-07-20',
    author: 'Sophia Dupont',
    views: 9310,
    slug: 'refund-policy'
  },
  {
    id: 'CMS-103',
    title: 'Frequently Asked Questions regarding PNR Reissuance',
    type: 'FAQ',
    status: 'Published',
    lastUpdated: '2026-08-03',
    author: 'Sophia Dupont',
    views: 12500,
    slug: 'pnr-faq'
  }
];

export const INITIAL_API_CONFIGS: ApiEndpointConfig[] = [
  {
    id: 'API-001',
    name: 'Amadeus Flight Availability & Fare Search (v2)',
    provider: 'Amadeus',
    environment: 'Production',
    status: 'Operational',
    latencyMs: 142,
    errorRatePercent: 0.08,
    totalCalls24h: 184920,
    apiKeyMasked: 'am_live_99a8****************31b',
    endpointUrl: 'https://api.amadeus.com/v2/shopping/flight-offers'
  },
  {
    id: 'API-002',
    name: 'Sabre GDS Command & PNR Ticketing Engine',
    provider: 'Sabre',
    environment: 'Production',
    status: 'Operational',
    latencyMs: 185,
    errorRatePercent: 0.12,
    totalCalls24h: 129400,
    apiKeyMasked: 'sb_prod_11f4****************82a',
    endpointUrl: 'https://api.sabre.com/v1/historical/pnr'
  },
  {
    id: 'API-003',
    name: 'Travelport Universal API (uAPI)',
    provider: 'Travelport',
    environment: 'Production',
    status: 'Operational',
    latencyMs: 198,
    errorRatePercent: 0.25,
    totalCalls24h: 92410,
    apiKeyMasked: 'tp_live_7721****************90e',
    endpointUrl: 'https://americas.universal-api.travelport.com/AirService'
  },
  {
    id: 'API-004',
    name: 'FlightRadar24 Real-Time Aircraft Telemetry',
    provider: 'FlightRadar24',
    environment: 'Production',
    status: 'Degraded',
    latencyMs: 410,
    errorRatePercent: 1.85,
    totalCalls24h: 48920,
    apiKeyMasked: 'fr_live_0019****************44f',
    endpointUrl: 'https://api.flightradar24.com/common/v1/flight/list'
  }
];

export const INITIAL_QA_TESTS: QaTestCase[] = [
  {
    id: 'QA-001',
    title: 'End-to-End PNR Creation & Credit Card Settlement Flow',
    moduleTested: 'Booking & Payment Gateway',
    lastRunStatus: 'Passed',
    executionTimeMs: 1240,
    lastRunTime: '2026-08-05 02:30 AM',
    assignedTester: 'Rachel Adams',
    bugReportCount: 0
  },
  {
    id: 'QA-002',
    title: 'E-Ticket PDF Barcode Rendering & IATA Standard Checks',
    moduleTested: 'Ticketing Engine',
    lastRunStatus: 'Passed',
    executionTimeMs: 480,
    lastRunTime: '2026-08-05 02:15 AM',
    assignedTester: 'Rachel Adams',
    bugReportCount: 0
  },
  {
    id: 'QA-003',
    title: 'GDS Webhook Failover under high latency API simulation',
    moduleTested: 'GDS API Manager',
    lastRunStatus: 'Passed',
    executionTimeMs: 2100,
    lastRunTime: '2026-08-04 11:00 PM',
    assignedTester: 'Rachel Adams',
    bugReportCount: 1
  }
];

export const INITIAL_SERVERS: ServerMetric[] = [
  {
    instanceName: 'aero-prod-us-east1-app-01',
    region: 'us-east1 (Cloud Run)',
    cpuUsagePercent: 28,
    memoryUsagePercent: 41,
    activeConnections: 1420,
    sslExpiryDays: 184,
    dbLatencyMs: 12,
    lastBackup: '2026-08-05 00:00 AM (Automated Snapshot)',
    status: 'Healthy'
  },
  {
    instanceName: 'aero-prod-eu-west1-app-02',
    region: 'eu-west1 (Cloud Run)',
    cpuUsagePercent: 34,
    memoryUsagePercent: 49,
    activeConnections: 1890,
    sslExpiryDays: 184,
    dbLatencyMs: 14,
    lastBackup: '2026-08-05 00:00 AM (Automated Snapshot)',
    status: 'Healthy'
  }
];

export const INITIAL_AFFILIATES: AffiliatePartner[] = [
  {
    id: 'AFF-001',
    partnerName: 'Kayak Flight Metasearch Network',
    partnerType: 'Metasearch',
    referralCode: 'KAYAK-AERO26',
    clicksCount: 89400,
    conversionCount: 3120,
    totalEarned: 15600.00,
    payoutStatus: 'Paid',
    agreementStatus: 'Active'
  },
  {
    id: 'AFF-002',
    partnerName: 'Nomad World Travel Blog',
    partnerType: 'Blog',
    referralCode: 'NOMAD2026',
    clicksCount: 12400,
    conversionCount: 420,
    totalEarned: 2100.00,
    payoutStatus: 'Pending',
    agreementStatus: 'Active'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LD-1001',
    companyName: 'Global Horizon Travels',
    contactName: 'Maya Patel',
    email: 'maya.patel@globalhorizon.com',
    phone: '+1 555-672-8901',
    source: 'Referral',
    status: 'Contacted',
    assignedTo: 'Elena Rostova',
    createdAt: '2026-08-02 10:34',
    lastActivity: '2026-08-04 11:05',
    notes: 'Interested in corporate ticketing packages for executive teams.',
    messages: [
      {
        sender: 'Maya Patel',
        text: 'We need quarterly executive travel reporting for 55 seats by end of month.',
        timestamp: '2026-08-02 10:35',
        isStaff: false
      },
      {
        sender: 'Elena Rostova',
        text: 'I have assigned your request to our corporate account team for follow-up.',
        timestamp: '2026-08-02 13:10',
        isStaff: true
      }
    ]
  },
  {
    id: 'LD-1002',
    companyName: 'Oceanic Ventures',
    contactName: 'Rajesh Kumar',
    email: 'rajesh.kumar@oceanicventures.com',
    phone: '+44 7700 123456',
    source: 'Email Campaign',
    status: 'Qualified',
    assignedTo: 'Marcus Vance',
    createdAt: '2026-08-03 15:20',
    lastActivity: '2026-08-04 09:48',
    notes: 'Needs a custom weekly reporting package for travel spend.',
    messages: [
      {
        sender: 'Oceanic Ventures Team',
        text: 'Can your system support real-time budget alerts for aviation expenses?',
        timestamp: '2026-08-03 15:22',
        isStaff: false
      },
      {
        sender: 'Marcus Vance',
        text: 'Yes — we will include a custom alert feed and monthly reconciliation package.',
        timestamp: '2026-08-03 16:05',
        isStaff: true
      }
    ]
  },
  {
    id: 'LD-1003',
    companyName: 'Skyline Logistics',
    contactName: 'Hannah Lee',
    email: 'hannah.lee@skylinelogistics.com',
    phone: '+61 412 888 123',
    source: 'Inbound Call',
    status: 'Proposal Sent',
    assignedTo: 'Carlos Mendez',
    createdAt: '2026-08-04 08:10',
    lastActivity: '2026-08-04 18:22',
    notes: 'Requested priority handling for cargo crew and charter flights.',
    messages: [
      {
        sender: 'Hannah Lee',
        text: 'Please confirm charter crew availability for the week of Aug 17.',
        timestamp: '2026-08-04 08:12',
        isStaff: false
      },
      {
        sender: 'Carlos Mendez',
        text: 'We are confirming availability now and will send a detailed charter quote.',
        timestamp: '2026-08-04 18:25',
        isStaff: true
      }
    ]
  }
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'CL-3021',
    leadId: 'LD-1002',
    leadName: 'Oceanic Ventures',
    agentName: 'Marcus Vance',
    callTime: '2026-08-04 09:20',
    durationMinutes: 18,
    outcome: 'Connected',
    summary: 'Discussed reporting requirements and special fare rates for team travel.',
    followUpDate: '2026-08-07'
  },
  {
    id: 'CL-3022',
    leadId: 'LD-1001',
    leadName: 'Global Horizon Travels',
    agentName: 'Elena Rostova',
    callTime: '2026-08-04 11:02',
    durationMinutes: 24,
    outcome: 'Callback Scheduled',
    summary: 'Scheduled executive package review, follow-up on Monday morning.',
    followUpDate: '2026-08-05'
  },
  {
    id: 'CL-3023',
    leadId: 'LD-1003',
    leadName: 'Skyline Logistics',
    agentName: 'Carlos Mendez',
    callTime: '2026-08-04 18:05',
    durationMinutes: 12,
    outcome: 'Voicemail',
    summary: 'Left voicemail requesting confirmation of charter crew dates.',
    followUpDate: '2026-08-06'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-10091',
    timestamp: '2026-08-05 03:12:10',
    actorName: 'Elena Rostova',
    actorRole: 'super_admin',
    action: 'Modified GDS Commission Rules',
    module: 'super_admin_panel',
    details: 'Increased default airline markup ceiling from 4.5% to 5.0%',
    ipAddress: '192.168.1.104',
    status: 'success'
  },
  {
    id: 'LOG-10090',
    timestamp: '2026-08-05 02:40:02',
    actorName: 'Marcus Vance',
    actorRole: 'operations',
    action: 'Flight Schedule Alert Acknowledged',
    module: 'operations',
    details: 'Acknowledged 45-min delay alert for Emirates EK 202',
    ipAddress: '10.0.4.22',
    status: 'success'
  },
  {
    id: 'LOG-10089',
    timestamp: '2026-08-05 02:00:15',
    actorName: 'Carlos Mendez',
    actorRole: 'agent',
    action: 'Agent Portal Approval',
    module: 'agent_portal',
    details: 'Approved new B2B agency access and updated wallet credit limit',
    ipAddress: '10.0.12.8',
    status: 'success'
  }
];
