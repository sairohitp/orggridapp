
import React from 'react';
import { Button } from './Button';
import { HiXMark, HiExclamationTriangle, HiLink, HiBuildingOffice2, HiOutlineDocumentText } from 'react-icons/hi2';
import { StructuredUsageDetail } from '../types';
import { useAppContext } from '../contexts/AppContext';

export const DeletionGuardModal: React.FC = () => {
    const { deletionGuardDetails, actions } = useAppContext();

    if (!deletionGuardDetails) {
        return null;
    }

    const { stakeholderName, usage } = deletionGuardDetails;

    const RoleIcon = ({ type }: { type: StructuredUsageDetail['recordType'] }) => {
        switch (type) {
            case 'Connect':
                return <HiLink className="w-5 h-5 text-slate-400 flex-shrink-0" />;
            case 'Organization':
                return <HiBuildingOffice2 className="w-5 h-5 text-slate-400 flex-shrink-0" />;
            case 'Activity':
                return <HiOutlineDocumentText className="w-5 h-5 text-slate-400 flex-shrink-0" />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                <button onClick={actions.closeDeletionGuardModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <HiXMark className="w-6 h-6"/>
                </button>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                        <HiExclamationTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Cannot Delete Stakeholder</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            <span className="font-bold text-slate-600 dark:text-slate-300">{stakeholderName}</span> is currently linked to the following records.
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Please edit these records to remove this stakeholder before attempting to delete them again.</p>
                    </div>
                </div>

                <div className="mt-6 max-h-64 overflow-y-auto no-scrollbar border-t border-b border-slate-200 dark:border-slate-700 -mx-8 px-8 py-4">
                    <ul className="space-y-3">
                        {usage.map((detail, index) => (
                            <li key={index} className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                <RoleIcon type={detail.recordType} />
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{detail.recordName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{detail.role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="flex justify-end mt-8">
                    <Button type="button" onClick={actions.closeDeletionGuardModal}>
                        Understood
                    </Button>
                </div>
            </div>
        </div>
    );
};