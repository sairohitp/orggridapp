
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Connect } from '../types';
import { HiPencil, HiTrash, HiStar, HiSparkles, HiOutlineClock, HiPlus } from 'react-icons/hi2';
import { ContactPillGroup } from './ContactViews';
import { CustomCheckbox, SortableHeader, Resizer } from './Table';
import { StatusControl } from './StatusControl';
import { useAppContext } from '../contexts/AppContext';

interface ConnectRowProps {
    connect: Connect;
}

const ConnectRow = React.memo<ConnectRowProps>(({ connect }) => {
    const { 
        stakeholdersById, organizationsById, statuses, statusesById, 
        selectedIds, activitiesByConnectId, connectToSuccessStoryMap, actions 
    } = useAppContext();
    
    const isSelected = selectedIds.has(connect.id);
    const hasSuccessStory = !!connectToSuccessStoryMap[connect.id];
    const activities = activitiesByConnectId[connect.id] || [];
    const hasActivities = activities.length > 0;

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <tr className={`text-sm group transition-colors duration-150 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'}`}>
            <td className="px-4 py-3"><CustomCheckbox id={`select-${connect.id}`} checked={isSelected} onChange={() => actions.handleSelect(connect.id)} /></td>
            <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100 whitespace-normal break-words">{connect.title}</td>
            <td className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                    <span className="font-semibold block truncate">{organizationsById[connect.startupId]?.name}</span>
                    <ContactPillGroup contacts={connect.startupContactIds.map(id => stakeholdersById[id])} onContactClick={actions.openContact} />
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                    <span className="font-semibold block truncate">{organizationsById[connect.corporateId]?.name}</span>
                    <ContactPillGroup contacts={connect.corporateContactIds.map(id => stakeholdersById[id])} onContactClick={actions.openContact} />
                </div>
            </td>
            <td className="px-4 py-3">
                <StatusControl statuses={statuses} currentStatus={statusesById[connect.statusId]} onUpdate={(statusId) => actions.quickStatusUpdate(connect.id, statusId)} />
            </td>
            <td className="px-4 py-3">
                <ContactPillGroup contacts={[stakeholdersById[connect.ownerId]]} onContactClick={actions.openContact} />
            </td>
            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(connect.updatedAt).toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`} onClick={stopPropagation}>
                    {hasActivities ? (
                        <button onClick={() => actions.openActivityHistoryModal(connect.id, 'connect')} title="View Timeline" className="p-2 rounded-full transition-colors text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
                            <HiOutlineClock className="w-5 h-5"/>
                        </button>
                    ) : (
                        <button onClick={() => actions.openActivityModal(connect.id, 'connect')} title="Add Activity" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors">
                            <HiPlus className="w-5 h-5"/>
                        </button>
                    )}
                    <button onClick={() => actions.openSuccessStoryModal(connect.id)} title={hasSuccessStory ? "Edit Success Story" : "Create Success Story"} className={`p-2 rounded-full transition-colors ${hasSuccessStory ? 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20' : 'text-slate-500 hover:text-amber-500 hover:bg-amber-100 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-500/20'}`}>
                        <HiStar className={`w-5 h-5 ${hasSuccessStory ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={() => actions.generateSummary(connect.id)} title="AI Summary" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><HiSparkles className="w-5 h-5"/></button>
                    <button onClick={() => actions.openConnectModal(connect)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><HiPencil className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteConnect(connect.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                </div>
            </td>
        </tr>
    );
});

interface ConnectsListViewProps {
    connects: Connect[];
}

export const ConnectsListView: React.FC<ConnectsListViewProps> = ({ connects }) => {
    const { selectedIds, sortConfig, userSettings, actions } = useAppContext();
    const isAllSelected = selectedIds.size > 0 && selectedIds.size === connects.length;

    const tableRef = useRef<HTMLTableElement>(null);
    const [widths, setWidths] = useState<number[]>([]);
    const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);

    const MIN_WIDTH = 80;

    const headerConfig = [
        { title: '', sortKey: undefined, resizable: false, width: 60 },
        { title: 'Connect Title', sortKey: 'title', resizable: true },
        { title: 'Startup', sortKey: 'startup.name', resizable: true },
        { title: 'Corporate', sortKey: 'corporate.name', resizable: true },
        { title: 'Status', sortKey: 'status.name', resizable: true },
        { title: 'Owner', sortKey: 'owner.name', resizable: true },
        { title: 'Last Updated', sortKey: 'updatedAt', resizable: true },
        { title: 'Actions', sortKey: undefined, resizable: false, width: 180 },
    ];
    
    useEffect(() => {
        const savedWidths = userSettings.columnWidths?.connects;
        if (savedWidths && savedWidths.length === headerConfig.length) {
            setWidths(savedWidths);
            return;
        }

        if (tableRef.current) {
            const tableWidth = tableRef.current.offsetWidth;
            const fixedWidth = headerConfig.reduce((acc, h) => acc + (h.resizable ? 0 : h.width || 0), 0);
            const dynamicColumnCount = headerConfig.filter(h => h.resizable).length;
            
            if (dynamicColumnCount <= 0) return;
    
            const availableWidth = tableWidth - fixedWidth;
            const dynamicColumnWidth = Math.max(availableWidth / dynamicColumnCount, MIN_WIDTH);
            
            const initialWidths = headerConfig.map(h => h.resizable ? dynamicColumnWidth : h.width || 0);
            setWidths(initialWidths);
        }
    }, [connects.length, userSettings.columnWidths?.connects]);

    const handleMouseDown = useCallback((index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setResizingColumnIndex(index);
    }, []);

    const handleMouseUp = useCallback(() => {
        setResizingColumnIndex(null);
        if (widths.length > 0) {
            actions.saveColumnWidths('connects', widths);
        }
    }, [actions, widths]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (resizingColumnIndex === null) return;
        
        const newWidths = [...widths];
        const delta = e.movementX;
        const currentWidth = newWidths[resizingColumnIndex];
        let newWidth = currentWidth + delta;

        if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;

        newWidths[resizingColumnIndex] = newWidth;
        setWidths(newWidths);
    }, [resizingColumnIndex, widths]);

    useEffect(() => {
        if (resizingColumnIndex !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingColumnIndex, handleMouseMove, handleMouseUp]);

    return (
        <div className="h-full flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
            <div className="flex-1 overflow-auto no-scrollbar">
                <table ref={tableRef} className="min-w-full border-collapse">
                    <colgroup>
                        {headerConfig.map((_, index) => (
                            <col key={index} style={widths[index] ? { width: `${widths[index]}px` } : {}} />
                        ))}
                    </colgroup>
                    <thead className="sticky top-0 bg-slate-100/95 dark:bg-slate-900/70 backdrop-blur-sm border-b-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 z-10">
                        <tr>
                            {headerConfig.map((h, i) => (
                                <th key={i} className="relative px-4 py-3 text-left">
                                    {i === 0 ? (
                                        <CustomCheckbox id="select-all-header" checked={isAllSelected} onChange={(e) => actions.handleSelectAll(e, connects)} />
                                    ) : (
                                        <SortableHeader title={h.title} sortKey={h.sortKey} sortConfig={sortConfig} onSort={actions.handleSort} />
                                    )}
                                    {h.resizable && widths.length > 0 && <Resizer onMouseDown={handleMouseDown(i)} />}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                        {connects.map((connect) => <ConnectRow key={connect.id} connect={connect} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
