
import React from 'react';
import { Button } from './Button';
import { HiXMark, HiExclamationTriangle, HiLink } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

export const OrganizationDeletionGuardModal: React.FC = () => {
    const { orgDeletionDetails, statusesById, actions } = useAppContext();

    if (!orgDeletionDetails) {
        return null;
    }

    const { organizationName, connects } = orgDeletionDetails;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                <button onClick={actions.closeOrgDeletionGuardModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <HiXMark className="w-6 h-6"/>
                </button>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                        <HiExclamationTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Cannot Delete Organization</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            <span className="font-bold text-slate-600 dark:text-slate-300">{organizationName}</span> is currently linked to {connects.length} connect(s).
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Please edit or delete these connects before attempting to delete the organization again.</p>
                    </div>
                </div>

                <div className="mt-6 max-h-64 overflow-y-auto no-scrollbar border-t border-b border-slate-200 dark:border-slate-700 -mx-8 px-8 py-4">
                    <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Linked Connects</h4>
                    <ul className="space-y-3">
                        {connects.map((connect) => (
                            <li key={connect.id} className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                <HiLink className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{connect.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Status: {statusesById[connect.statusId]?.name || 'Unknown'}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="flex justify-end mt-8">
                    <Button type="button" onClick={actions.closeOrgDeletionGuardModal}>
                        Understood
                    </Button>
                </div>
            </div>
        </div>
    );
};
