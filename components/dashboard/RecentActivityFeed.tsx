
import React from 'react';
import { Activity } from '../../types';
import { ActivityTypeIcon } from '../Icons';
import { useAppContext } from '../../contexts/AppContext';

interface RecentActivityFeedProps {
    activities: Activity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
    const { connectsById, stakeholdersById } = useAppContext();

    if (activities.length === 0) {
        return <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-8">No recent activity.</p>;
    }

    return (
        <ul className="space-y-4">
            {activities.map(activity => {
                const connect = connectsById[activity.connectId];
                const author = stakeholdersById[activity.authorId];
                return (
                    <li key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mt-1">
                            <ActivityTypeIcon type={activity.type} className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                <span className="font-bold text-slate-800 dark:text-slate-100">{author?.name || 'Someone'}</span>
                                {' '}logged a new {activity.type.toLowerCase()}
                                {connect && <> for <span className="font-bold text-slate-800 dark:text-slate-100">{connect.title}</span></>}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(activity.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};