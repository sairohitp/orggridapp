
import React from 'react';

interface RecordsByMonthChartProps {
    data: { month: string; count: number }[];
}

export const RecordsByMonthChart: React.FC<RecordsByMonthChartProps> = ({ data }) => {
    const maxCount = Math.max(...data.map(item => item.count), 1);

    return (
        <div className="w-full h-64 flex items-end justify-around gap-2 px-2">
            {data.map(({ month, count }) => {
                const barHeight = (count / maxCount) * 100;
                return (
                    <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                            className="w-full bg-indigo-400 dark:bg-indigo-500 rounded-t-md hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all ease-in-out duration-200 relative"
                            style={{ height: `${barHeight}%` }}
                        >
                           <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 dark:bg-slate-900 text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                               {count}
                           </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{month.split(' ')[0]}</span>
                    </div>
                );
            })}
        </div>
    );
};
