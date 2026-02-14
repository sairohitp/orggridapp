
import React from 'react';
import { Stakeholder, StakeholderAffiliation, SortConfig } from '../types';
import { EntityListView, EntityColumn } from '../components/EntityListView';
import { useAppContext } from '../contexts/AppContext';

const PermissionTag: React.FC<{ affiliation: StakeholderAffiliation }> = ({ affiliation }) => {
    const isAdmin = affiliation === 'internal';
    const color = isAdmin ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 ring-indigo-500/20' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 ring-slate-500/20';
    const text = isAdmin ? 'Admin' : 'User';
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${color}`}>
            {text}
        </span>
    );
};

export const AdminPage: React.FC = () => {
    const {
        displayedData,
        selectedIds,
        sortConfig,
        currentUserStakeholder,
        actions
    } = useAppContext();

    if (currentUserStakeholder?.affiliation !== 'internal') {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Access Denied</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }
    
    const stakeholders = displayedData as Stakeholder[];

    const handleEdit = (stakeholder: Stakeholder) => {
        actions.openEntityModal('stakeholder', stakeholder);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.handleSelectAll(e, stakeholders);
    };
    
    const isAllSelected = stakeholders.length > 0 && selectedIds.size === stakeholders.length;

    // FIX: Updated column definitions to match the `EntityColumn` type. Replaced incorrect string `width` properties with `resizable: true` and added the required placeholder columns for checkboxes and actions.
    const columns: EntityColumn<Stakeholder>[] = [
        { header: '', sortKey: undefined, resizable: false, width: 60, render: () => null },
        { header: 'Name', sortKey: 'name', resizable: true, render: (i) => <span className="font-semibold block truncate">{i.name}</span> },
        { header: 'Email', sortKey: 'email', resizable: true, render: (i) => <span className="block truncate">{i.email}</span> },
        { header: 'Permissions', sortKey: 'affiliation', resizable: true, render: (i) => <PermissionTag affiliation={i.affiliation} /> },
        { header: 'Actions', sortKey: undefined, resizable: false, width: 128, render: () => null },
    ];

    return (
        <div className="flex-1 min-h-0">
            <EntityListView
                items={stakeholders}
                columns={columns}
                isSelected={(id) => selectedIds.has(id)}
                onSelect={actions.handleSelect}
                onEdit={handleEdit}
                onDelete={actions.deleteEntity}
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
                sortConfig={sortConfig}
                onSort={actions.handleSort}
            />
        </div>
    );
};
