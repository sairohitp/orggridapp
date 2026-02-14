import React from 'react';
import { Connect, Lead, Organization, Stakeholder } from '../types';
import { HiArrowPath, HiTrash } from 'react-icons/hi2';
import { CustomCheckbox, SortableHeader } from './Table';
import { useAppContext } from '../contexts/AppContext';
import { getItemInfo } from '../utils';

type TrashedItem = (Connect | Lead | Organization | Stakeholder) & { deletedAt: string | null };

interface TrashRowProps {
    item: TrashedItem;
}

const TrashRow = React.memo<TrashRowProps>(({ item }) => {
    const { selectedIds, actions } = useAppContext();
    const isSelected = selectedIds.has(item.id);
    const { name, type } = getItemInfo(item);

    return (
        <tr className={`text-sm group transition-colors duration-150 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'}`}>
            <td className="px-4 py-3 w-16"><CustomCheckbox id={`select-${item.id}`} checked={isSelected} onChange={() => actions.handleSelect(item.id)} /></td>
            <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100 whitespace-normal break-words">{name}</td>
            <td className="px-4 py-3 w-40">{type}</td>
            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap w-48">{item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : 'N/A'}</td>
            <td className="px-4 py-3 w-32">
                <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
                    <button onClick={() => actions.restoreTrashedItem(item)} title="Restore" className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-full transition-colors"><HiArrowPath className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteTrashedItemPermanently(item)} title="Delete Permanently" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                </div>
            </td>
        </tr>
    );
});

interface TrashListViewProps {
    items: TrashedItem[];
}

export const TrashListView: React.FC<TrashListViewProps> = ({ items }) => {
    const { selectedIds, actions } = useAppContext();
    const isAllSelected = selectedIds.size > 0 && selectedIds.size === items.length;

    return (
        <div className="h-full flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto no-scrollbar">
                <table className="min-w-full border-collapse table-fixed">
                    <thead className="sticky top-0 bg-slate-100/95 dark:bg-slate-900/70 backdrop-blur-sm border-b-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left w-16">
                                <CustomCheckbox id="select-all-header" checked={isAllSelected} onChange={(e) => actions.handleSelectAll(e, items)} />
                            </th>
                            <th className="px-4 py-3 text-left">
                                <SortableHeader title="Name" sortKey={'name'} sortConfig={{key: 'name', direction: 'ascending'}} onSort={() => {}} />
                            </th>
                             <th className="px-4 py-3 text-left w-40">
                                Type
                            </th>
                             <th className="px-4 py-3 text-left w-48">
                                <SortableHeader title="Date Deleted" sortKey={'deletedAt'} sortConfig={{key: 'deletedAt', direction: 'descending'}} onSort={() => {}} />
                            </th>
                            <th className="px-4 py-3 text-left w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                        {items.map((item) => <TrashRow key={item.id} item={item} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};