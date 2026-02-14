



export type StakeholderAffiliation = 'internal' | 'startup' | 'corporate';

// A user-configurable status for a Connect
export interface Status {
  id: string;
  name: string;
  color: string; // e.g., 'blue', 'green'
  workspaceId?: string;
}

// NEW: Configurable Intent Level for Leads
export interface IntentLevel {
  id: string;
  name: string;
  color: string; // e.g., 'red', 'yellow', 'green'
  workspaceId?: string;
}

// NEW: Configurable Need Type for Leads
export interface NeedType {
  id: string;
  name: string;
  workspaceId?: string;
}

// NEW: A tag for non-revenue value on a Lead
export interface NonRevenueTag {
  id: string;
  name: string;
  color: string;
  workspaceId?: string;
}

// Normalized Stakeholder: A unique person.
export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  affiliation: StakeholderAffiliation;
  workspaceId?: string;
  deletedAt?: string | null;
}

// Normalized Organization: A unique company.
export interface Organization {
  id:string;
  name: string;
  type: 'startup' | 'corporate';
  ownerId?: string; // ID of a Stakeholder who is the record owner
  contactIds: string[];
  workspaceId?: string;
  deletedAt?: string | null;
}

// NEW: An activity represents a single interaction within a Connect.
export type ActivityType = 'Meeting' | 'Call' | 'Email' | 'Note' | 'Milestone';

export interface Activity {
  id: string;
  connectId?: string;
  leadId?: string;
  type: ActivityType;
  date: string; // ISO string for when the activity occurred
  title: string; // e.g., "Follow-up Call", "Initial Pitch Meeting"
  notes?: string; // Markdown-supported notes for the activity
  participants: string[]; // List of Stakeholder IDs who participated
  authorId: string; // Stakeholder ID of who logged this activity
  workspaceId?: string;
  createdAt: string;
  updatedAt: string;
}

// MODIFIED: Connect is now a "deal" or container for activities.
export interface Connect {
  id:string;
  title: string;
  startupId: string;
  corporateId: string;
  ownerId: string; // ID of a Stakeholder who is the record owner for the connect
  statusId: string;
  date: string; // User-definable start date of the connect
  startupContactIds: string[]; // Specific stakeholder IDs for this connect
  corporateContactIds: string[]; // Specific stakeholder IDs for this connect
  deletedAt?: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  workspaceId?: string;
}

// A narrative created from a successful Connect
export interface SuccessStory {
  id: string;
  connectId: string;
  title: string;
  story: string; // Markdown content
  keyOutcomes: string[];
  workspaceId?: string;
}

// MODIFIED: A lead represents a potential new deal or opportunity, now with IDs.
export interface Lead {
  id: string;
  name: string;
  organizationType: 'startup' | 'corporate';
  source: string;
  intentLevelId: string;
  needTypeId: string;
  revenuePotential: number;
  nonRevenueTagIds: string[];
  ownerId: string; // Stakeholder ID
  comments?: string;
  workspaceId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// --- App-wide types ---
export type ViewMode = 'card' | 'list';
export type ActiveView = 'connects' | 'leads' | 'startups' | 'corporates' | 'stakeholders' | 'statistics' | 'success' | 'trash' | 'admin';
export type EntityType = 'organization' | 'stakeholder';
export type Entity = Organization | Stakeholder;
export type Theme = 'light' | 'dark';
export type SortDirection = 'ascending' | 'descending';

export interface ActiveFilters {
  statusIds: Set<string>;
  ownerIds: Set<string>;
  intentLevelIds: Set<string>;
  needTypeIds: Set<string>;
}

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export type UsageRole = 
  | "Connect Owner" 
  | "Startup Contact (Deal)"
  | "Corporate Contact (Deal)"
  | "Organization Owner" 
  | "Organization Contact"
  | "Activity Participant";

export interface StructuredUsageDetail {
  recordName: string;
  recordType: 'Connect' | 'Organization' | 'Activity' | 'Lead';
  role: UsageRole;
}

export interface IndustryInsightsData {
  analysis: string;
  sources: { uri: string; title:string; }[];
}

export interface ConfirmationModalConfig {
    title: string;
    message: string;
    details?: string;
    confirmText: string;
    onConfirm: () => void;
}

export interface UserSettings {
  id?: string;
  columnWidths?: {
    connects?: number[];
    leads?: number[];
    startups?: number[];
    corporates?: number[];
    stakeholders?: number[];
  };
}