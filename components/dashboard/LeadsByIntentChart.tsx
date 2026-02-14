
import React from 'react';
import { IntentLevel } from '../../types';

interface LeadsByIntentChartProps {
    data: { level: IntentLevel, count: number }[];
}

const intentLevelColors: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-500',
};

export const LeadsByIntentChart: React.FC<LeadsByIntentChartProps> = ({ data }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);

    if (totalCount === 0) {
        return <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No leads with intent levels to display.</p>;
    }

    return (
        <div className="space-y-3">
            {data.map(({ level, count }) => {
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                    <div key={level.id}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{level.name}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{count}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${intentLevelColors[level.color] || 'bg-slate-500'}`}
                                style={{ width: `${percentage}%` }}
                                title={`${count} leads (${percentage.toFixed(1)}%)`}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
