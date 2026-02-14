
import React from 'react';
import { Connect, Lead, Organization, Stakeholder } from '../types';
import { TrashItemCard } from '../components/TrashItemCard';
import { TrashListView } from '../components/TrashListView';
import { useAppContext } from '../contexts/AppContext';

export const TrashPage: React.FC = () => {
    const { displayedData, viewMode } = useAppContext();
    const trashedItems = displayedData as ((Connect | Lead | Organization | Stakeholder) & { deletedAt: string | null })[];

    if (trashedItems.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400">The trash is empty.</p>
                </div>
            </div>
        )
    }

    return viewMode === 'card' ? (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {trashedItems.map(item => (
                    <TrashItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    ) : (
        <div className="flex-1 min-h-0">
            <TrashListView items={trashedItems} />
        </div>
    );
};