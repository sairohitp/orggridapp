import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode, useRef } from 'react';
import { Connect, Stakeholder, Organization, Status, Entity, EntityType, ViewMode, ActiveView, Theme, ActiveFilters, SortConfig, SortDirection, StakeholderAffiliation, SuccessStory, StructuredUsageDetail, IndustryInsightsData, Activity, ActivityType, UsageRole, ConfirmationModalConfig, Lead, IntentLevel, NeedType, NonRevenueTag, UserSettings } from '../types';
import { INITIAL_CONNECTS, INITIAL_ORGANIZATIONS, INITIAL_STAKEHOLDERS, INITIAL_STATUSES, INITIAL_SUCCESS_STORIES, INITIAL_ACTIVITIES, INITIAL_LEADS, INITIAL_INTENT_LEVELS, INITIAL_NEED_TYPES, INITIAL_NON_REVENUE_TAGS } from '../constants';
import { get, exportConnectsToCSV, exportOrganizationsToCSV, exportStakeholdersToCSV, getHeaderDisclaimerForView, getRequiredHeadersForView, exportLeadsToCSV, parseCsvData, getItemInfo } from '../utils';
import { getConnectSummary, getIndustryInsights } from '../services/geminiService';
import { User, db } from '../services/firebase';


// --- Dashboard Stats Type ---
export interface DashboardStats {
    totalActiveConnects: number;
    successRate: number;
    averageDealCycleDays: number;
    totalActivities: number;
    pipelineDistribution: { status: Status; count: number }[];
    activityTypeDistribution: { type: ActivityType; count: number }[];
    connectsByMonth: { month: string; count: number }[];
    recentActivities: Activity[];
    // New fields for Leads
    totalActiveLeads: number;
    totalLeadsPotentialRevenue: number;
    leadsByIntentDistribution: { level: IntentLevel; count: number }[];
    leadsByNeedTypeDistribution: { type: NeedType; count: number }[];
    leadsByMonth: { month: string; count: number }[];
}


// --- CONTEXT TYPE DEFINITION ---
interface AppContextType {
    // Data
    connects: Connect[];
    organizations: Organization[];
    stakeholders: Stakeholder[];
    statuses: Status[];
    activities: Activity[];
    successStories: SuccessStory[];
    leads: Lead[];
    intentLevels: IntentLevel[];
    needTypes: NeedType[];
    nonRevenueTags: NonRevenueTag[];
    userSettings: UserSettings;
    // Derived Data
    organizationsById: Record<string, Organization>;
    stakeholdersById: Record<string, Stakeholder>;
    statusesById: Record<string, Status>;
    connectsById: Record<string, Connect>;
    activitiesById: Record<string, Activity>;
    activitiesByConnectId: Record<string, Activity[]>;
    activitiesByLeadId: Record<string, Activity[]>;
    leadsById: Record<string, Lead>;
    intentLevelsById: Record<string, IntentLevel>;
    needTypesById: Record<string, NeedType>;
    nonRevenueTagsById: Record<string, NonRevenueTag>;
    connectToSuccessStoryMap: Record<string, SuccessStory>;
    internalStakeholders: Stakeholder[];
    currentUserStakeholder: Stakeholder | null;
    organizationUsageCount: Record<string, number>;
    stakeholderUsageCount: Record<string, number>;
    statusUsageCount: Record<string, number>;
    intentLevelUsageCount: Record<string, number>;
    needTypeUsageCount: Record<string, number>;
    organizationContacts: Record<string, string[]>;
    stakeholderOrgMap: Record<string, string>;
    displayedData: (Connect | Entity | SuccessStory | Lead)[];
    totalCountForView: number;
    activeFilterCount: number;
    dashboardStats: DashboardStats;
    // UI State
    user: User;
    isLoading: boolean;
    activeView: ActiveView;
    viewMode: ViewMode;
    searchQuery: string;
    selectedIds: Set<string>;
    theme: Theme;
    filters: ActiveFilters;
    sortConfig: SortConfig | null;
    mainContainerRef: React.RefObject<HTMLElement | null>;
    isConnectModalOpen: boolean;
    connectToEdit: Connect | null;
    isLeadModalOpen: boolean;
    leadToEdit: Lead | null;
    isEntityModalOpen: boolean;
    entityToEdit: Entity | null;
    entityType: EntityType;
    defaultOrgType?: 'startup' | 'corporate';
    viewingContact: Stakeholder | null;
    isStatusModalOpen: boolean;
    isIntentLevelModalOpen: boolean;
    isNeedTypeModalOpen: boolean;
    isImportModalOpen: boolean;
    isSummaryModalOpen: boolean;
    summaryContent: string;
    isSummaryLoading: boolean;
    isSuccessStoryModalOpen: boolean;
    connectForStory: Connect | null;
    existingStory: SuccessStory | null;
    isDeletionGuardModalOpen: boolean;
    deletionGuardDetails: { stakeholderName: string; usage: StructuredUsageDetail[] } | null;
    isOrgDeletionGuardModalOpen: boolean;
    orgDeletionDetails: { organizationName: string; connects: Connect[] } | null;
    isIndustryInsightsModalOpen: boolean;
    industryInsightsData: IndustryInsightsData | null;
    isIndustryInsightsLoading: boolean;
    isActivityModalOpen: boolean;
    parentIdForActivity: string | null;
    parentTypeForActivity: 'connect' | 'lead' | null;
    activityToEdit: Activity | null;
    isActivityHistoryModalOpen: boolean;
    parentIdForHistory: string | null;
    parentTypeForHistory: 'connect' | 'lead' | null;
    isConfirmationModalOpen: boolean;
    confirmationModalConfig: ConfirmationModalConfig | null;
    isErrorModalOpen: boolean;
    errorModalContent: { title: string; message: string; } | null;
    // Actions
    actions: {
        setTheme: (theme: Theme) => void;
        setActiveView: (view: ActiveView) => void;
        setSearchQuery: (query: string) => void;
        setViewMode: (mode: ViewMode) => void;
        handleSort: (key: string) => void;
        handleFilterChange: (filters: ActiveFilters) => void;
        handleSelect: (id: string) => void;
        handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>, items: (Connect | Entity | SuccessStory | Lead)[]) => void;
        clearSelection: () => void;
        saveColumnWidths: (view: ActiveView, widths: number[]) => Promise<void>;
        // Connects
        openConnectModal: (connect?: Connect | null) => void;
        closeConnectModal: () => void;
        saveConnect: (connectData: Omit<Connect, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> | Connect) => Promise<void>;
        deleteConnect: (id: string) => Promise<void>;
        quickStatusUpdate: (connectId: string, statusId: string) => Promise<void>;
        // Leads
        openLeadModal: (lead?: Lead | null) => void;
        closeLeadModal: () => void;
        saveLead: (leadData: Partial<Lead>) => Promise<void>;
        deleteLead: (id: string) => Promise<void>;
        // Activities
        openActivityModal: (parentId: string, parentType: 'connect' | 'lead', activity?: Activity | null) => void;
        closeActivityModal: () => void;
        saveActivity: (activityData: Partial<Activity>) => Promise<void>;
        deleteActivity: (activityId: string) => Promise<void>;
        openActivityHistoryModal: (parentId: string, parentType: 'connect' | 'lead') => void;
        closeActivityHistoryModal: () => void;
        // Entities
        openEntityModal: (type: EntityType, entity?: Entity | null, orgType?: 'startup' | 'corporate') => void;
        closeEntityModal: () => void;
        saveEntity: (entityData: Partial<Entity>) => Promise<void>;
        deleteEntity: (id: string) => Promise<void>;
        // Statuses
        openStatusModal: () => void;
        closeStatusModal: () => void;
        saveStatus: (status: Status | Omit<Status, 'id'>) => Promise<void>;
        deleteStatus: (id: string) => Promise<void>;
        // Intent Levels
        openIntentLevelModal: () => void;
        closeIntentLevelModal: () => void;
        saveIntentLevel: (level: IntentLevel | Omit<IntentLevel, 'id'>) => Promise<void>;
        deleteIntentLevel: (id: string) => Promise<void>;
        // Need Types
        openNeedTypeModal: () => void;
        closeNeedTypeModal: () => void;
        saveNeedType: (type: NeedType | Omit<NeedType, 'id'>) => Promise<void>;
        deleteNeedType: (id: string) => Promise<void>;
        // Success Stories
        openSuccessStoryModal: (connectId: string) => void;
        closeSuccessStoryModal: () => void;
        saveSuccessStory: (storyData: Omit<SuccessStory, 'id'>, existingId?: string) => Promise<void>;
        deleteSuccessStory: (id: string) => Promise<void>;
        // Trash
        restoreTrashedItem: (item: any) => Promise<void>;
        deleteTrashedItemPermanently: (item: any) => Promise<void>;
        // Other Modals & Overlays
        openContact: (contact: Stakeholder) => void;
        closeContact: () => void;
        openImportModal: () => void;
        closeImportModal: () => void;
        handleFileImport: (file: File) => void;
        generateSummary: (connectId: string) => void;
        closeSummaryModal: () => void;
        generateIndustryInsights: (organizationId: string) => void;
        closeIndustryInsightsModal: () => void;
        closeDeletionGuardModal: () => void;
        closeOrgDeletionGuardModal: () => void;
        openConfirmationModal: (config: ConfirmationModalConfig) => void;
        closeConfirmationModal: () => void;
        openErrorModal: (title: string, message: string) => void;
        closeErrorModal: () => void;
        // Global
        handleOpenAddNew: () => void;
        handleExport: () => void;
        handleBulkAction: (action: 'export' | 'delete' | 'restore') => void;
        getRequiredHeaders: (view: ActiveView) => string[];
        getHeaderDisclaimer: (view: ActiveView) => string;
    };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
interface AppContextProviderProps {
    children: ReactNode;
    user: User;
    mainContainerRef: React.RefObject<HTMLElement | null>;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children, user, mainContainerRef }) => {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    // Master Data
    const [connects, setConnects] = useState<Connect[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [intentLevels, setIntentLevels] = useState<IntentLevel[]>([]);
    const [needTypes, setNeedTypes] = useState<NeedType[]>([]);
    const [nonRevenueTags, setNonRevenueTags] = useState<NonRevenueTag[]>([]);
    const [userSettings, setUserSettings] = useState<UserSettings>({});
    // UI State
    const [activeView, setActiveView] = useState<ActiveView>('connects');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set<string>());
    const [theme, setTheme] = useState<Theme>(localStorage.theme || 'light');
    const [filters, setFilters] = useState<ActiveFilters>({ statusIds: new Set(), ownerIds: new Set(), intentLevelIds: new Set(), needTypeIds: new Set() });
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'updatedAt', direction: 'descending' });
    // Modals & Overlays
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectToEdit, setConnectToEdit] = useState<Connect | null>(null);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
    const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
    const [entityToEdit, setEntityToEdit] = useState<Entity | null>(null);
    const [entityType, setEntityType] = useState<EntityType>('organization');
    const [defaultOrgType, setDefaultOrgType] = useState<'startup' | 'corporate'>();
    const [viewingContact, setViewingContact] = useState<Stakeholder | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isIntentLevelModalOpen, setIsIntentLevelModalOpen] = useState(false);
    const [isNeedTypeModalOpen, setIsNeedTypeModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [isSuccessStoryModalOpen, setIsSuccessStoryModalOpen] = useState(false);
    const [connectForStory, setConnectForStory] = useState<Connect | null>(null);
    const [isDeletionGuardModalOpen, setIsDeletionGuardModalOpen] = useState(false);
    const [deletionGuardDetails, setDeletionGuardDetails] = useState<{ stakeholderName: string, usage: StructuredUsageDetail[] } | null>(null);
    const [orgDeletionDetails, setOrgDeletionDetails] = useState<{ organizationName: string; connects: Connect[] } | null>(null);
    const isOrgDeletionGuardModalOpen = !!orgDeletionDetails;
    const [isIndustryInsightsModalOpen, setIsIndustryInsightsModalOpen] = useState(false);
    const [industryInsightsData, setIndustryInsightsData] = useState<IndustryInsightsData | null>(null);
    const [isIndustryInsightsLoading, setIsIndustryInsightsLoading] = useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [parentIdForActivity, setParentIdForActivity] = useState<string | null>(null);
    const [parentTypeForActivity, setParentTypeForActivity] = useState<'connect' | 'lead' | null>(null);
    const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
    const [isActivityHistoryModalOpen, setIsActivityHistoryModalOpen] = useState(false);
    const [parentIdForHistory, setParentIdForHistory] = useState<string | null>(null);
    const [parentTypeForHistory, setParentTypeForHistory] = useState<'connect' | 'lead' | null>(null);
    const [confirmationModalConfig, setConfirmationModalConfig] = useState<ConfirmationModalConfig | null>(null);
    const isConfirmationModalOpen = !!confirmationModalConfig;
    const [errorModalContent, setErrorModalContent] = useState<{ title: string; message: string; } | null>(null);
    const isErrorModalOpen = !!errorModalContent;

    // --- DATA LOADING & INITIALIZATION ---
    useEffect(() => {
        if (!user || !user.uid) {
            setIsLoading(false);
            return;
        }

        let unsubscribers: (() => void)[] = [];

        const collectionsToListen: { [key: string]: React.Dispatch<React.SetStateAction<any[]>> } = {
            connects: setConnects,
            organizations: setOrganizations,
            stakeholders: setStakeholders,
            statuses: setStatuses,
            activities: setActivities,
            successStories: setSuccessStories,
            leads: setLeads,
            intentLevels: setIntentLevels,
            needTypes: setNeedTypes,
            nonRevenueTags: setNonRevenueTags,
        };
        
        const openErrorModal = (title: string, message: string) => {
            setErrorModalContent({ title, message });
        };

        const initializeAndListen = async () => {
            setIsLoading(true);
            try {
                // Step 1: Initial Fetch using .get() to guarantee data is loaded before UI renders
                const fetchPromises = Object.keys(collectionsToListen).map(async (collectionName) => {
                    const snapshot = await db.collection(collectionName).get();
                    const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    return { collectionName, data };
                });
                
                const userSettingsPromise = db.collection('userSettings').doc(user.uid).get();

                const [initialDataResults, userSettingsDoc] = await Promise.all([Promise.all(fetchPromises), userSettingsPromise]);

                // Step 2: Set State from the fetched data
                initialDataResults.forEach(({ collectionName, data }) => {
                    const setter = collectionsToListen[collectionName];
                    if (collectionName === 'activities' || collectionName === 'leads' || collectionName === 'connects') {
                        data.sort((a, b) => new Date((b as Activity | Lead | Connect).updatedAt).getTime() - new Date((a as Activity | Lead | Connect).updatedAt).getTime());
                    }
                    setter(data);
                });

                if (userSettingsDoc.exists) {
                    setUserSettings({ id: userSettingsDoc.id, ...userSettingsDoc.data() } as UserSettings);
                }


                // Step 3: Set Loading to False, UI can now render with data
                setIsLoading(false);

                // Step 4: Attach listeners for subsequent real-time updates
                Object.entries(collectionsToListen).forEach(([collectionName, setter]) => {
                    const query = db.collection(collectionName);
                    const unsubscribe = query.onSnapshot(snapshot => {
                        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                        if (collectionName === 'activities' || collectionName === 'leads' || collectionName === 'connects') {
                           data.sort((a, b) => new Date((b as Activity | Lead | Connect).updatedAt).getTime() - new Date((a as Activity | Lead | Connect).updatedAt).getTime());
                        }
                        setter(data);
                    }, (error: any) => {
                        console.error(`Error listening to ${collectionName}: `, error);
                        if (error.code === 'permission-denied') {
                            openErrorModal(
                                'Sync Error',
                                'Lost connection to the database due to a permission issue. Please check your Firestore security rules and refresh the page.'
                            );
                        }
                    });
                    unsubscribers.push(unsubscribe);
                });
                
                // Listener for user settings
                const userSettingsUnsub = db.collection('userSettings').doc(user.uid).onSnapshot(doc => {
                    if (doc.exists) {
                        setUserSettings({ id: doc.id, ...doc.data() } as UserSettings);
                    }
                });
                unsubscribers.push(userSettingsUnsub);


            } catch (error: any) {
                console.error("Failed to initialize workspace:", error);
                if (error.message && (error.message.toLowerCase().includes('permission') || error.message.toLowerCase().includes('missing or insufficient permissions'))) {
                    const rulesContent = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for any authenticated user.
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;
                    const detailedMessage = `The application could not load data because the Firestore database is currently locked. This is a default security setting in Firebase.\n\nTo fix this, you MUST update your Firestore Security Rules.\n\n1. Go to your Firebase project console.\n2. Navigate to Build > Firestore Database > Rules.\n3. Delete all existing text in the rules editor.\n4. Copy the text below and paste it into the editor:\n\n\`\`\`\n${rulesContent}\n\`\`\`\n\n5. Click 'Publish'.\n6. Reload the application.`;
                    openErrorModal('Database Access Denied', detailedMessage);
                } else {
                    openErrorModal('Initialization Error', `An unexpected error occurred while loading data: ${error.message}`);
                }
                setIsLoading(false);
            }
        };

        initializeAndListen();

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, [user]);

    // --- DERIVED DATA & MEMOS ---
    const organizationsById = useMemo(() => Object.fromEntries(organizations.map(o => [o.id, o])), [organizations]);
    const stakeholdersById = useMemo(() => Object.fromEntries(stakeholders.map(s => [s.id, s])), [stakeholders]);
    const statusesById = useMemo(() => Object.fromEntries(statuses.map(s => [s.id, s])), [statuses]);
    const connectsById = useMemo(() => Object.fromEntries(connects.map(c => [c.id, c])), [connects]);
    const activitiesById = useMemo(() => Object.fromEntries(activities.map(a => [a.id, a])), [activities]);
    const leadsById = useMemo(() => Object.fromEntries(leads.map(l => [l.id, l])), [leads]);
    const intentLevelsById = useMemo(() => Object.fromEntries(intentLevels.map(i => [i.id, i])), [intentLevels]);
    const needTypesById = useMemo(() => Object.fromEntries(needTypes.map(n => [n.id, n])), [needTypes]);
    const nonRevenueTagsById = useMemo(() => Object.fromEntries(nonRevenueTags.map(t => [t.id, t])), [nonRevenueTags]);

    const allItemsById = useMemo(() => {
        const all = [...connects, ...leads, ...organizations, ...stakeholders];
        return new Map(all.map(item => [item.id, item]));
    }, [connects, leads, organizations, stakeholders]);

    const activitiesByConnectId = useMemo(() => {
        const unsorted = activities.reduce((acc, activity) => {
            if (activity.connectId) {
                if (!acc[activity.connectId]) {
                    acc[activity.connectId] = [];
                }
                acc[activity.connectId].push(activity);
            }
            return acc;
        }, {} as Record<string, Activity[]>);
        
        for (const connectId in unsorted) {
            unsorted[connectId].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return unsorted;
    }, [activities]);
    
    const activitiesByLeadId = useMemo(() => {
        const unsorted = activities.reduce((acc, activity) => {
            if (activity.leadId) {
                if (!acc[activity.leadId]) {
                    acc[activity.leadId] = [];
                }
                acc[activity.leadId].push(activity);
            }
            return acc;
        }, {} as Record<string, Activity[]>);

        for (const leadId in unsorted) {
            unsorted[leadId].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return unsorted;
    }, [activities]);

    const internalStakeholders = useMemo(() => stakeholders.filter(s => s.affiliation === 'internal').sort((a,b) => a.name.localeCompare(b.name)), [stakeholders]);
    const currentUserStakeholder = useMemo(() => stakeholders.find(s => s.email === user.email) || null, [stakeholders, user.email]);

    const connectToSuccessStoryMap = useMemo(() => Object.fromEntries(successStories.map(s => [s.connectId, s])), [successStories]);

    // Usage counts for deletion guards and stats
    const { organizationUsageCount, stakeholderUsageCount, statusUsageCount, intentLevelUsageCount, needTypeUsageCount } = useMemo(() => {
        const orgUsage: Record<string, number> = {};
        const stakeUsage: Record<string, number> = {};
        const statUsage: Record<string, number> = {};
        const intentUsage: Record<string, number> = {};
        const needUsage: Record<string, number> = {};
        
        connects.forEach(c => {
            if (c.deletedAt) return;
            orgUsage[c.startupId] = (orgUsage[c.startupId] || 0) + 1;
            orgUsage[c.corporateId] = (orgUsage[c.corporateId] || 0) + 1;
            stakeUsage[c.ownerId] = (stakeUsage[c.ownerId] || 0) + 1;
            c.startupContactIds.forEach(id => stakeUsage[id] = (stakeUsage[id] || 0) + 1);
            c.corporateContactIds.forEach(id => stakeUsage[id] = (stakeUsage[id] || 0) + 1);
            statUsage[c.statusId] = (statUsage[c.statusId] || 0) + 1;
        });

        organizations.forEach(org => {
            if (org.deletedAt) return;
            if (org.ownerId) stakeUsage[org.ownerId] = (stakeUsage[org.ownerId] || 0) + 1;
            org.contactIds.forEach(id => stakeUsage[id] = (stakeUsage[id] || 0) + 1);
        });

        activities.forEach(act => {
            stakeUsage[act.authorId] = (stakeUsage[act.authorId] || 0) + 1;
            act.participants.forEach(id => stakeUsage[id] = (stakeUsage[id] || 0) + 1);
        })
        
        leads.forEach(l => {
            if (l.deletedAt) return;
            stakeUsage[l.ownerId] = (stakeUsage[l.ownerId] || 0) + 1;
            intentUsage[l.intentLevelId] = (intentUsage[l.intentLevelId] || 0) + 1;
            needUsage[l.needTypeId] = (needUsage[l.needTypeId] || 0) + 1;
        })

        return { 
            organizationUsageCount: orgUsage,
            stakeholderUsageCount: stakeUsage,
            statusUsageCount: statUsage,
            intentLevelUsageCount: intentUsage,
            needTypeUsageCount: needUsage,
        };
    }, [connects, organizations, activities, leads]);

    const { organizationContacts, stakeholderOrgMap } = useMemo(() => {
        const orgContacts: Record<string, string[]> = {};
        const stakeOrgMap: Record<string, string> = {};
        organizations.forEach(org => {
            orgContacts[org.id] = org.contactIds;
            org.contactIds.forEach(contactId => {
                stakeOrgMap[contactId] = org.name;
            });
        });
        return { organizationContacts: orgContacts, stakeholderOrgMap: stakeOrgMap };
    }, [organizations]);

    // --- Main Filtering and Sorting Logic ---
    const { displayedData, totalCountForView } = useMemo(() => {
        let items: (Connect | Entity | SuccessStory | Lead)[] = [];
        let totalCount = 0;

        // 1. Select data based on view
        switch (activeView) {
            case 'connects':
                items = connects.filter(c => !c.deletedAt);
                break;
            case 'leads':
                items = leads.filter(l => !l.deletedAt);
                break;
            case 'trash':
                const trashedConnects = connects.filter(c => !!c.deletedAt);
                const trashedLeads = leads.filter(l => !!l.deletedAt);
                const trashedOrgs = organizations.filter(o => !!o.deletedAt);
                const trashedStakeholders = stakeholders.filter(s => !!s.deletedAt);
                items = [...trashedConnects, ...trashedLeads, ...trashedOrgs, ...trashedStakeholders];
                items.sort((a, b) => new Date((b as any).deletedAt!).getTime() - new Date((a as any).deletedAt!).getTime());
                break;
            case 'startups':
                items = organizations.filter(o => o.type === 'startup' && !o.deletedAt);
                break;
            case 'corporates':
                items = organizations.filter(o => o.type === 'corporate' && !o.deletedAt);
                break;
            case 'stakeholders':
                items = stakeholders.filter(s => !s.deletedAt);
                break;
            case 'success':
                items = successStories;
                break;
            case 'admin':
                items = stakeholders.filter(s => !s.deletedAt);
                break;
            default:
                items = [];
        }
        totalCount = items.length;

        // 2. Filter by search query
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            items = items.filter(item => {
                if ('title' in item) { // Connect or SuccessStory
                    const connect = 'connectId' in item ? connectsById[item.connectId] : item as Connect;
                    const startup = connect ? organizationsById[connect.startupId] : null;
                    const corporate = connect ? organizationsById[connect.corporateId] : null;
                    const owner = connect ? stakeholdersById[connect.ownerId] : null;

                    return item.title.toLowerCase().includes(lowercasedQuery) ||
                           startup?.name.toLowerCase().includes(lowercasedQuery) ||
                           corporate?.name.toLowerCase().includes(lowercasedQuery) ||
                           owner?.name.toLowerCase().includes(lowercasedQuery);
                }
                if ('name' in item) { // Organization, Stakeholder or Lead
                    const stake = item as Stakeholder; // for role/email check
                    const lead = item as Lead; // for source/needType check
                    const intentLevel = intentLevelsById[lead.intentLevelId];
                    const needType = needTypesById[lead.needTypeId];

                    return item.name.toLowerCase().includes(lowercasedQuery) ||
                           (stake.role && stake.role.toLowerCase().includes(lowercasedQuery)) ||
                           (stake.email && stake.email.toLowerCase().includes(lowercasedQuery)) ||
                           (stakeholderOrgMap[item.id] && stakeholderOrgMap[item.id].toLowerCase().includes(lowercasedQuery)) ||
                           (lead.source && lead.source.toLowerCase().includes(lowercasedQuery)) ||
                           (intentLevel && intentLevel.name.toLowerCase().includes(lowercasedQuery)) ||
                           (needType && needType.name.toLowerCase().includes(lowercasedQuery));
                }
                return false;
            });
        }
        
        // 3. Filter by status/owner for 'connects' view
        if (activeView === 'connects') {
            const { statusIds, ownerIds } = filters;
            if (statusIds.size > 0) {
                items = items.filter(c => statusIds.has((c as Connect).statusId));
            }
            if (ownerIds.size > 0) {
                items = items.filter(c => ownerIds.has((c as Connect).ownerId));
            }
        }

        if (activeView === 'leads') {
            const { ownerIds, intentLevelIds, needTypeIds } = filters;
            if (ownerIds.size > 0) {
                items = items.filter(l => ownerIds.has((l as Lead).ownerId));
            }
            if (intentLevelIds.size > 0) {
                items = items.filter(l => intentLevelIds.has((l as Lead).intentLevelId));
            }
            if (needTypeIds.size > 0) {
                items = items.filter(l => needTypeIds.has((l as Lead).needTypeId));
            }
        }
        
        // 4. Sort
        if (sortConfig && activeView !== 'trash') {
            items.sort((a, b) => {
                const aValue = get(a, sortConfig.key, '');
                const bValue = get(b, sortConfig.key, '');
                
                // Special nested lookups
                const resolveValue = (item: any, key: string) => {
                    if (key === 'startup.name') return organizationsById[item.startupId]?.name || '';
                    if (key === 'corporate.name') return organizationsById[item.corporateId]?.name || '';
                    if (key === 'owner.name') return stakeholdersById[item.ownerId]?.name || '';
                    if (key === 'status.name') return statusesById[item.statusId]?.name || '';
                    if (key === 'intentLevel.name') return intentLevelsById[item.intentLevelId]?.name || '';
                    if (key === 'needType.name') return needTypesById[item.needTypeId]?.name || '';
                    if (key === 'organization.name') return stakeholderOrgMap[item.id] || '';
                    if (key === 'connects') return organizationUsageCount[item.id] || 0;
                    if (key === 'recordsLinked') return stakeholderUsageCount[item.id] || 0;
                    return get(item, key, '');
                }

                const valA = resolveValue(a, sortConfig.key);
                const valB = resolveValue(b, sortConfig.key);
                
                let comparison = 0;
                if (typeof valA === 'string' && typeof valB === 'string') {
                    comparison = valA.localeCompare(valB, undefined, { numeric: true });
                } else {
                    if (valA > valB) comparison = 1;
                    else if (valA < valB) comparison = -1;
                }
                
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return { displayedData: items, totalCountForView: totalCount };
    }, [
        activeView, connects, organizations, stakeholders, statuses, successStories, leads, intentLevels, needTypes,
        searchQuery, filters, sortConfig,
        organizationsById, stakeholdersById, statusesById, connectsById, intentLevelsById, needTypesById,
        stakeholderOrgMap, organizationUsageCount, stakeholderUsageCount
    ]);

    const activeFilterCount = useMemo(() => filters.statusIds.size + filters.ownerIds.size + filters.intentLevelIds.size + filters.needTypeIds.size, [filters]);

    // --- Dashboard Stats Calculation ---
    const dashboardStats: DashboardStats = useMemo(() => {
        // Connects Stats
        const activeConnects = connects.filter(c => !c.deletedAt);
        const successfulConnects = successStories.length;
        const totalClosedConnects = connects.filter(c => {
            const statusName = statusesById[c.statusId]?.name.toLowerCase();
            return statusName === 'no synergy' || statusName === 'no revert' || successStories.some(s => s.connectId === c.id);
        }).length;

        const totalCycleDays = successStories.reduce((acc, story) => {
            const connect = connectsById[story.connectId];
            if (connect) {
                const startDate = new Date(connect.createdAt);
                const endDate = new Date(connect.updatedAt); // Assuming last update is end date
                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return acc + diffDays;
            }
            return acc;
        }, 0);
        
        const pipelineDistribution = statuses.map(status => ({
            status,
            count: activeConnects.filter(c => c.statusId === status.id).length
        })).filter(item => item.count > 0).sort((a,b) => b.count - a.count);

        const activityTypeCounts: Record<ActivityType, number> = { Meeting: 0, Call: 0, Email: 0, Note: 0, Milestone: 0 };
        activities.forEach(act => { activityTypeCounts[act.type]++; });
        const activityTypeDistribution = Object.entries(activityTypeCounts).map(([type, count]) => ({ type: type as ActivityType, count })).sort((a,b) => b.count - a.count);
        
        const connectsByMonth: Record<string, number> = {};
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        for (let i = 0; i < 6; i++) {
            const d = new Date(sixMonthsAgo);
            d.setMonth(d.getMonth() + i);
            const monthKey = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            connectsByMonth[monthKey] = 0;
        }
        
        activeConnects.forEach(c => {
            const connectDate = new Date(c.date);
            if (connectDate >= sixMonthsAgo) {
                const monthKey = connectDate.toLocaleString('default', { month: 'short', year: '2-digit' });
                if (monthKey in connectsByMonth) {
                    connectsByMonth[monthKey]++;
                }
            }
        });
        
        // Leads Stats
        const activeLeads = leads.filter(l => !l.deletedAt);

        const leadsByIntentDistribution = intentLevels.map(level => ({
            level,
            count: activeLeads.filter(l => l.intentLevelId === level.id).length
        })).filter(item => item.count > 0).sort((a,b) => b.count - a.count);

        const leadsByNeedTypeDistribution = needTypes.map(type => ({
            type,
            count: activeLeads.filter(l => l.needTypeId === type.id).length
        })).filter(item => item.count > 0).sort((a,b) => b.count - a.count);

        const leadsByMonth: Record<string, number> = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date(sixMonthsAgo);
            d.setMonth(d.getMonth() + i);
            const monthKey = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            leadsByMonth[monthKey] = 0;
        }
        activeLeads.forEach(l => {
            const leadDate = new Date(l.createdAt);
            if (leadDate >= sixMonthsAgo) {
                const monthKey = leadDate.toLocaleString('default', { month: 'short', year: '2-digit' });
                if (monthKey in leadsByMonth) {
                    leadsByMonth[monthKey]++;
                }
            }
        });

        return {
            totalActiveConnects: activeConnects.length,
            successRate: totalClosedConnects > 0 ? (successfulConnects / totalClosedConnects) * 100 : 0,
            averageDealCycleDays: successStories.length > 0 ? Math.round(totalCycleDays / successStories.length) : 0,
            totalActivities: activities.length,
            pipelineDistribution,
            activityTypeDistribution,
            connectsByMonth: Object.entries(connectsByMonth).map(([month, count]) => ({month, count})),
            recentActivities: [...activities].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
            totalActiveLeads: activeLeads.length,
            totalLeadsPotentialRevenue: activeLeads.reduce((sum, lead) => sum + lead.revenuePotential, 0),
            leadsByIntentDistribution,
            leadsByNeedTypeDistribution,
            leadsByMonth: Object.entries(leadsByMonth).map(([month, count]) => ({ month, count })),
        };
    }, [connects, activities, successStories, statuses, statusesById, connectsById, leads, intentLevels, needTypes]);


    // --- ACTION HANDLERS (Callbacks) ---
    const handleSetTheme = useCallback((newTheme: Theme) => {
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, []);

    const handleSetActiveView = useCallback((view: ActiveView) => {
        setActiveView(view);
        setSearchQuery('');
        clearSelection();
        const defaultSort = view === 'connects' || view === 'leads' ? 'updatedAt' : 'name';
        const defaultDirection = view === 'connects' || view === 'leads' ? 'descending' : 'ascending';
        setSortConfig({ key: defaultSort, direction: defaultDirection });
        mainContainerRef.current?.scrollTo(0, 0);
    }, [mainContainerRef]);

    const handleSort = useCallback((key: string) => {
        setSortConfig(prev => {
            const isNewKey = prev?.key !== key;
            const direction = isNewKey ? 'ascending' : (prev.direction === 'ascending' ? 'descending' : 'ascending');
            return { key, direction };
        });
    }, []);
    
    const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

    const handleSelect = useCallback((id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>, items: (Connect | Entity | SuccessStory | Lead)[]) => {
        if (e.target.checked) {
            setSelectedIds(new Set(items.map(item => item.id)));
        } else {
            clearSelection();
        }
    }, [clearSelection]);
    
    const handleFilterChange = useCallback((newFilters: ActiveFilters) => setFilters(newFilters), []);
    
    // --- Modals & Overlays Open/Close ---
    const openConnectModal = useCallback((connect: Connect | null = null) => {
        setConnectToEdit(connect);
        setIsConnectModalOpen(true);
    }, []);
    const closeConnectModal = useCallback(() => {
        setConnectToEdit(null);
        setIsConnectModalOpen(false)
    }, []);

    const openLeadModal = useCallback((lead: Lead | null = null) => {
        setLeadToEdit(lead);
        setIsLeadModalOpen(true);
    }, []);
    const closeLeadModal = useCallback(() => {
        setLeadToEdit(null);
        setIsLeadModalOpen(false);
    }, []);

    const openEntityModal = useCallback((type: EntityType, entity: Entity | null = null, orgType?: 'startup' | 'corporate') => {
        setEntityType(type);
        setEntityToEdit(entity);
        setDefaultOrgType(orgType);
        setIsEntityModalOpen(true);
    }, []);
    const closeEntityModal = useCallback(() => {
        setEntityToEdit(null);
        setIsEntityModalOpen(false);
    }, []);

    const openContact = useCallback((contact: Stakeholder) => setViewingContact(contact), []);
    const closeContact = useCallback(() => setViewingContact(null), []);
    
    const openStatusModal = useCallback(() => setIsStatusModalOpen(true), []);
    const closeStatusModal = useCallback(() => setIsStatusModalOpen(false), []);

    const openIntentLevelModal = useCallback(() => setIsIntentLevelModalOpen(true), []);
    const closeIntentLevelModal = useCallback(() => setIsIntentLevelModalOpen(false), []);

    const openNeedTypeModal = useCallback(() => setIsNeedTypeModalOpen(true), []);
    const closeNeedTypeModal = useCallback(() => setIsNeedTypeModalOpen(false), []);

    const openImportModal = useCallback(() => setIsImportModalOpen(true), []);
    const closeImportModal = useCallback(() => setIsImportModalOpen(false), []);

    const closeSummaryModal = useCallback(() => setIsSummaryModalOpen(false), []);
    
    const openSuccessStoryModal = useCallback((connectId: string) => {
        const connect = connectsById[connectId];
        if (connect) {
            setConnectForStory(connect);
            setIsSuccessStoryModalOpen(true);
        }
    }, [connectsById]);

    const closeSuccessStoryModal = useCallback(() => {
        setConnectForStory(null);
        setIsSuccessStoryModalOpen(false)
    }, []);

    const closeDeletionGuardModal = useCallback(() => setIsDeletionGuardModalOpen(false), []);

    const closeOrgDeletionGuardModal = useCallback(() => setOrgDeletionDetails(null), []);

    const closeIndustryInsightsModal = useCallback(() => setIsIndustryInsightsModalOpen(false), []);

    const openActivityModal = useCallback((parentId: string, parentType: 'connect' | 'lead', activity: Activity | null = null) => {
        setParentIdForActivity(parentId);
        setParentTypeForActivity(parentType);
        setActivityToEdit(activity);
        setIsActivityModalOpen(true);
    }, []);

    const closeActivityModal = useCallback(() => {
        setIsActivityModalOpen(false);
        setParentIdForActivity(null);
        setParentTypeForActivity(null);
        setActivityToEdit(null);
    }, []);

    const openActivityHistoryModal = useCallback((parentId: string, parentType: 'connect' | 'lead') => {
        setParentIdForHistory(parentId);
        setParentTypeForHistory(parentType);
        setIsActivityHistoryModalOpen(true);
    }, []);

    const closeActivityHistoryModal = useCallback(() => {
        setIsActivityHistoryModalOpen(false);
        setParentIdForHistory(null);
        setParentTypeForHistory(null);
    }, []);
    
    const openConfirmationModal = useCallback((config: ConfirmationModalConfig) => {
        setConfirmationModalConfig(config);
    }, []);

    const closeConfirmationModal = useCallback(() => {
        setConfirmationModalConfig(null);
    }, []);

    const openErrorModal = useCallback((title: string, message: string) => {
        setErrorModalContent({ title, message });
    }, []);

    const closeErrorModal = useCallback(() => {
        setErrorModalContent(null);
    }, []);

    // --- Debounced Save for User Settings ---
    const debounceTimeoutRef = useRef<number | null>(null);
    const saveColumnWidths = useCallback(async (view: ActiveView, widths: number[]) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = window.setTimeout(async () => {
            if (!user?.uid) return;
            const newColumnWidths = {
                ...userSettings.columnWidths,
                [view]: widths,
            };
            await db.collection('userSettings').doc(user.uid).set({
                columnWidths: newColumnWidths
            }, { merge: true });
        }, 1000); // 1-second debounce
    }, [user?.uid, userSettings.columnWidths]);


    // --- CRUD Actions ---
    const saveConnect = useCallback(async (data: Omit<Connect, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> | Connect) => {
        if ('id' in data && data.id) { // Editing existing connect
            const docId = data.id;
            const updateData = { ...data, updatedAt: new Date().toISOString() };
            delete (updateData as any).id;
            await db.collection('connects').doc(docId).update(updateData);
        } else { // Creating new connect
            const newConnectData = {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null,
            };
            await db.collection('connects').add(newConnectData);
        }
        closeConnectModal();
    }, [closeConnectModal]);

    const quickStatusUpdate = useCallback(async (connectId: string, statusId: string) => {
       await db.collection('connects').doc(connectId).update({ statusId, updatedAt: new Date().toISOString() });
    }, []);

    const deleteConnect = useCallback(async (id: string) => {
        const connect = connectsById[id];
        if (!connect) return;
        openConfirmationModal({
            title: 'Move to Trash?',
            message: `Are you sure you want to move the connect "${connect.title}" to the trash?`,
            details: 'You can restore it later from the Trash view.',
            confirmText: 'Move to Trash',
            onConfirm: () => {
                db.collection('connects').doc(id).update({ deletedAt: new Date().toISOString() });
            }
        });
    }, [connectsById, openConfirmationModal]);
    
    const deleteConnectPermanently = useCallback(async (id: string) => {
        const connect = connectsById[id];
        if (!connect) return;
        openConfirmationModal({
            title: 'Delete Permanently?',
            message: `Are you sure you want to permanently delete the connect "${connect.title}"?`,
            details: 'This action cannot be undone.',
            confirmText: 'Delete Permanently',
            onConfirm: async () => {
                const batch = db.batch();
                batch.delete(db.collection('connects').doc(id));
                
                const relatedActivities = await db.collection('activities').where('connectId', '==', id).get();
                relatedActivities.forEach(doc => batch.delete(doc.ref));

                const relatedStories = await db.collection('successStories').where('connectId', '==', id).get();
                relatedStories.forEach(doc => batch.delete(doc.ref));

                await batch.commit();
            }
        });
    }, [connectsById, openConfirmationModal]);

    const saveLead = useCallback(async (data: Partial<Lead>) => {
        if (data.id) { // Update
            const docId = data.id;
            const updateData = { ...data, updatedAt: new Date().toISOString() };
            delete (updateData as any).id;
            await db.collection('leads').doc(docId).update(updateData);
        } else { // Create
            const createData = { 
                ...data, 
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null,
            };
            await db.collection('leads').add(createData);
        }
        closeLeadModal();
    }, [closeLeadModal]);

    const deleteLead = useCallback(async (id: string) => {
        const lead = leadsById[id];
        if (!lead) return;
        openConfirmationModal({
            title: 'Move Lead to Trash?',
            message: `Are you sure you want to move the lead "${lead.name}" to the trash?`,
            details: 'You can restore it later from the Trash view.',
            confirmText: 'Move to Trash',
            onConfirm: () => {
                db.collection('leads').doc(id).update({ deletedAt: new Date().toISOString() });
            }
        });
    }, [leadsById, openConfirmationModal]);

    const getStakeholderUsageDetails = useCallback((stakeholderId: string): StructuredUsageDetail[] => {
        const details: StructuredUsageDetail[] = [];
        
        connects.forEach(c => {
            if (c.deletedAt) return;
            const roles: UsageRole[] = [];
            if (c.ownerId === stakeholderId) roles.push('Connect Owner');
            if (c.startupContactIds.includes(stakeholderId)) roles.push('Startup Contact (Deal)');
            if (c.corporateContactIds.includes(stakeholderId)) roles.push('Corporate Contact (Deal)');
            roles.forEach(role => details.push({ recordName: c.title, recordType: 'Connect', role }));
        });
    
        organizations.forEach(o => {
            if (o.deletedAt) return;
            const roles: UsageRole[] = [];
            if (o.ownerId === stakeholderId) roles.push('Organization Owner');
            if (o.contactIds.includes(stakeholderId)) roles.push('Organization Contact');
            roles.forEach(role => details.push({ recordName: o.name, recordType: 'Organization', role }));
        });
    
        const activityRecords = new Set<string>();
        activities.forEach(a => {
            if (a.participants.includes(stakeholderId) || a.authorId === stakeholderId) {
                if (!activityRecords.has(a.id)) {
                    details.push({ recordName: a.title, recordType: 'Activity', role: 'Activity Participant' });
                    activityRecords.add(a.id);
                }
            }
        });
    
        return details;
    }, [connects, organizations, activities]);


    const saveEntity = useCallback(async (data: Partial<Entity>) => {
        const isOrg = 'type' in data;
        const collectionName = isOrg ? 'organizations' : 'stakeholders';
        
        if (data.id) { // Update
            const docId = data.id;
            const updateData = { ...data };
            delete (updateData as any).id;
            await db.collection(collectionName).doc(docId).update(updateData);
        } else { // Create
            const createData = { ...data, deletedAt: null };
            await db.collection(collectionName).add(createData);
        }
        closeEntityModal();
    }, [closeEntityModal]);

    const deleteEntity = useCallback(async (id: string) => {
        const stakeholder = stakeholdersById[id];
        const organization = organizationsById[id];

        if (stakeholder) {
            const usage = getStakeholderUsageDetails(id);
            if (usage.length > 0) {
                setDeletionGuardDetails({ stakeholderName: stakeholder.name, usage });
                setIsDeletionGuardModalOpen(true);
                return;
            }
             openConfirmationModal({
                title: 'Move Stakeholder to Trash?',
                message: `Are you sure you want to move ${stakeholder.name} to the trash?`,
                details: 'You can restore it later from the Trash view.',
                confirmText: 'Move to Trash',
                onConfirm: () => db.collection('stakeholders').doc(id).update({ deletedAt: new Date().toISOString() })
            });
        } else if (organization) {
            if ((organizationUsageCount[id] || 0) > 0) {
                const linkedConnects = connects.filter(c => (c.startupId === id || c.corporateId === id) && !c.deletedAt);
                setOrgDeletionDetails({
                    organizationName: organization.name,
                    connects: linkedConnects,
                });
                return;
            }
             openConfirmationModal({
                title: 'Move Organization to Trash?',
                message: `Are you sure you want to move ${organization.name} to the trash?`,
                details: 'You can restore it later from the Trash view.',
                confirmText: 'Move to Trash',
                onConfirm: () => db.collection('organizations').doc(id).update({ deletedAt: new Date().toISOString() })
            });
        }
    }, [stakeholdersById, organizationsById, organizationUsageCount, getStakeholderUsageDetails, openConfirmationModal, connects]);
    
    const saveStatus = useCallback(async (statusData: Status | Omit<Status, 'id'>) => {
        if ('id' in statusData && statusData.id) { // Update
            const docId = statusData.id;
            const updateData = { ...statusData };
            delete (updateData as any).id;
            await db.collection('statuses').doc(docId).update(updateData);
        } else { // Create
            const createData = { ...statusData };
            await db.collection('statuses').add(createData);
        }
    }, []);

    const deleteStatus = useCallback(async (id: string) => {
        const status = statusesById[id];
        if (!status) return;
        if ((statusUsageCount[id] || 0) > 0) {
            alert('Cannot delete a status that is currently in use.');
            return;
        }
        openConfirmationModal({
            title: 'Delete Status?',
            message: `Are you sure you want to delete the status "${status.name}"?`,
            details: 'This action is permanent and cannot be undone.',
            confirmText: 'Delete Status',
            onConfirm: () => db.collection('statuses').doc(id).delete()
        });
    }, [statusUsageCount, statusesById, openConfirmationModal]);

    const saveIntentLevel = useCallback(async (levelData: IntentLevel | Omit<IntentLevel, 'id'>) => {
        if ('id' in levelData && levelData.id) { // Update
            const docId = levelData.id;
            const updateData = { ...levelData };
            delete (updateData as any).id;
            await db.collection('intentLevels').doc(docId).update(updateData);
        } else { // Create
            const createData = { ...levelData };
            await db.collection('intentLevels').add(createData);
        }
    }, []);

    const deleteIntentLevel = useCallback(async (id: string) => {
        const level = intentLevelsById[id];
        if (!level) return;
        if ((intentLevelUsageCount[id] || 0) > 0) {
            alert('Cannot delete an intent level that is currently in use.');
            return;
        }
        openConfirmationModal({
            title: 'Delete Intent Level?',
            message: `Are you sure you want to delete the level "${level.name}"?`,
            details: 'This action is permanent and cannot be undone.',
            confirmText: 'Delete Level',
            onConfirm: () => db.collection('intentLevels').doc(id).delete()
        });
    }, [intentLevelUsageCount, intentLevelsById, openConfirmationModal]);

    const saveNeedType = useCallback(async (typeData: NeedType | Omit<NeedType, 'id'>) => {
        if ('id' in typeData && typeData.id) { // Update
            const docId = typeData.id;
            const updateData = { ...typeData };
            delete (updateData as any).id;
            await db.collection('needTypes').doc(docId).update(updateData);
        } else { // Create
            const createData = { ...typeData };
            await db.collection('needTypes').add(createData);
        }
    }, []);

    const deleteNeedType = useCallback(async (id: string) => {
        const type = needTypesById[id];
        if (!type) return;
        if ((needTypeUsageCount[id] || 0) > 0) {
            alert('Cannot delete a need type that is currently in use.');
            return;
        }
        openConfirmationModal({
            title: 'Delete Need Type?',
            message: `Are you sure you want to delete the type "${type.name}"?`,
            details: 'This action is permanent and cannot be undone.',
            confirmText: 'Delete Type',
            onConfirm: () => db.collection('needTypes').doc(id).delete()
        });
    }, [needTypeUsageCount, needTypesById, openConfirmationModal]);
    
    const saveSuccessStory = useCallback(async (storyData: Omit<SuccessStory, 'id'>, existingId?: string) => {
        if (existingId) {
            await db.collection('successStories').doc(existingId).update(storyData);
        } else {
            const createData = { ...storyData };
            await db.collection('successStories').add(createData);
        }
        closeSuccessStoryModal();
    }, [closeSuccessStoryModal]);
    
    const deleteSuccessStory = useCallback(async (id: string) => {
        const story = successStories.find(s => s.id === id);
        if (!story) return;

        openConfirmationModal({
            title: 'Delete Success Story?',
            message: `Are you sure you want to delete the success story "${story.title}"?`,
            details: 'This action is permanent and cannot be undone.',
            confirmText: 'Delete Story',
            onConfirm: () => db.collection('successStories').doc(id).delete()
        });
    }, [successStories, openConfirmationModal]);

    const saveActivity = useCallback(async (data: Partial<Activity>) => {
        const now = new Date().toISOString();
        const parentCollection = parentTypeForActivity === 'connect' ? 'connects' : 'leads';

        if (data.id) { // Update
            const docId = data.id;
            const updateData = { ...data, updatedAt: now };
            delete (updateData as any).id;
            await db.collection('activities').doc(docId).update(updateData);
            if (parentIdForActivity) {
                await db.collection(parentCollection).doc(parentIdForActivity).update({ updatedAt: now });
            }
        } else { // Create
            const createData = {
                ...data,
                authorId: currentUserStakeholder?.id || 'system',
                createdAt: now,
                updatedAt: now,
            };
            await db.collection('activities').add(createData);
             if (parentIdForActivity) {
                await db.collection(parentCollection).doc(parentIdForActivity).update({ updatedAt: now });
            }
        }
        closeActivityModal();
    }, [currentUserStakeholder, parentIdForActivity, parentTypeForActivity, closeActivityModal]);
    
    const deleteActivity = useCallback(async (activityId: string) => {
        const activity = activitiesById[activityId];
        if (!activity) return;

        openConfirmationModal({
            title: 'Delete Activity?',
            message: `Are you sure you want to delete the activity "${activity.title}"?`,
            details: 'This action is permanent and cannot be undone.',
            confirmText: 'Delete Activity',
            onConfirm: async () => {
                await db.collection('activities').doc(activityId).delete();
                const parentId = activity.connectId || activity.leadId;
                if (parentId) {
                    const parentCollection = activity.connectId ? 'connects' : 'leads';
                    await db.collection(parentCollection).doc(parentId).update({ updatedAt: new Date().toISOString() });
                }
            }
        });
    }, [activitiesById, openConfirmationModal]);

    const restoreTrashedItem = useCallback(async (item: any) => {
        const { collection } = getItemInfo(item);
        if (collection !== 'unknown') {
            await db.collection(collection).doc(item.id).update({ deletedAt: null });
        }
    }, []);

    const deleteTrashedItemPermanently = useCallback(async (item: any) => {
        const { type, collection, name } = getItemInfo(item);
        if (collection === 'unknown') return;
        
        if (collection === 'connects') {
            await deleteConnectPermanently(item.id);
            return;
        }
        
        openConfirmationModal({
            title: `Delete ${type} Permanently?`,
            message: `Are you sure you want to permanently delete "${name}"?`,
            details: 'This action cannot be undone.',
            confirmText: 'Delete Permanently',
            onConfirm: async () => {
                await db.collection(collection).doc(item.id).delete();
            }
        });
    }, [openConfirmationModal, deleteConnectPermanently]);


    // --- Gemini Actions ---
    const generateSummary = useCallback(async (connectId: string) => {
        setIsSummaryModalOpen(true);
        setIsSummaryLoading(true);
        try {
            const connect = connectsById[connectId];
            const startup = organizationsById[connect.startupId];
            const corporate = organizationsById[connect.corporateId];
            const owner = stakeholdersById[connect.ownerId];
            const status = statusesById[connect.statusId];
            const connectActivities = activitiesByConnectId[connectId] || [];

            if (!connect || !startup || !corporate || !owner || !status) {
                throw new Error("Missing data to generate summary.");
            }
            const summary = await getConnectSummary(connect, startup, corporate, owner, status, connectActivities, stakeholdersById);
            setSummaryContent(summary);
        } catch (error) {
            setSummaryContent(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsSummaryLoading(false);
        }
    }, [connectsById, organizationsById, stakeholdersById, statusesById, activitiesByConnectId]);
    
    const generateIndustryInsights = useCallback(async (organizationId: string) => {
        setIsIndustryInsightsModalOpen(true);
        setIsIndustryInsightsLoading(true);
        try {
            const org = organizationsById[organizationId];
            if (!org) throw new Error("Organization not found.");
            const insights = await getIndustryInsights(org.name);
            setIndustryInsightsData(insights);
        } catch (error) {
            setIndustryInsightsData({ analysis: error instanceof Error ? error.message : "An unknown error occurred.", sources: [] });
        } finally {
            setIsIndustryInsightsLoading(false);
        }
    }, [organizationsById]);

    // --- Import/Export & Global Actions ---
    const handleFileImport = useCallback(async (file: File) => {
        setIsLoading(true);
        closeImportModal();
        const entityType = activeView as 'connects' | 'startups' | 'corporates' | 'stakeholders' | 'leads';
    
        const successes: string[] = [];
        const errors: string[] = [];
    
        try {
            const csvText = await file.text();
            const parsedData = await parseCsvData(csvText, entityType, { organizations, stakeholders, statuses, intentLevels, needTypes, nonRevenueTags });
    
            if (parsedData.length === 0) {
                openErrorModal('Import Warning', 'The CSV file is empty or contains no valid data rows.');
                setIsLoading(false);
                return;
            }
    
            const collectionNameMap = {
                startups: 'organizations', corporates: 'organizations',
                stakeholders: 'stakeholders', connects: 'connects', leads: 'leads',
            };
            const collectionName = collectionNameMap[entityType as keyof typeof collectionNameMap];
    
            for (let i = 0; i < parsedData.length; i++) {
                const item = parsedData[i];
                const rowNum = i + 2;
                const recordIdentifier = item.name || item.title || 'N/A';
    
                try {
                    let validationError = '';
                    switch(entityType) {
                        case 'connects':
                            if (!item.title) validationError = "Missing 'Title'.";
                            else if (!item.startupId) validationError = `Could not find a Startup Organization for row.`;
                            else if (!item.corporateId) validationError = `Could not find a Corporate Organization for row.`;
                            else if (!item.ownerId) validationError = `Could not find an Owner by email for row.`;
                            else if (!item.statusId) validationError = `Could not find a Status for row.`;
                            break;
                        case 'leads':
                            if (!item.name) validationError = "Missing 'Name'.";
                            else if (!item.ownerId) validationError = "Could not find a matching Owner by email.";
                            else if (!item.intentLevelId) validationError = "Could not find a matching Intent Level.";
                            else if (!item.needTypeId) validationError = "Could not find a matching Need Type.";
                            break;
                        case 'startups': case 'corporates':
                            if (!item.name) validationError = "Missing 'Name'.";
                            break;
                        case 'stakeholders':
                            if (!item.name) validationError = "Missing 'Name'.";
                            else if (!item.email) validationError = "Missing 'Email'.";
                            else if (!item.affiliation) validationError = "Missing 'Affiliation'.";
                            break;
                    }
                    if (validationError) throw new Error(validationError);
    
                    const { id, ...itemData } = item;
                    Object.keys(itemData).forEach(key => (itemData[key] === undefined || itemData[key] === null) && delete itemData[key]);
                    
                    if (id) {
                        await db.collection(collectionName).doc(id).set({ ...itemData, updatedAt: new Date().toISOString() }, { merge: true });
                        successes.push(`Row ${rowNum}: Updated "${recordIdentifier}".`);
                    } else {
                        const now = new Date().toISOString();
                        await db.collection(collectionName).add({ ...itemData, createdAt: now, updatedAt: now, deletedAt: null });
                        successes.push(`Row ${rowNum}: Created "${recordIdentifier}".`);
                    }
                } catch (rowError: any) {
                    errors.push(`Row ${rowNum} ("${recordIdentifier}"): ${rowError.message}`);
                }
            }
    
            // Show summary report
            if (errors.length > 0) {
                const successMessage = successes.length > 0 ? `${successes.length} records imported successfully.` : 'No records were imported.';
                const errorMessage = `\n\n${errors.length} records failed:\n- ${errors.slice(0, 20).join('\n- ')}${errors.length > 20 ? '\n- ...and more' : ''}`;
                openErrorModal('Import Complete with Errors', successMessage + errorMessage);
            } else {
                openConfirmationModal({
                    title: 'Import Successful',
                    message: `Successfully imported and processed ${successes.length} records.`,
                    confirmText: 'OK',
                    onConfirm: () => {},
                });
            }
    
        } catch (error) {
            console.error("Error during CSV import:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            openErrorModal('Import Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [activeView, organizations, stakeholders, statuses, intentLevels, needTypes, nonRevenueTags, closeImportModal, openErrorModal, openConfirmationModal]);


    const handleOpenAddNew = useCallback(() => {
        switch (activeView) {
            case 'connects':
                openConnectModal();
                break;
            case 'leads':
                openLeadModal();
                break;
            case 'startups':
                openEntityModal('organization', null, 'startup');
                break;
            case 'corporates':
                openEntityModal('organization', null, 'corporate');
                break;
            case 'stakeholders':
                openEntityModal('stakeholder');
                break;
            case 'admin':
                openEntityModal('stakeholder', null);
                break;
        }
    }, [activeView, openConnectModal, openLeadModal, openEntityModal]);

    const handleExport = useCallback(() => {
        if (displayedData.length === 0) {
            alert("There are no items to export in the current view.");
            return;
        }

        let csvContent = '';
        let filename = `${activeView}_export_${new Date().toISOString().split('T')[0]}.csv`;

        switch (activeView) {
            case 'connects':
                csvContent = exportConnectsToCSV(displayedData as Connect[], organizationsById, stakeholdersById, statusesById);
                break;
            case 'leads':
                csvContent = exportLeadsToCSV(displayedData as Lead[], stakeholdersById, intentLevelsById, needTypesById, nonRevenueTagsById);
                break;
            case 'startups':
            case 'corporates':
                csvContent = exportOrganizationsToCSV(displayedData as Organization[], stakeholdersById);
                break;
            case 'stakeholders':
                csvContent = exportStakeholdersToCSV(displayedData as Stakeholder[]);
                break;
            default:
                alert('Export is not available for this view.');
                return;
        }

        if (!csvContent) {
            alert('Failed to generate CSV content.');
            return;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    }, [activeView, displayedData, organizationsById, stakeholdersById, statusesById, intentLevelsById, needTypesById, nonRevenueTagsById]);

    const handleBulkAction = useCallback((action: 'export' | 'delete' | 'restore') => {
        const selectedItems = Array.from(selectedIds).map(id => allItemsById.get(id)).filter((item): item is Connect | Lead | Organization | Stakeholder => !!item);

        if (selectedItems.length === 0) {
            alert("No items selected for this action.");
            return;
        }

        if (action === 'export') {
            let csvContent = '';
            let filename = `${activeView}_selection_${new Date().toISOString().split('T')[0]}.csv`;
            switch (activeView) {
                case 'connects': csvContent = exportConnectsToCSV(selectedItems as Connect[], organizationsById, stakeholdersById, statusesById); break;
                case 'leads': csvContent = exportLeadsToCSV(selectedItems as Lead[], stakeholdersById, intentLevelsById, needTypesById, nonRevenueTagsById); break;
                case 'startups': case 'corporates': csvContent = exportOrganizationsToCSV(selectedItems as Organization[], stakeholdersById); break;
                case 'stakeholders': csvContent = exportStakeholdersToCSV(selectedItems as Stakeholder[]); break;
                default: return;
            }
            if (!csvContent) return;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if (action === 'delete' || action === 'restore') {
            const titleAction = action.charAt(0).toUpperCase() + action.slice(1);
            const isPermanentDelete = activeView === 'trash' && action === 'delete';

            openConfirmationModal({
                title: `${titleAction} ${selectedIds.size} items?`,
                message: `Are you sure you want to ${action} ${selectedIds.size} selected items?`,
                details: isPermanentDelete ? 'This action is permanent and cannot be undone.' : (action === 'delete' ? 'Items will be moved to trash.' : ''),
                confirmText: titleAction,
                onConfirm: async () => {
                    const batch = db.batch();
                    const connectsToPermanentlyDelete = [];

                    for (const item of selectedItems) {
                        const { collection, type } = getItemInfo(item);
                        if (collection === 'unknown') continue;

                        if (action === 'restore') {
                            batch.update(db.collection(collection).doc(item.id), { deletedAt: null });
                        } else if (action === 'delete') {
                            if (isPermanentDelete) {
                                if (type === 'Connect') {
                                    connectsToPermanentlyDelete.push(item.id);
                                } else {
                                    batch.delete(db.collection(collection).doc(item.id));
                                }
                            } else {
                                batch.update(db.collection(collection).doc(item.id), { deletedAt: new Date().toISOString() });
                            }
                        }
                    }
                    
                    await batch.commit();

                    // Handle cascading deletes for connects separately
                    for (const connectId of connectsToPermanentlyDelete) {
                        const deleteCascadeBatch = db.batch();
                        deleteCascadeBatch.delete(db.collection('connects').doc(connectId));
                        
                        const relatedActivities = await db.collection('activities').where('connectId', '==', connectId).get();
                        relatedActivities.forEach(doc => deleteCascadeBatch.delete(doc.ref));
                        
                        const relatedStories = await db.collection('successStories').where('connectId', '==', connectId).get();
                        relatedStories.forEach(doc => deleteCascadeBatch.delete(doc.ref));

                        await deleteCascadeBatch.commit();
                    }

                    clearSelection();
                }
            });
        }
    }, [activeView, selectedIds, allItemsById, clearSelection, organizationsById, stakeholdersById, statusesById, intentLevelsById, needTypesById, nonRevenueTagsById, openConfirmationModal]);


    // --- URL ROUTING ---
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#/', '');
            const validViews: ActiveView[] = ['connects', 'leads', 'startups', 'corporates', 'stakeholders', 'statistics', 'success', 'trash', 'admin'];
            if (validViews.includes(hash as ActiveView)) {
                handleSetActiveView(hash as ActiveView);
            } else {
                 handleSetActiveView('connects');
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [handleSetActiveView]);
    
    // --- CONTEXT VALUE ---
    const contextValue = useMemo(() => ({
        // Data
        connects, organizations, stakeholders, statuses, activities, successStories, leads, intentLevels, needTypes, nonRevenueTags, userSettings,
        // Derived Data
        organizationsById, stakeholdersById, statusesById, connectsById, activitiesById, activitiesByConnectId, activitiesByLeadId, leadsById, intentLevelsById, needTypesById, nonRevenueTagsById,
        connectToSuccessStoryMap, internalStakeholders, currentUserStakeholder,
        organizationUsageCount, stakeholderUsageCount, statusUsageCount, intentLevelUsageCount, needTypeUsageCount, organizationContacts, stakeholderOrgMap,
        displayedData, totalCountForView, activeFilterCount, dashboardStats,
        // UI State
        user, isLoading, activeView, viewMode, searchQuery, selectedIds, theme, filters, sortConfig, mainContainerRef,
        isConnectModalOpen, connectToEdit,
        isLeadModalOpen, leadToEdit,
        isEntityModalOpen, entityToEdit, entityType, defaultOrgType,
        viewingContact, isStatusModalOpen, isIntentLevelModalOpen, isNeedTypeModalOpen, isImportModalOpen, isSummaryModalOpen, summaryContent, isSummaryLoading,
        isSuccessStoryModalOpen, connectForStory,
        existingStory: connectForStory ? connectToSuccessStoryMap[connectForStory.id] : null,
        isDeletionGuardModalOpen, deletionGuardDetails,
        isOrgDeletionGuardModalOpen, orgDeletionDetails,
        isIndustryInsightsModalOpen, industryInsightsData, isIndustryInsightsLoading,
        isActivityModalOpen, parentIdForActivity, parentTypeForActivity, activityToEdit,
        isActivityHistoryModalOpen, parentIdForHistory, parentTypeForHistory,
        isConfirmationModalOpen, confirmationModalConfig,
        isErrorModalOpen, errorModalContent,
        // Actions
        actions: {
            setTheme: handleSetTheme, setActiveView: handleSetActiveView, setSearchQuery, setViewMode,
            handleSort, handleFilterChange, handleSelect, handleSelectAll, clearSelection, saveColumnWidths,
            openConnectModal, closeConnectModal, saveConnect, deleteConnect, quickStatusUpdate,
            openLeadModal, closeLeadModal, saveLead, deleteLead,
            openActivityModal, closeActivityModal, saveActivity, deleteActivity,
            openActivityHistoryModal, closeActivityHistoryModal,
            openEntityModal, closeEntityModal, saveEntity, deleteEntity,
            openStatusModal, closeStatusModal, saveStatus, deleteStatus,
            openIntentLevelModal, closeIntentLevelModal, saveIntentLevel, deleteIntentLevel,
            openNeedTypeModal, closeNeedTypeModal, saveNeedType, deleteNeedType,
            openSuccessStoryModal, closeSuccessStoryModal, saveSuccessStory, deleteSuccessStory,
            restoreTrashedItem, deleteTrashedItemPermanently,
            openContact, closeContact, openImportModal, closeImportModal, handleFileImport,
            generateSummary, closeSummaryModal, generateIndustryInsights, closeIndustryInsightsModal,
            closeDeletionGuardModal, closeOrgDeletionGuardModal,
            openConfirmationModal, closeConfirmationModal,
            openErrorModal, closeErrorModal,
            handleOpenAddNew, handleExport, handleBulkAction,
            getRequiredHeaders: getRequiredHeadersForView,
            getHeaderDisclaimer: getHeaderDisclaimerForView,
        }
    }), [
        // This dependency array is long, but it's what makes the context efficient.
        connects, organizations, stakeholders, statuses, activities, successStories, leads, intentLevels, needTypes, nonRevenueTags, userSettings,
        organizationsById, stakeholdersById, statusesById, connectsById, activitiesById, activitiesByConnectId, activitiesByLeadId, leadsById, intentLevelsById, needTypesById, nonRevenueTagsById,
        connectToSuccessStoryMap, internalStakeholders, currentUserStakeholder,
        organizationUsageCount, stakeholderUsageCount, statusUsageCount, intentLevelUsageCount, needTypeUsageCount, organizationContacts, stakeholderOrgMap,
        displayedData, totalCountForView, activeFilterCount, dashboardStats,
        user, isLoading, activeView, viewMode, searchQuery, selectedIds, theme, filters, sortConfig, mainContainerRef,
        isConnectModalOpen, connectToEdit, isLeadModalOpen, leadToEdit,
        isEntityModalOpen, entityToEdit, entityType, defaultOrgType,
        viewingContact, isStatusModalOpen, isIntentLevelModalOpen, isNeedTypeModalOpen, isImportModalOpen, isSummaryModalOpen, summaryContent, isSummaryLoading,
        isSuccessStoryModalOpen, connectForStory, isDeletionGuardModalOpen, deletionGuardDetails,
        isOrgDeletionGuardModalOpen, orgDeletionDetails,
        isIndustryInsightsModalOpen, industryInsightsData, isIndustryInsightsLoading, isActivityModalOpen, parentIdForActivity, parentTypeForActivity, activityToEdit,
        isActivityHistoryModalOpen, parentIdForHistory, parentTypeForHistory,
        isConfirmationModalOpen, confirmationModalConfig, isErrorModalOpen, errorModalContent,
        handleSetTheme, handleSetActiveView, handleSort, handleFilterChange, handleSelect, handleSelectAll, clearSelection, saveColumnWidths,
        openConnectModal, closeConnectModal, saveConnect, deleteConnect, quickStatusUpdate,
        openLeadModal, closeLeadModal, saveLead, deleteLead,
        openActivityModal, closeActivityModal, saveActivity, deleteActivity,
        openActivityHistoryModal, closeActivityHistoryModal,
        openEntityModal, closeEntityModal, saveEntity, deleteEntity,
        openStatusModal, closeStatusModal, saveStatus, deleteStatus,
        openIntentLevelModal, closeIntentLevelModal, saveIntentLevel, deleteIntentLevel,
        openNeedTypeModal, closeNeedTypeModal, saveNeedType, deleteNeedType,
        openSuccessStoryModal, closeSuccessStoryModal, saveSuccessStory, deleteSuccessStory,
        restoreTrashedItem, deleteTrashedItemPermanently,
        openContact, closeContact, openImportModal, closeImportModal, handleFileImport,
        generateSummary, closeSummaryModal, generateIndustryInsights, closeIndustryInsightsModal, closeDeletionGuardModal,
        closeOrgDeletionGuardModal,
        openConfirmationModal, closeConfirmationModal, openErrorModal, closeErrorModal,
        handleOpenAddNew, handleExport, handleBulkAction
    ]);

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// --- HOOK FOR CONSUMING CONTEXT ---
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};