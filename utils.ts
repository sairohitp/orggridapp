

import React from 'react';
import { Connect, Organization, Stakeholder, Status, ActiveView, Lead, IntentLevel, NeedType, NonRevenueTag } from './types';
import { HiOutlineDocumentText, HiOutlineLightBulb, HiOutlineBuildingOffice2, HiOutlineUser } from 'react-icons/hi2';

// --- Helper Functions ---
export const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const get = (obj: any, path: string | string[], defaultValue: any = undefined) => {
    const pathArray = Array.isArray(path) ? path : path.split('.').filter(i => i.length);
    if (!pathArray.length) {
      return obj === undefined ? defaultValue : obj;
    }
    const result = pathArray.reduce((acc, key) => acc && acc[key], obj);
    return result === undefined ? defaultValue : result;
};

export const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

export const getRequiredHeadersForView = (view: ActiveView): string[] => {
    switch(view) {
        case 'connects':
            return ['Title', 'Startup Name', 'Corporate Name', 'Owner Email', 'Status Name']; // Optional: Connect ID, Date, Startup Contact Emails, Corporate Contact Emails
        case 'leads':
            return ['Name', 'Owner Email', 'Intent Level', 'Need Type']; // Optional: Lead ID, Organization Type, Source, etc.
        case 'startups':
        case 'corporates':
            return ['Name']; // Optional: Organization ID, Owner Email, Contact Emails
        case 'stakeholders':
            return ['Name', 'Email', 'Affiliation']; // Optional: Stakeholder ID, Role, Phone
        default:
            return [];
    }
};

export const getHeaderDisclaimerForView = (view: ActiveView): string => {
    const idDisclaimer = "To update an existing record, include its ID in a column named 'Connect ID', 'Lead ID', 'Organization ID', or 'Stakeholder ID'. If the ID column is omitted or the ID is not found, a new record will be created.";
    switch(view) {
        case 'connects':
            return `Referenced Organizations (by name), Stakeholders (by email), and Statuses (by name) must exist. For multiple contacts, separate emails with a semicolon (;). ${idDisclaimer}`;
        case 'leads':
            return `The owner of the lead (by 'Owner Email'), 'Intent Level' (by name), and 'Need Type' (by name) must exist in the system. For multiple 'Non-Revenue Value' tags, separate them with a semicolon (;). ${idDisclaimer}`;
        case 'startups':
        case 'corporates':
            return `"Name" must be unique for new records. For multiple contacts, separate emails with a semicolon (;). ${idDisclaimer}`;
        case 'stakeholders':
            return `"Email" must be unique for new records. "Affiliation" must be one of: internal, startup, corporate. ${idDisclaimer}`;
        default:
            return 'This view does not support imports.';
    }
};

// FIX: Changed getItemInfo to not use JSX, as this is a .ts file. It now returns the component and props. This resolves a syntax error that prevented the entire file from being parsed correctly, which in turn fixes all subsequent export/import errors.
export const getItemInfo = (item: any): { type: string, collection: string, name: string, icon: { component: React.ElementType, className: string } } => {
    if ('title' in item && 'startupId' in item) return { type: 'Connect', collection: 'connects', name: item.title, icon: { component: HiOutlineDocumentText, className: "w-6 h-6 text-slate-500" } };
    if ('intentLevelId' in item) return { type: 'Lead', collection: 'leads', name: item.name, icon: { component: HiOutlineLightBulb, className: "w-6 h-6 text-yellow-500" } };
    if ('affiliation' in item) return { type: 'Contact', collection: 'stakeholders', name: item.name, icon: { component: HiOutlineUser, className: "w-6 h-6 text-blue-500" } };
    if ('type' in item && ('contactIds' in item || 'ownerId' in item)) return { type: 'Organization', collection: 'organizations', name: item.name, icon: { component: HiOutlineBuildingOffice2, className: "w-6 h-6 text-purple-500" } };
    return { type: 'Item', collection: 'unknown', name: 'Unknown Item', icon: { component: HiOutlineDocumentText, className: "w-6 h-6 text-slate-500" } };
};


const sanitizeCSVField = (field: any) => `"${String(field ?? '').replace(/"/g, '""')}"`;

export const exportConnectsToCSV = (
  connects: Connect[], 
  organizationsById: Record<string, Organization>, 
  stakeholdersById: Record<string, Stakeholder>,
  statusesById: Record<string, Status>
): string => {
  if (connects.length === 0) return '';
  const headers = [
    'Connect ID', 'Title', 'Date', 'Status Name',
    'Owner Name', 'Owner Email',
    'Startup Name', 'Corporate Name',
    'Startup Contact Emails',
    'Corporate Contact Emails',
  ];
  
  const getContactEmails = (contactIds: string[]) => {
      return contactIds.map(id => stakeholdersById[id]?.email).filter(Boolean).join(';');
  };

  const rows = connects.map(c => {
    const owner = stakeholdersById[c.ownerId];
    const startup = organizationsById[c.startupId];
    const corporate = organizationsById[c.corporateId];
    const status = statusesById[c.statusId];
    
    return [
      c.id, c.title, new Date(c.date).toISOString(), status?.name,
      owner?.name, owner?.email,
      startup?.name, corporate?.name,
      getContactEmails(c.startupContactIds || []),
      getContactEmails(c.corporateContactIds || []),
    ].map(sanitizeCSVField).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

export const exportOrganizationsToCSV = (
    organizations: Organization[],
    stakeholdersById: Record<string, Stakeholder>
): string => {
    if (organizations.length === 0) return '';
    const headers = ['Organization ID', 'Name', 'Type', 'Owner Email', 'Contact Emails'];
    
    const rows = organizations.map(org => {
        const ownerEmail = org.ownerId ? stakeholdersById[org.ownerId]?.email : '';
        const contactEmails = (org.contactIds || [])
            .map(id => stakeholdersById[id]?.email)
            .filter(Boolean)
            .join(';');
        
        return [
            org.id,
            org.name,
            org.type,
            ownerEmail,
            contactEmails
        ].map(sanitizeCSVField).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
};

export const exportStakeholdersToCSV = (stakeholders: Stakeholder[]): string => {
    if (stakeholders.length === 0) return '';
    const headers = ['Stakeholder ID', 'Name', 'Role', 'Email', 'Phone', 'Affiliation'];
    
    const rows = stakeholders.map(stakeholder => {
        return [
            stakeholder.id,
            stakeholder.name,
            stakeholder.role,
            stakeholder.email,
            stakeholder.phone,
            stakeholder.affiliation
        ].map(sanitizeCSVField).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
};

export const exportLeadsToCSV = (
    leads: Lead[],
    stakeholdersById: Record<string, Stakeholder>,
    intentLevelsById: Record<string, IntentLevel>,
    needTypesById: Record<string, NeedType>,
    nonRevenueTagsById: Record<string, NonRevenueTag>
): string => {
    if (leads.length === 0) return '';
    const headers = ['Lead ID', 'Name', 'Organization Type', 'Source', 'Intent Level', 'Need Type', 'Revenue Potential (₹)', 'Non-Revenue Value', 'Owner Email', 'Comments'];
    
    const rows = leads.map(lead => {
        const ownerEmail = stakeholdersById[lead.ownerId]?.email || '';
        const intentLevelName = intentLevelsById[lead.intentLevelId]?.name || '';
        const needTypeName = needTypesById[lead.needTypeId]?.name || '';
        const nonRevenueValueTags = (lead.nonRevenueTagIds || [])
            .map(id => nonRevenueTagsById[id]?.name)
            .filter(Boolean)
            .join(';');
        return [
            lead.id,
            lead.name,
            lead.organizationType,
            lead.source,
            intentLevelName,
            needTypeName,
            lead.revenuePotential,
            nonRevenueValueTags,
            ownerEmail,
            lead.comments
        ].map(sanitizeCSVField).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
};

// --- New Local CSV Parser ---

const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // This is an escaped quote
                currentField += '"';
                i++; // Skip the next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(currentField.trim());
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField.trim());
    return result.map(field => field.replace(/^"|"$/g, '').replace(/""/g, '"'));
};


export const parseCsvData = async (
    csvText: string,
    entityType: 'connects' | 'startups' | 'corporates' | 'stakeholders' | 'leads',
    context: {
        organizations: Organization[],
        stakeholders: Stakeholder[],
        statuses: Status[],
        intentLevels: IntentLevel[],
        needTypes: NeedType[],
        nonRevenueTags: NonRevenueTag[],
    }
): Promise<any[]> => {
    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) throw new Error("CSV file must have a header row and at least one data row.");

    const rawHeaders = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase());
    const requiredHeaders = getRequiredHeadersForView(entityType).map(h => h.toLowerCase());

    for (const requiredHeader of requiredHeaders) {
        if (!rawHeaders.includes(requiredHeader)) {
            const originalCaseHeader = getRequiredHeadersForView(entityType).find(h => h.toLowerCase() === requiredHeader);
            throw new Error(`Your CSV is missing the required header: "${originalCaseHeader}"`);
        }
    }

    const headerMap = Object.fromEntries(rawHeaders.map((h, i) => [h, i]));
    const dataRows = lines.slice(1);
    const parsedData: any[] = [];

    const stakeholdersByEmail = Object.fromEntries(context.stakeholders.map(s => [s.email.toLowerCase(), s]));
    const organizationsByName = Object.fromEntries(context.organizations.map(o => [o.name.toLowerCase(), o]));
    const statusesByName = Object.fromEntries(context.statuses.map(s => [s.name.toLowerCase(), s]));
    const intentLevelsByName = Object.fromEntries(context.intentLevels.map(i => [i.name.toLowerCase(), i]));
    const needTypesByName = Object.fromEntries(context.needTypes.map(n => [n.name.toLowerCase(), n]));
    const nonRevenueTagsByName = Object.fromEntries(context.nonRevenueTags.map(t => [t.name.toLowerCase(), t]));
    
    const getVal = (values: string[], key: string) => values[headerMap[key.toLowerCase()]] || '';
    const getIdsFromEmails = (emailString: string) => {
        return emailString.split(';')
            .map(email => email.trim().toLowerCase())
            .map(email => stakeholdersByEmail[email]?.id)
            .filter((id): id is string => !!id);
    };
    const getTagIdsFromNames = (tagString: string) => {
        return tagString.split(';')
            .map(name => name.trim().toLowerCase())
            .map(name => nonRevenueTagsByName[name]?.id)
            .filter((id): id is string => !!id);
    };

    for (const line of dataRows) {
        if (!line.trim()) continue;
        const values = parseCsvLine(line);
        try {
            switch (entityType) {
                case 'stakeholders':
                    parsedData.push({
                        id: getVal(values, 'Stakeholder ID'),
                        name: getVal(values, 'Name'),
                        email: getVal(values, 'Email'),
                        affiliation: getVal(values, 'Affiliation'),
                        role: getVal(values, 'Role'),
                        phone: getVal(values, 'Phone'),
                    });
                    break;
                case 'startups':
                case 'corporates':
                    parsedData.push({
                        id: getVal(values, 'Organization ID'),
                        name: getVal(values, 'Name'),
                        type: entityType === 'startups' ? 'startup' : 'corporate',
                        ownerId: stakeholdersByEmail[getVal(values, 'Owner Email').toLowerCase()]?.id || '',
                        contactIds: getIdsFromEmails(getVal(values, 'Contact Emails')),
                    });
                    break;
                case 'leads':
                    parsedData.push({
                        id: getVal(values, 'Lead ID'),
                        name: getVal(values, 'Name'),
                        organizationType: getVal(values, 'Organization Type') || 'startup',
                        source: getVal(values, 'Source'),
                        intentLevelId: intentLevelsByName[getVal(values, 'Intent Level').toLowerCase()]?.id,
                        needTypeId: needTypesByName[getVal(values, 'Need Type').toLowerCase()]?.id,
                        revenuePotential: parseFloat(getVal(values, 'Revenue Potential (₹)')) || 0,
                        nonRevenueTagIds: getTagIdsFromNames(getVal(values, 'Non-Revenue Value')),
                        ownerId: stakeholdersByEmail[getVal(values, 'Owner Email').toLowerCase()]?.id,
                        comments: getVal(values, 'Comments'),
                    });
                    break;
                case 'connects':
                    parsedData.push({
                        id: getVal(values, 'Connect ID'),
                        title: getVal(values, 'Title'),
                        date: getVal(values, 'Date') ? new Date(getVal(values, 'Date')).toISOString() : new Date().toISOString(),
                        startupId: organizationsByName[getVal(values, 'Startup Name').toLowerCase()]?.id,
                        corporateId: organizationsByName[getVal(values, 'Corporate Name').toLowerCase()]?.id,
                        ownerId: stakeholdersByEmail[getVal(values, 'Owner Email').toLowerCase()]?.id,
                        statusId: statusesByName[getVal(values, 'Status Name').toLowerCase()]?.id,
                        startupContactIds: getIdsFromEmails(getVal(values, 'Startup Contact Emails')),
                        corporateContactIds: getIdsFromEmails(getVal(values, 'Corporate Contact Emails')),
                    });
                    break;
            }
        } catch (error) {
            console.warn(`Skipping a row due to parsing error: ${line}`, error);
        }
    }

    return parsedData;
};