
import React from 'react';
import { Lead } from '../types';
import { LeadsListView } from '../components/LeadsListView';
import { useAppContext } from '../contexts/AppContext';
import { LeadCard } from '../components/LeadCard';

export const LeadsPage: React.FC = () => {
    const { displayedData, viewMode } = useAppContext();
    const leads = displayedData as Lead[];

    if (leads.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400">No leads found.</p>
                </div>
            </div>
        )
    }

    return viewMode === 'card' ? (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
            </div>
        </div>
    ) : (
        <div className="flex-1 min-h-0">
            <LeadsListView leads={leads} />
        </div>
    );
};
