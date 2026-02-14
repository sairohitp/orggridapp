
import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>
            <div>
                {children}
            </div>
        </div>
    );
};