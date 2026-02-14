
import React from 'react';
import { Connect } from '../types';
import { ConnectCard } from '../components/ConnectCard';
import { ConnectsListView } from '../components/ConnectsListView';
import { useAppContext } from '../contexts/AppContext';

export const ConnectsPage: React.FC = () => {
    const { displayedData, viewMode } = useAppContext();
    const connects = displayedData as Connect[];

    if (connects.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400">No connects found.</p>
                </div>
            </div>
        )
    }

    return viewMode === 'card' ? (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {connects.map(connect => (
                    <ConnectCard key={connect.id} connect={connect} />
                ))}
            </div>
        </div>
    ) : (
        <div className="flex-1 min-h-0">
            <ConnectsListView connects={connects} />
        </div>
    );
};
