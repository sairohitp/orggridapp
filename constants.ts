



import { Connect, Stakeholder, Organization, Status, SuccessStory, Activity, Lead, IntentLevel, NeedType, NonRevenueTag } from './types';

// --- Master Lists of Unique Entities ---

export const INITIAL_STATUSES: Status[] = [
  { id: 'status_1', name: 'In Talks', color: 'blue' },
  { id: 'status_2', name: 'NDA', color: 'purple' },
  { id: 'status_3', name: 'PoC', color: 'green' },
  { id: 'status_4', name: 'No Revert', color: 'yellow' },
  { id: 'status_5', name: 'No Synergy', color: 'red' },
];

export const INITIAL_INTENT_LEVELS: IntentLevel[] = [
  { id: 'intent_1', name: 'High', color: 'red' },
  { id: 'intent_2', name: 'Medium', color: 'yellow' },
  { id: 'intent_3', name: 'Low', color: 'green' },
];

export const INITIAL_NEED_TYPES: NeedType[] = [
  { id: 'need_1', name: 'Efficiency Improvement' },
  { id: 'need_2', name: 'Market Expansion' },
  { id: 'need_3', name: 'General Inquiry' },
  { id: 'need_4', name: 'Funding' },
  { id: 'need_5', name: 'Partnership' },
  { id: 'need_6', name: 'Talent' },
];

export const INITIAL_NON_REVENUE_TAGS: NonRevenueTag[] = [
  { id: 'nrt_1', name: 'Strategic Fit', color: 'blue' },
  { id: 'nrt_2', name: 'Brand Awareness', color: 'purple' },
  { id: 'nrt_3', name: 'Market Expansion', color: 'green' },
  { id: 'nrt_4', name: 'Talent Acquisition', color: 'yellow' },
  { id: 'nrt_5', name: 'Etc.', color: 'pink' },
  { id: 'nrt_6', name: 'Personal', color: 'rose' },
  { id: 'nrt_7', 'name': 'Fun', 'color': 'amber' },
  { id: 'nrt_8', 'name': 'Event', 'color': 'sky' }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  { id: 'org_1', name: 'InnovateAI', type: 'startup', ownerId: 'stake_1', contactIds: ['stake_3'] },
  { id: 'org_2', name: 'Global Tech Inc.', type: 'corporate', ownerId: 'stake_2', contactIds: ['stake_7', 'stake_8'] },
  { id: 'org_3', name: 'QuantumLeap', type: 'startup', ownerId: 'stake_1', contactIds: ['stake_4'] },
  { id: 'org_4', name: 'Future Solutions', type: 'corporate', ownerId: 'stake_1', contactIds: ['stake_9'] },
  { id: 'org_5', name: 'HealthHub', type: 'startup', ownerId: 'stake_2', contactIds: ['stake_5', 'stake_6'] },
  { id: 'org_6', name: 'VentureWell', type: 'corporate', ownerId: 'stake_2', contactIds: ['stake_10'] },
];

export const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  // Owners / Internal
  { id: 'stake_1', name: 'Alice Admin', role: 'Ledger Manager', email: 'alice@orggrid.com', phone: '555-0101', affiliation: 'internal' },
  { id: 'stake_2', name: 'Bob Builder', role: 'Coordinator', email: 'bob@orggrid.com', phone: '555-0102', affiliation: 'internal' },
  // Startup Contacts
  { id: 'stake_3', name: 'Dr. Evelyn Reed', role: 'CEO & Founder', email: 'e.reed@innovate.ai', phone: '123-456-7890', affiliation: 'startup' },
  { id: 'stake_4', name: 'Chen Xiang', role: 'CTO', email: 'c.xiang@quantum.ai', phone: '234-567-8901', affiliation: 'startup' },
  { id: 'stake_5', name: 'Maria Garcia', role: 'Lead Developer', email: 'm.garcia@healthhub.io', phone: '345-678-9012', affiliation: 'startup' },
  { id: 'stake_6', name: 'Sam Jones', role: 'Product Manager', email: 's.jones@healthhub.io', phone: '345-678-9013', affiliation: 'startup' },
  // Corporate Contacts
  { id: 'stake_7', name: 'David Chen', role: 'Innovation Lead', email: 'd.chen@globaltech.com', phone: '456-789-0123', affiliation: 'corporate' },
  { id: 'stake_8', name: 'Olivia Martinez', role: 'Partnerships', email: 'o.martinez@globaltech.com', phone: '567-890-1234', affiliation: 'corporate' },
  { id: 'stake_9', name: 'Frank Wright', role: 'Senior VP', email: 'f.wright@futuresols.com', phone: '678-901-2345', affiliation: 'corporate' },
  { id: 'stake_10', name: 'Grace Lee', role: 'VC Associate', email: 'g.lee@venturewell.com', phone: '789-012-3456', affiliation: 'corporate' },
];

export const INITIAL_CONNECTS: Connect[] = [
    {
        id: 'conn_1',
        title: 'AI-driven Diagnostics PoC',
        startupId: 'org_1',
        corporateId: 'org_2',
        ownerId: 'stake_1',
        statusId: 'status_3',
        date: '2023-10-20T10:00:00Z',
        startupContactIds: ['stake_3'],
        corporateContactIds: ['stake_7', 'stake_8'],
        deletedAt: null,
        createdAt: '2023-10-20T10:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
    },
    {
        id: 'conn_2',
        title: 'Quantum Computing for Logistics',
        startupId: 'org_3',
        corporateId: 'org_4',
        ownerId: 'stake_1',
        statusId: 'status_1',
        date: '2023-11-15T14:30:00Z',
        startupContactIds: ['stake_4'],
        corporateContactIds: ['stake_9'],
        deletedAt: null,
        createdAt: '2023-11-15T14:30:00Z',
        updatedAt: '2023-11-15T14:30:00Z',
    },
    {
        id: 'conn_3',
        title: 'Digital Health Platform Integration',
        startupId: 'org_5',
        corporateId: 'org_6',
        ownerId: 'stake_2',
        statusId: 'status_2',
        date: '2023-08-01T09:00:00Z',
        startupContactIds: ['stake_5', 'stake_6'],
        corporateContactIds: ['stake_10'],
        deletedAt: null,
        createdAt: '2023-08-01T09:00:00Z',
        updatedAt: '2023-09-05T09:00:00Z',
    },
    {
        id: 'conn_4',
        title: 'Initial discussion on HealthHub x Global Tech',
        startupId: 'org_5',
        corporateId: 'org_2',
        ownerId: 'stake_2',
        statusId: 'status_4',
        date: '2024-01-20T11:00:00Z',
        startupContactIds: ['stake_5'],
        corporateContactIds: ['stake_7'],
        deletedAt: null,
        createdAt: '2024-01-20T11:00:00Z',
        updatedAt: '2024-01-20T11:00:00Z',
    },
    {
        id: 'conn_5',
        title: 'Synergy meeting - InnovateAI and Future Solutions',
        startupId: 'org_1',
        corporateId: 'org_4',
        ownerId: 'stake_1',
        statusId: 'status_5',
        date: '2024-02-10T16:00:00Z',
        startupContactIds: ['stake_3'],
        corporateContactIds: ['stake_9'],
        deletedAt: null,
        createdAt: '2024-02-10T16:00:00Z',
        updatedAt: '2024-02-10T16:00:00Z',
    },
    {
        id: 'conn_6',
        title: 'Old connect for QuantumLeap',
        startupId: 'org_3',
        corporateId: 'org_6',
        ownerId: 'stake_1',
        statusId: 'status_1',
        date: '2023-05-18T10:00:00Z',
        startupContactIds: ['stake_4'],
        corporateContactIds: ['stake_10'],
        deletedAt: new Date().toISOString(),
        createdAt: '2023-05-18T10:00:00Z',
        updatedAt: '2023-05-18T10:00:00Z',
    }
];

export const INITIAL_LEADS: Lead[] = [
    {
        id: 'lead_1',
        name: 'AI for Supply Chain Optimization',
        organizationType: 'corporate',
        source: 'Conference',
        intentLevelId: 'intent_1',
        needTypeId: 'need_1',
        revenuePotential: 5000000,
        nonRevenueTagIds: ['nrt_3'],
        ownerId: 'stake_1',
        comments: 'Met at the "Future of Logistics" conference. They are actively looking for a solution and have a budget allocated.',
        createdAt: '2024-05-10T10:00:00Z',
        updatedAt: '2024-05-12T11:00:00Z',
    },
    {
        id: 'lead_2',
        name: 'Telemedicine App Partnership',
        organizationType: 'startup',
        source: 'Referral',
        intentLevelId: 'intent_2',
        needTypeId: 'need_2',
        revenuePotential: 1500000,
        nonRevenueTagIds: ['nrt_1', 'nrt_3'],
        ownerId: 'stake_2',
        comments: 'Referred by Dr. Evelyn Reed. They have a solid product but need help with distribution.',
        createdAt: '2024-04-22T14:00:00Z',
        updatedAt: '2024-04-25T09:30:00Z',
    },
    {
        id: 'lead_3',
        name: 'In-house inquiry from sales team',
        organizationType: 'corporate',
        source: 'Website',
        intentLevelId: 'intent_3',
        needTypeId: 'need_3',
        revenuePotential: 500000,
        nonRevenueTagIds: ['nrt_2', 'nrt_5'],
        ownerId: 'stake_1',
        comments: 'Filled out the contact form on our website. Need to qualify them further to understand their exact needs.',
        createdAt: '2024-05-18T16:45:00Z',
        updatedAt: '2024-05-18T16:45:00Z',
    }
];

export const INITIAL_ACTIVITIES: Activity[] = [
    {
        id: 'act_1',
        connectId: 'conn_1',
        type: 'Meeting',
        date: '2023-10-26T10:00:00Z',
        title: 'Proof of Concept Kick-off',
        notes: 'Official start of the PoC. All parties aligned on goals and timelines.',
        participants: ['stake_3', 'stake_7', 'stake_8'],
        authorId: 'stake_1',
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
    },
    {
        id: 'act_2',
        connectId: 'conn_2',
        type: 'Call',
        date: '2023-11-15T14:30:00Z',
        title: 'Introductory Call',
        notes: 'Discussed potential applications of quantum computing for their logistics challenges. Frank Wright seems intrigued.',
        participants: ['stake_4', 'stake_9'],
        authorId: 'stake_1',
        createdAt: '2023-11-15T14:30:00Z',
        updatedAt: '2023-11-15T14:30:00Z',
    },
    {
        id: 'act_3',
        connectId: 'conn_3',
        type: 'Milestone',
        date: '2023-09-05T09:00:00Z',
        title: 'NDA Signed',
        notes: 'Non-disclosure agreement executed. Cleared to share technical details.',
        participants: ['stake_5', 'stake_6', 'stake_10'],
        authorId: 'stake_2',
        createdAt: '2023-09-05T09:00:00Z',
        updatedAt: '2023-09-05T09:00:00Z',
    },
    {
        id: 'act_4',
        connectId: 'conn_3',
        type: 'Meeting',
        date: '2023-08-15T11:00:00Z',
        title: 'Initial Pitch',
        notes: 'Presented the HealthHub platform. VentureWell showed strong interest in an integration.',
        participants: ['stake_5', 'stake_10'],
        authorId: 'stake_2',
        createdAt: '2023-08-15T11:00:00Z',
        updatedAt: '2023-08-15T11:00:00Z',
    },
    {
        id: 'act_5',
        connectId: 'conn_4',
        type: 'Email',
        date: '2024-01-20T11:00:00Z',
        title: 'Follow-up Email Sent',
        notes: 'Sent a follow-up email to David Chen regarding our last discussion. No reply yet.',
        participants: ['stake_5', 'stake_7'],
        authorId: 'stake_2',
        createdAt: '2024-01-20T11:00:00Z',
        updatedAt: '2024-01-20T11:00:00Z',
    },
    {
        id: 'act_6',
        connectId: 'conn_5',
        type: 'Meeting',
        date: '2024-02-10T16:00:00Z',
        title: 'Synergy Analysis Meeting',
        notes: 'Concluded after analysis that there is no immediate synergy between our current product and their roadmap.',
        participants: ['stake_3', 'stake_9'],
        authorId: 'stake_1',
        createdAt: '2024-02-10T16:00:00Z',
        updatedAt: '2024-02-10T16:00:00Z',
    },
    {
        id: 'act_7',
        leadId: 'lead_1',
        type: 'Call',
        date: '2024-05-11T10:00:00Z',
        title: 'Initial Qualification Call',
        notes: 'Spoke with the prospect. They are very interested in the supply chain solution. Confirmed they have budget.',
        participants: [],
        authorId: 'stake_1',
        createdAt: '2024-05-11T10:00:00Z',
        updatedAt: '2024-05-11T10:00:00Z',
    },
];


export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story_1',
    connectId: 'conn_1',
    title: 'Successful PoC with Global Tech Inc.',
    story: "The Proof of Concept for our AI-driven diagnostics platform with Global Tech Inc. has been a resounding success. The initial results have exceeded all performance benchmarks, demonstrating a **95% accuracy rate** in preliminary tests. \n\nDavid Chen, Innovation Lead at Global Tech, expressed strong interest in moving to the next phase. This positions InnovateAI as a key potential partner for their new digital health initiative.",
    keyOutcomes: [
      "Exceeded performance benchmarks",
      "95% accuracy rate achieved",
      "Strong interest from corporate partner for next phase"
    ]
  },
  {
    id: 'story_2',
    connectId: 'conn_3',
    title: 'HealthHub & VentureWell Integration Complete',
    story: "Following a successful NDA phase, the full integration of HealthHub's patient management system into the VentureWell portfolio has been completed. This partnership streamlines data flow for over 50,000 patients and opens up new avenues for collaborative digital health solutions. \n\nThe project was delivered on-time and under-budget, thanks to the excellent collaboration between Maria Garcia's development team and Grace Lee at VentureWell.",
    keyOutcomes: [
      "Full platform integration completed",
      "On-time and under-budget delivery",
      "Streamlined data for 50,000+ patients"
    ]
  }
];