
import React from 'react';
import { ActivityType } from '../../types';
import { ActivityTypeIcon } from '../Icons';

interface ActivityChartProps {
    data: { type: ActivityType, count: number }[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);

    if (totalCount === 0) {
        return <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No activities logged yet.</p>;
    }

    return (
        <div className="space-y-3">
            {data.map(({ type, count }) => {
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                    <div key={type} className="flex items-center gap-4 group">
                        <div className="flex items-center gap-2 w-24 flex-shrink-0 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">
                           <ActivityTypeIcon type={type} className="w-4 h-4" />
                           <span className="font-medium text-sm">{type}</span>
                        </div>
                        <div className="flex-grow">
                             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                                <div
                                    className="h-4 rounded-full bg-indigo-500 transition-all duration-300 ease-in-out"
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