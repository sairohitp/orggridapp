
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Organization, Stakeholder, Entity, SortConfig, ActiveView } from '../types';
import { HiPencil, HiTrash, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { CustomCheckbox, SortableHeader, Resizer } from './Table';
import { useAppContext } from '../contexts/AppContext';

export type EntityColumn<T> = {
    header: string;
    render: (item: T) => React.ReactNode;
    sortKey?: string;
    resizable: boolean;
    width?: number;
};

interface EntityRowProps<T extends Entity> {
    item: T;
    columns: EntityColumn<T>[];
    isSelected: boolean;
    onSelect: (id: string) => void;
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
    onGenerateInsights?: (item: T) => void;
}

const EntityRow = React.memo(function EntityRow<T extends Entity>({
    item, columns, isSelected, onSelect, onEdit, onDelete, onGenerateInsights
}: EntityRowProps<T>) {
    return (
        <tr className={`border-b-transparent text-sm last:border-b-0 group ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
            <td className="px-4 py-3">
              <CustomCheckbox id={`select-${item.id}`} checked={isSelected} onChange={() => onSelect(item.id)} />
            </td>
            
            {columns.slice(1, -1).map((col, index) => (
                <td key={col.header || index} className="px-4 py-3 min-w-0">
                    <div className="truncate">{col.render(item)}</div>
                </td>
            ))}
            <td className="px-4 py-3">
              <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
                  {onGenerateInsights && 'type' in item && (
                     <button onClick={() => onGenerateInsights(item)} title="Industry Insights" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><HiOutlineGlobeAlt className="w-5 h-5"/></button>
                  )}
                  <button onClick={() => onEdit(item)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><HiPencil className="w-5 h-5"/></button>
                  <button onClick={() => onDelete(item.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
              </div>
            </td>
        </tr>
    );
});


interface EntityListViewProps<T extends Entity> {
    items: T[];
    columns: EntityColumn<T>[];
    isSelected: (id: string) => boolean;
    onSelect: (id:string) => void;
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAllSelected: boolean;
    sortConfig: SortConfig | null;
    onSort: (key: string) => void;
    onGenerateInsights?: (item: T) => void;
}

export function EntityListView<T extends Entity>({ items, columns, isSelected, onSelect, onEdit, onDelete, onSelectAll, isAllSelected, sortConfig, onSort, onGenerateInsights }: EntityListViewProps<T>) {
    const { userSettings, actions, activeView } = useAppContext();
    const tableRef = useRef<HTMLTableElement>(null);
    const [widths, setWidths] = useState<number[]>([]);
    const [resizingColumnIndex, setResizingColumnIndex] = useState<number | null>(null);

    const MIN_WIDTH = 80;

    useEffect(() => {
        const viewKey = activeView as keyof NonNullable<typeof userSettings.columnWidths>;
        const savedWidths = userSettings.columnWidths?.[viewKey];
        if (savedWidths && savedWidths.length === columns.length) {
            setWidths(savedWidths);
            return;
        }

        if (tableRef.current) {
            const tableWidth = tableRef.current.offsetWidth;
            const fixedWidth = columns.reduce((acc, h) => acc + (h.resizable ? 0 : h.width || 0), 0);
            const dynamicColumnCount = columns.filter(h => h.resizable).length;
            if (dynamicColumnCount === 0) return;
            
            const availableWidth = tableWidth - fixedWidth;
            const dynamicColumnWidth = Math.max(availableWidth / dynamicColumnCount, MIN_WIDTH);

            const initialWidths = columns.map(c => c.resizable ? dynamicColumnWidth : c.width || 0);
            setWidths(initialWidths);
        }
    }, [columns.length, items.length, activeView, userSettings.columnWidths]);

    const handleMouseDown = useCallback((index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setResizingColumnIndex(index);
    }, []);

    const handleMouseUp = useCallback(() => {
        setResizingColumnIndex(null);
        if (widths.length > 0) {
            actions.saveColumnWidths(activeView as ActiveView, widths);
        }
    }, [actions, widths, activeView]);

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
                         {widths.map((width, index) => (
                            <col key={index} style={width ? { width: `${width}px` } : {}} />
                        ))}
                    </colgroup>
                    <thead className="sticky top-0 bg-slate-100/95 dark:bg-slate-900/70 backdrop-blur-sm border-b-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 z-10">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={col.header || i} className="relative px-4 py-3 text-left">
                                     {i === 0 ? (
                                        <CustomCheckbox id="select-all-header" checked={isAllSelected} onChange={onSelectAll} />
                                    ) : (
                                        <SortableHeader title={col.header} sortKey={col.sortKey} sortConfig={sortConfig} onSort={onSort} />
                                    )}
                                    {col.resizable && widths.length > 0 && <Resizer onMouseDown={handleMouseDown(i)} />}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {items.map((item) => (
                           <EntityRow
                                key={item.id}
                                item={item}
                                columns={columns}
                                isSelected={isSelected(item.id)}
                                onSelect={onSelect}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onGenerateInsights={onGenerateInsights}
                           />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
