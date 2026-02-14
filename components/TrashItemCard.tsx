import React from 'react';
import { Connect, Lead, Organization, Stakeholder } from '../types';
import { HiArrowPath, HiTrash } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';
import { getItemInfo } from '../utils';

type TrashedItem = (Connect | Lead | Organization | Stakeholder) & { deletedAt: string | null };

interface TrashItemCardProps {
  item: TrashedItem;
}

export const TrashItemCard: React.FC<TrashItemCardProps> = ({ item }) => {
    const { actions } = useAppContext();
    const { name, type, icon } = getItemInfo(item);
    // FIX: Render icon component from props returned by getItemInfo, which no longer returns JSX to avoid syntax errors in the .ts file.
    const IconComponent = icon.component;

    return (
        <div className="bg-white dark:bg-slate-800/50 border rounded-lg shadow-sm flex flex-col justify-between transition-all duration-300 border-slate-200 dark:border-slate-700 hover:shadow-md">
            <div className="p-4">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                        <IconComponent className={icon.className} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{type}</p>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate pr-4">{name}</h3>
                         <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                            Deleted on {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'Unknown Date'}
                        </p>
                    </div>
                </div>
            </div>

             <div className="flex justify-end items-center border-t border-slate-200 dark:border-slate-700/50 px-4 py-2 mt-auto rounded-b-lg bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex gap-1">
                    <button onClick={() => actions.restoreTrashedItem(item)} title="Restore" className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-full transition-colors"><HiArrowPath className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteTrashedItemPermanently(item)} title="Delete Permanently" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    );
};