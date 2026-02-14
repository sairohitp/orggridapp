import React, { useState, useRef, useEffect } from 'react';
import { Status } from '../types';

interface StatusControlProps {
    statuses: Status[];
    currentStatus?: Status;
    onUpdate: (newStatusId: string) => void;
}

const statusColors: Record<string, string> = {
  blue: 'bg-blue-500 dark:bg-blue-400/20 dark:text-blue-300 ring-blue-500/20 text-blue-700',
  purple: 'bg-purple-500 dark:bg-purple-400/20 dark:text-purple-300 ring-purple-500/20 text-purple-700',
  green: 'bg-green-500 dark:bg-green-400/20 dark:text-green-300 ring-green-600/20 text-green-700',
  yellow: 'bg-yellow-500 dark:bg-yellow-400/20 dark:text-yellow-300 ring-yellow-500/20 text-yellow-700',
  red: 'bg-red-500 dark:bg-red-400/20 dark:text-red-300 ring-red-600/20 text-red-700',
  orange: 'bg-orange-500 dark:bg-orange-400/20 dark:text-orange-300 ring-orange-500/20 text-orange-700',
  pink: 'bg-pink-500 dark:bg-pink-400/20 dark:text-pink-300 ring-pink-500/20 text-pink-700',
  indigo: 'bg-indigo-500 dark:bg-indigo-400/20 dark:text-indigo-300 ring-indigo-500/20 text-indigo-700',
  teal: 'bg-teal-500 dark:bg-teal-400/20 dark:text-teal-300 ring-teal-500/20 text-teal-700',
  lime: 'bg-lime-500 dark:bg-lime-400/20 dark:text-lime-300 ring-lime-500/20 text-lime-700',
  sky: 'bg-sky-500 dark:bg-sky-400/20 dark:text-sky-300 ring-sky-500/20 text-sky-700',
  rose: 'bg-rose-500 dark:bg-rose-400/20 dark:text-rose-300 ring-rose-500/20 text-rose-700',
  cyan: 'bg-cyan-500 dark:bg-cyan-400/20 dark:text-cyan-300 ring-cyan-500/20 text-cyan-700',
  emerald: 'bg-emerald-500 dark:bg-emerald-400/20 dark:text-emerald-300 ring-emerald-600/20 text-emerald-700',
  amber: 'bg-amber-500 dark:bg-amber-400/20 dark:text-amber-300 ring-amber-500/20 text-amber-700',
  violet: 'bg-violet-500 dark:bg-violet-400/20 dark:text-violet-300 ring-violet-500/20 text-violet-700',
  slate: 'bg-slate-500 dark:bg-slate-400/20 dark:text-slate-300 ring-slate-500/20 text-slate-700',
};

const getBackgroundColor = (color: string) => {
    return statusColors[color]?.split(' ')[0] || 'bg-slate-400';
}
const getTextColor = (color: string) => {
    const classes = statusColors[color];
    if (!classes) return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-600';
    
    const darkBg = classes.split(' ').find(c => c.startsWith('dark:bg-')) || 'dark:bg-slate-700';
    const darkText = classes.split(' ').find(c => c.startsWith('dark:text-')) || 'dark:text-slate-200';
    const lightBg = `bg-${color}-100`;
    const lightText = classes.split(' ').find(c => c.startsWith('text-')) || 'text-slate-700';
    const ring = classes.split(' ').find(c => c.startsWith('ring-')) || 'ring-slate-200/20';

    return `${lightBg} ${darkBg} ${lightText} ${darkText} ring-1 ring-inset ${ring}`;
};


const StatusTag: React.FC<{ status: Status; isButton?: boolean }> = ({ status, isButton }) => (
    <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(status.color)} ${isButton ? 'cursor-pointer hover:opacity-80' : ''}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${getBackgroundColor(status.color)}`}></span>
        {status.name}
    </span>
);

export const StatusControl: React.FC<StatusControlProps> = ({ statuses, currentStatus, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectStatus = (statusId: string) => {
        onUpdate(statusId);
        setIsOpen(false);
    };

    if (!currentStatus) {
        return <span className="text-slate-400 dark:text-slate-500 text-xs">No Status</span>;
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <button type="button" onClick={() => setIsOpen(prev => !prev)} className="block">
                <StatusTag status={currentStatus} isButton />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20">
                    <ul>
                        {statuses.map(status => (
                            <li key={status.id}>
                                <button
                                    onClick={() => handleSelectStatus(status.id)}
                                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                    <span className={`h-2 w-2 rounded-full ${getBackgroundColor(status.color)}`}></span>
                                    <span>{status.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
