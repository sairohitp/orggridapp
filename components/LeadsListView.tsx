
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lead, IntentLevel, NonRevenueTag as NonRevenueTagType } from '../types';
import { HiPencil, HiTrash, HiOutlineClock, HiPlus } from 'react-icons/hi2';
import { ContactPillGroup } from './ContactViews';
import { CustomCheckbox, SortableHeader, Resizer } from './Table';
import { useAppContext } from '../contexts/AppContext';
import { currencyFormatter } from '../utils';

const tagColors: Record<string, string> = {
  red: 'bg-red-500 dark:bg-red-400/20 dark:text-red-300 ring-red-600/20 text-red-700',
  yellow: 'bg-yellow-500 dark:bg-yellow-400/20 dark:text-yellow-300 ring-yellow-500/20 text-yellow-700',
  green: 'bg-green-500 dark:bg-green-400/20 dark:text-green-300 ring-green-600/20 text-green-700',
  blue: 'bg-blue-500 dark:bg-blue-400/20 dark:text-blue-300 ring-blue-500/20 text-blue-700',
  purple: 'bg-purple-500 dark:bg-purple-400/20 dark:text-purple-300 ring-purple-500/20 text-purple-700',
  slate: 'bg-slate-500 dark:bg-slate-400/20 dark:text-slate-300 ring-slate-500/20 text-slate-700',
  pink: 'bg-pink-500 dark:bg-pink-400/20 dark:text-pink-300 ring-pink-500/20 text-pink-700',
  rose: 'bg-rose-500 dark:bg-rose-400/20 dark:text-rose-300 ring-rose-500/20 text-rose-700',
  amber: 'bg-amber-500 dark:bg-amber-400/20 dark:text-amber-300 ring-amber-500/20 text-amber-700',
  sky: 'bg-sky-500 dark:bg-sky-400/20 dark:text-sky-300 ring-sky-500/20 text-sky-700',
};

const getBackgroundColor = (color: string) => tagColors[color]?.split(' ')[0] || 'bg-slate-400';
const getTextColor = (color: string) => {
    const classes = tagColors[color];
    if (!classes) return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-600';
    const darkBg = classes.split(' ').find(c => c.startsWith('dark:bg-')) || 'dark:bg-slate-700';
    const darkText = classes.split(' ').find(c => c.startsWith('dark:text-')) || 'dark:text-slate-200';
    const lightBg = `bg-${color}-100`;
    const lightText = classes.split(' ').find(c => c.startsWith('text-')) || 'text-slate-700';
    const ring = classes.split(' ').find(c => c.startsWith('ring-')) || 'ring-slate-200/20';
    return `${lightBg} ${darkBg} ${lightText} ${darkText} ring-1 ring-inset ${ring}`;
};

const IntentLevelTag: React.FC<{ intentLevel?: IntentLevel }> = ({ intentLevel }) => {
    if (!intentLevel) return null;
    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(intentLevel.color)}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getBackgroundColor(intentLevel.color)}`}></span>
            {intentLevel.name}
        </span>
    );
};

const NonRevenueValueTag: React.FC<{ tag?: NonRevenueTagType }> = ({ tag }) => {
    if (!tag) return null;
    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(tag.color)}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getBackgroundColor(tag.color)}`}></span>
            {tag.name}
        </span>
    );
};

const NonRevenueValueTagGroup: React.FC<{ tagIds?: string[] }> = ({ tagIds }) => {
    const { nonRevenueTagsById } = useAppContext();
    if (!tagIds || tagIds.length === 0) return null;
    
    return (
        <div className="flex flex-wrap gap-1">
            {tagIds.map(id => nonRevenueTagsById[id] ? <NonRevenueValueTag key={id} tag={nonRevenueTagsById[id]} /> : null)}
        </div>
    );
}

interface LeadRowProps {
    lead: Lead;
}

const LeadRow = React.memo<LeadRowProps>(({ lead }) => {
    const { stakeholdersById, intentLevelsById, needTypesById, activitiesByLeadId, selectedIds, actions } = useAppContext();
    const isSelected = selectedIds.has(lead.id);
    const intentLevel = intentLevelsById[lead.intentLevelId];
    const needType = needTypesById[lead.needTypeId];
    const activities = activitiesByLeadId[lead.id] || [];
    const hasActivities = activities.length > 0;

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <tr className={`text-sm group transition-colors duration-150 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'}`}>
            <td className="px-4 py-3"><CustomCheckbox id={`select-${lead.id}`} checked={isSelected} onChange={() => actions.handleSelect(lead.id)} /></td>
            <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100 whitespace-normal break-words">{lead.name}</td>
            <td className="px-4 py-3 capitalize">{lead.organizationType}</td>
            <td className="px-4 py-3 whitespace-normal break-words">{lead.source}</td>
            <td className="px-4 py-3"><IntentLevelTag intentLevel={intentLevel} /></td>
            <td className="px-4 py-3 whitespace-normal break-words">{needType?.name}</td>
            <td className="px-4 py-3">{currencyFormatter.format(lead.revenuePotential)}</td>
            <td className="px-4 py-3"><NonRevenueValueTagGroup tagIds={lead.nonRevenueTagIds} /></td>
            <td className="px-4 py-3">
                {stakeholdersById[lead.ownerId] &&
                    <ContactPillGroup contacts={[stakeholdersById[lead.ownerId]]} onContactClick={actions.openContact} />
                }
            </td>
            <td className="px-4 py-3 whitespace-normal break-words" title={lead.comments || ''}>
                {lead.comments ? (
                    <p className="line-clamp-2">{lead.comments}</p>
                ) : (
                     <span className="text-slate-400 dark:text-slate-500">N/A</span>
                )}
            </td>
            <td className="px-4 py-3">
                <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`} onClick={stopPropagation}>
                    {hasActivities ? (
                        <button onClick={() => actions.openActivityHistoryModal(lead.id, 'lead')} title="View Timeline" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors">
                            <HiOutlineClock className="w-5 h-5"/>
                        </button>
                    ) : (
                        <button onClick={() => actions.openActivityModal(lead.id, 'lead')} title="Add Activity" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors">
                            <HiPlus className="w-5 h-5"/>
                        </button>
                    )}
                    <button onClick={() => actions.openLeadModal(lead)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><HiPencil className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteLead(lead.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                </div>
            </td>
        </tr>
    );
});

interface LeadsListViewProps {
    leads: Lead[];
}

export const LeadsListView: React.FC<LeadsListViewProps> = ({ leads }) => {
    const { selectedIds, sortConfig, userSettings, actions } = useAppContext();
    const isAllSelected = selectedIds.size > 0 && selectedIds.size === leads.length;
    
    const tableRef = useRef<HTMLTableElement>(null);
    const [widths, setWidths] = useState<number[]>([]);
    const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);

    const MIN_WIDTH = 80;

    const headerConfig = [
        { title: '', sortKey: undefined, resizable: false, width: 60 },
        { title: 'Lead Name', sortKey: 'name', resizable: true },
        { title: 'Organization Type', sortKey: 'organizationType', resizable: true },
        { title: 'Lead Source', sortKey: 'source', resizable: true },
        { title: 'Intent Level', sortKey: 'intentLevel.name', resizable: true },
        { title: 'Need Type', sortKey: 'needType.name', resizable: true },
        { title: 'Revenue Potential (₹)', sortKey: 'revenuePotential', resizable: true },
        { title: 'Non-Revenue Value', sortKey: undefined, resizable: true },
        { title: 'Owner', sortKey: 'owner.name', resizable: true },
        { title: 'Comments', sortKey: 'comments', resizable: true },
        { title: 'Actions', sortKey: undefined, resizable: false, width: 128 },
    ];
    
    useEffect(() => {
        const savedWidths = userSettings.columnWidths?.leads;
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
    }, [leads.length, userSettings.columnWidths?.leads]);

    const handleMouseDown = useCallback((index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setResizingColumnIndex(index);
    }, []);

    const handleMouseUp = useCallback(() => {
        setResizingColumnIndex(null);
        if (widths.length > 0) {
            actions.saveColumnWidths('leads', widths);
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
                                        <CustomCheckbox id="select-all-header" checked={isAllSelected} onChange={(e) => actions.handleSelectAll(e, leads)} />
                                    ) : (
                                        <SortableHeader title={h.title} sortKey={h.sortKey} sortConfig={sortConfig} onSort={actions.handleSort} />
                                    )}
                                    {h.resizable && widths.length > 0 && <Resizer onMouseDown={handleMouseDown(i)} />}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                        {leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
