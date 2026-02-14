
import React from 'react';
import { Organization, Stakeholder, StakeholderAffiliation, Entity, EntityType } from '../types';
import { EntityListView, EntityColumn } from '../components/EntityListView';
import { ContactPillGroup } from '../components/ContactViews';
import { useAppContext } from '../contexts/AppContext';

const AffiliationTag: React.FC<{ affiliation: StakeholderAffiliation }> = ({ affiliation }) => {
    const colors: Record<StakeholderAffiliation, string> = {
      internal: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 ring-blue-500/20',
      startup: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 ring-green-600/20',
      corporate: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 ring-purple-600/20',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${colors[affiliation]}`}>
        {affiliation.charAt(0).toUpperCase() + affiliation.slice(1)}
      </span>
    );
};

export const EntitiesPage: React.FC = () => {
    const { 
        activeView, 
        displayedData,
        stakeholdersById, 
        organizationUsageCount, 
        stakeholderUsageCount,
        organizationContacts, 
        stakeholderOrgMap,
        selectedIds,
        sortConfig,
        actions
    } = useAppContext();
    
    const items = displayedData as Entity[];
    const isAllSelected = items.length > 0 && selectedIds.size === items.length;

    const handleEdit = (item: Entity) => {
        const entityType: EntityType = activeView === 'stakeholders' ? 'stakeholder' : 'organization';
        actions.openEntityModal(entityType, item);
    };

    const handleGenerateInsights = (item: Entity) => {
        if ('type' in item) { // Type guard for Organization
            actions.generateIndustryInsights(item.id);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.handleSelectAll(e, items);
    };

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400">No items found.</p>
                </div>
            </div>
        )
    }

    const getColumns = (): EntityColumn<any>[] => {
        const baseColumns = [
            { header: '', sortKey: undefined, resizable: false, width: 60, render: () => null },
        ];
        const actionColumn = { header: 'Actions', sortKey: undefined, resizable: false, width: 128, render: () => null };

        switch (activeView) {
            case 'startups':
            case 'corporates':
                return [
                    ...baseColumns,
                    { header: 'Name', sortKey: 'name', resizable: true, render: (i: Organization) => <span className="font-semibold block truncate">{i.name}</span> },
                    { 
                        header: 'Contacts', 
                        resizable: true,
                        render: (i: Organization) => {
                            const contactIds = organizationContacts[i.id] || [];
                            const contacts = contactIds.map(id => stakeholdersById[id]);
                            return <ContactPillGroup contacts={contacts} onContactClick={actions.openContact} />;
                        } 
                    },
                    { 
                        header: 'Owner',
                        sortKey: 'owner.name',
                        resizable: true,
                        render: (i: Organization) => {
                            const owner = i.ownerId ? stakeholdersById[i.ownerId] : undefined;
                            return owner ? <ContactPillGroup contacts={[owner]} onContactClick={actions.openContact} /> : <span className="text-slate-400 dark:text-slate-500">N/A</span>;
                        }
                    },
                    { 
                        header: 'Connects',
                        sortKey: 'connects',
                        resizable: true,
                        render: (i: Organization) => <span className="font-medium text-center block">{organizationUsageCount[i.id] || 0}</span> 
                    },
                    actionColumn
                ];
            case 'stakeholders':
                return [
                    ...baseColumns,
                    { header: 'Name', sortKey: 'name', resizable: true, render: (i: Stakeholder) => <span className="font-semibold block truncate">{i.name}</span> },
                    { header: 'Role', sortKey: 'role', resizable: true, render: (i: Stakeholder) => <span className="block truncate">{i.role}</span> },
                    { 
                      header: 'Organization', 
                      sortKey: 'organization.name',
                      resizable: true,
                      render: (i: Stakeholder) => {
                        const orgName = stakeholderOrgMap[i.id];
                        return orgName ? <span className="font-medium block truncate">{orgName}</span> : <span className="text-slate-400 dark:text-slate-500">N/A</span>;
                      }
                    },
                    { header: 'Affiliation', sortKey: 'affiliation', resizable: true, render: (i: Stakeholder) => <AffiliationTag affiliation={i.affiliation} /> },
                    { header: 'Email', sortKey: 'email', resizable: true, render: (i: Stakeholder) => <button type="button" onClick={() => window.location.href = `mailto:${i.email}`} className="text-indigo-600 hover:underline dark:text-indigo-400 block truncate text-left w-full">{i.email}</button> },
                    { header: 'Records Linked', sortKey: 'recordsLinked', resizable: true, render: (i: Stakeholder) => <span className="font-medium text-center block">{stakeholderUsageCount[i.id] || 0}</span> },
                    actionColumn
                ];
            default:
                return [];
        }
    };
    
    return (
        <div className="flex-1 min-h-0">
            <EntityListView
                items={items}
                columns={getColumns()}
                isSelected={(id) => selectedIds.has(id)}
                onSelect={actions.handleSelect}
                onEdit={handleEdit}
                onDelete={actions.deleteEntity}
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
                sortConfig={sortConfig}
                onSort={actions.handleSort}
                onGenerateInsights={handleGenerateInsights}
            />
        </div>
    );
};