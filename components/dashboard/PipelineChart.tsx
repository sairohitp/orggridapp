
import React from 'react';
import { Status } from '../../types';

interface PipelineChartProps {
    data: { status: Status, count: number }[];
}

const statusColors: Record<string, string> = {
  blue: 'bg-blue-500', purple: 'bg-purple-500', green: 'bg-green-500', yellow: 'bg-yellow-500',
  red: 'bg-red-500', orange: 'bg-orange-500', pink: 'bg-pink-500', indigo: 'bg-indigo-500',
  teal: 'bg-teal-500', lime: 'bg-lime-500', sky: 'bg-sky-500', rose: 'bg-rose-500',
  cyan: 'bg-cyan-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', violet: 'bg-violet-500',
};

export const PipelineChart: React.FC<PipelineChartProps> = ({ data }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);

    if (totalCount === 0) {
        return <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No connects with statuses to display.</p>;
    }

    return (
        <div className="space-y-3">
            {data.map(({ status, count }) => {
                const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                return (
                    <div key={status.id}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{status.name}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{count}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${statusColors[status.color] || 'bg-slate-500'}`}
                                style={{ width: `${percentage}%` }}
                                title={`${count} connects (${percentage.toFixed(1)}%)`}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};