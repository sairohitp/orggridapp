
import React from 'react';
import { NeedType } from '../../types';

interface LeadsByNeedTypeChartProps {
    data: { type: NeedType, count: number }[];
}

export const LeadsByNeedTypeChart: React.FC<LeadsByNeedTypeChartProps> = ({ data }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);

    if (totalCount === 0) {
        return <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No leads with need types to display.</p>;
    }

    return (
        <div className="space-y-3">
            {data.map(({ type, count }) => {
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                    <div key={type.id} className="flex items-center gap-4 group">
                        <div className="w-40 flex-shrink-0 text-slate-600 dark:text-slate-400">
                           <span className="font-medium text-sm truncate">{type.name}</span>
                        </div>
                        <div className="flex-grow">
                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-sky-500 transition-all duration-300 ease-in-out"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 w-8 text-right">{count}</span>
                    </div>
                );
            })}
        </div>
    );
};
