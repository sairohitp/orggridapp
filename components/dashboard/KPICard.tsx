
import React from 'react';
import { KPICardIcon } from '../Icons';

interface KPICardProps {
    title: string;
    value: string;
    icon: 'connects' | 'success' | 'cycle' | 'activities' | 'leads' | 'revenue';
}

const iconColors: Record<string, string> = {
    connects: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    success: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
    cycle: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
    activities: 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400',
    leads: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    revenue: 'bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400',
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${iconColors[icon]}`}>
                <KPICardIcon type={icon} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            </div>
        </div>
    );
};
