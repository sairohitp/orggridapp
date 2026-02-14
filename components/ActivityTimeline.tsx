

import React, { useMemo } from 'react';
import { Activity } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Button } from './Button';
import { getInitials, getColorForId } from './ContactViews';
import { ActivityTypeIcon } from './Icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi2';

const ActivityItem: React.FC<{ activity: Activity, isLast: boolean }> = ({ activity, isLast }) => {
    const { stakeholdersById, actions } = useAppContext();
    const author = stakeholdersById[activity.authorId];

    const hasContent = activity.notes || activity.participants.length > 0;
    const parentId = activity.connectId || activity.leadId;
    const parentType = activity.connectId ? 'connect' : 'lead';

    return (
        <li className="relative">
            {!isLast && <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" />}

            <div className="relative flex items-start gap-4">
                <div className="relative z-10">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <ActivityTypeIcon type={activity.type} className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                </div>
                
                <div className="min-w-0 flex-1">
                    <div className="rounded-lg bg-white dark:bg-slate-800/80 ring-1 ring-slate-200 dark:ring-slate-700/50">
                        <div className="p-3">
                            <div className="flex justify-between items-start group">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activity.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        <button 
                                            type="button" 
                                            onClick={() => author && actions.openContact(author)} 
                                            className="font-medium text-slate-600 dark:text-slate-300 hover:underline"
                                        >
                                            {author?.name || 'Unknown User'}
                                        </button>
                                        {' '}on {new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 ml-2 flex items-center gap-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                    {parentId && <button onClick={() => actions.openActivityModal(parentId, parentType, activity)} title="Edit Activity" className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-full transition-colors"><HiPencil className="w-4 h-4"/></button>}
                                    <button onClick={() => actions.deleteActivity(activity.id)} title="Delete Activity" className="p-1.5 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-4 h-4"/></button>
                                </div>
                            </div>
                        </div>

                        {hasContent && (
                            <div className="border-t border-slate-200/80 dark:border-slate-700/50 px-3 py-2 space-y-2">
                                {activity.notes && (
                                    <div className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.notes}</ReactMarkdown>
                                    </div>
                                )}
                                {activity.participants.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {activity.participants.map(id => {
                                            const contact = stakeholdersById[id];
                                            if (!contact) return null;
                                            return (
                                                <button key={id} onClick={() => actions.openContact(contact)} title={contact.name} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-full px-2 py-0.5 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700">
                                                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${getColorForId(contact.id)}`}>
                                                        {getInitials(contact.name)}
                                                    </div>
                                                    <span>{contact.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

export const ActivityTimeline: React.FC<{ parentId: string; parentType: 'connect' | 'lead' }> = ({ parentId, parentType }) => {
    const { activitiesByConnectId, activitiesByLeadId, actions } = useAppContext();

    const activities = useMemo(() => {
        return parentType === 'connect' ? (activitiesByConnectId[parentId] || []) : (activitiesByLeadId[parentId] || []);
    }, [parentId, parentType, activitiesByConnectId, activitiesByLeadId]);
    
    return (
        <div>
            {activities.length > 0 ? (
                 <ul role="list" className="space-y-6">
                    {activities.map((activity, index) => (
                        <ActivityItem key={activity.id} activity={activity} isLast={index === activities.length - 1} />
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No activities logged yet.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Log the first interaction for this record.</p>
                </div>
            )}
           
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
                <Button variant="secondary" size="small" onClick={() => actions.openActivityModal(parentId, parentType)}>
                    <HiPlus className="w-4 h-4 mr-1.5"/>
                    Add Activity
                </Button>
            </div>
        </div>
    )
};