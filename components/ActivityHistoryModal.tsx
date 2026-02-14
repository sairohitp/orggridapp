


import React, { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from './Button';
import { ActivityTimeline } from './ActivityTimeline';
import { HiXMark, HiOutlineClock } from 'react-icons/hi2';
import { Connect, Lead } from '../types';

export const ActivityHistoryModal: React.FC = () => {
    const { 
        isActivityHistoryModalOpen,
        parentIdForHistory,
        parentTypeForHistory,
        connectsById,
        leadsById,
        actions 
    } = useAppContext();

    const parentRecord = useMemo(() => {
        if (!parentIdForHistory) return null;
        return parentTypeForHistory === 'connect' ? connectsById[parentIdForHistory] : leadsById[parentIdForHistory];
    }, [parentIdForHistory, parentTypeForHistory, connectsById, leadsById]);

    if (!isActivityHistoryModalOpen || !parentIdForHistory || !parentTypeForHistory) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] flex flex-col p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                <button onClick={actions.closeActivityHistoryModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <HiXMark className="w-6 h-6"/>
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                    <HiOutlineClock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Activity Timeline</h2>
                    <p className="text-slate-500 dark:text-slate-400 truncate max-w-md">For {parentTypeForHistory}: "{(parentRecord as Connect)?.title || (parentRecord as Lead)?.name || 'Loading...'}"</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar -mx-8 px-8">
                    <ActivityTimeline parentId={parentIdForHistory} parentType={parentTypeForHistory} />
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <Button type="button" variant="secondary" onClick={actions.closeActivityHistoryModal}>Close</Button>
                </div>
            </div>
        </div>
    );
};