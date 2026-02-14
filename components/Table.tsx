import React from 'react';
import { SortConfig } from '../types';
import { HiCheck, HiChevronUp, HiChevronDown } from 'react-icons/hi2';

interface CustomCheckboxProps {
    id: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}
export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, checked, onChange, className='' }) => (
    <div className={`flex items-center justify-center ${className}`}>
        <label htmlFor={id} className="cursor-pointer">
            <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all border-slate-300 dark:border-slate-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-600`}>
                <HiCheck className={`w-3 h-3 text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
            </span>
        </label>
    </div>
);

interface SortableHeaderProps {
    title: string;
    sortKey?: string;
    sortConfig: SortConfig | null;
    onSort: (key: string) => void;
    className?: string;
}
export const SortableHeader: React.FC<SortableHeaderProps> = ({ title, sortKey, sortConfig, onSort, className = '' }) => {
    if (!sortKey) {
        return <div className={`w-full text-left whitespace-nowrap ${className}`}>{title}</div>;
    }
    const isSorting = sortConfig?.key === sortKey;
    const isAscending = isSorting && sortConfig?.direction === 'ascending';
    const isDescending = isSorting && sortConfig?.direction === 'descending';

    return (
        <button onClick={() => onSort(sortKey)} className={`flex items-center gap-1 w-full text-left whitespace-nowrap group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm ${className}`}>
            <span>{title}</span>
            <div className="flex flex-col">
                <HiChevronUp className={`w-3 h-3 transition-colors ${isAscending ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'}`} />
                <HiChevronDown className={`w-3 h-3 -mt-1.5 transition-colors ${isDescending ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'}`} />
            </div>
        </button>
    );
};

export const Resizer: React.FC<{ onMouseDown: (e: React.MouseEvent) => void }> = ({ onMouseDown }) => (
    <div
        onMouseDown={onMouseDown}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group z-10"
        onClick={e => e.stopPropagation()}
    >
        <div className="w-px h-full bg-slate-200 dark:bg-slate-700 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-500 transition-colors" />
    </div>
);