

import React from 'react';
import { Connect, Stakeholder, Organization, Status } from '../types';
import { HiPencil, HiTrash, HiCheck, HiArrowPath, HiSparkles, HiStar, HiOutlineClock, HiPlus } from 'react-icons/hi2';
import { ContactPillGroup } from './ContactViews';
import { useAppContext } from '../contexts/AppContext';

interface ConnectCardProps {
  connect: Connect;
  isTrashView?: boolean;
}

const statusColors: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
  lime: 'bg-lime-500',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
  cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
};

const Tag: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-200 dark:ring-slate-600">
        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[color] || 'bg-slate-400'}`}></span>
        {children}
    </span>
);

export const ConnectCard: React.FC<ConnectCardProps> = React.memo(({ 
    connect, 
    isTrashView = false
}) => {
    const { 
        organizationsById,
        stakeholdersById,
        statusesById,
        activitiesByConnectId,
        selectedIds,
        connectToSuccessStoryMap,
        actions
    } = useAppContext();
    
    const startup = organizationsById[connect.startupId];
    const corporate = organizationsById[connect.corporateId];
    const owner = stakeholdersById[connect.ownerId];
    const status = statusesById[connect.statusId];
    const isSelected = selectedIds.has(connect.id);
    const hasSuccessStory = !!connectToSuccessStoryMap[connect.id];
    const activities = activitiesByConnectId[connect.id] || [];
    const latestActivity = activities[0]; // Activities are sorted descending by date in context
    const hasActivities = activities.length > 0;

  return (
    <div className={`relative bg-white dark:bg-slate-800/50 border rounded-lg shadow-sm flex flex-col justify-between transition-all duration-300 group ${isSelected ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-500/50' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'} ${isTrashView ? 'opacity-70 bg-slate-50 dark:bg-slate-800/20' : ''}`}>
        <div className="absolute top-4 left-4 z-10">
            <label htmlFor={`select-${connect.id}`} className="flex items-center space-x-2 cursor-pointer">
                <div className={`w-5 h-5 border-2 rounded ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'} flex items-center justify-center transition-all`}>
                    {isSelected && <HiCheck className="w-3 h-3 text-white" />}
                </div>
                <input id={`select-${connect.id}`} type="checkbox" checked={isSelected} onChange={() => actions.handleSelect(connect.id)} className="sr-only" />
            </label>
        </div>
      <div className="p-4 pt-12">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold pr-4 text-slate-800 dark:text-slate-100">{connect.title}</h3>
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
            {isTrashView && connect.deletedAt ? 
                `Deleted on ${new Date(connect.deletedAt).toLocaleDateString()}` :
                `Last activity: ${new Date(connect.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
            }
        </p>

        <div className="space-y-4 mb-4 text-sm">
            <div>
                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Startup</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{startup?.name || 'Unknown Startup'}</p>
                </div>
            </div>
            <div>
                <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Corporate</p>
                <div className="flex items-center justify-between mt-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{corporate?.name || 'Unknown Corporate'}</p>
                </div>
            </div>
        </div>
        
         <div className="flex items-center gap-2 text-sm mb-4">
            <strong className="font-semibold text-slate-500 dark:text-slate-400">Owner:</strong>
             {owner && (
                <button type="button" onClick={() => actions.openContact(owner)} className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                    {owner.name}
                </button>
            )}
        </div>

        <div className="flex flex-wrap gap-2">
            {status && <Tag color={status.color}>{status.name}</Tag>}
            {latestActivity && (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 ring-1 ring-inset ring-slate-200 dark:ring-slate-600">
                    {latestActivity.type}
                </span>
            )}
        </div>
      </div>

      <div className={`flex justify-end items-center border-t border-slate-200 dark:border-slate-700/50 px-4 py-2 mt-auto rounded-b-lg transition-opacity ${isTrashView || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
        <div className="flex gap-1">
            {isTrashView ? (
                <>
                    <button onClick={() => actions.restoreTrashedItem(connect)} title="Restore" className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-full transition-colors"><HiArrowPath className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteTrashedItemPermanently(connect)} title="Delete Permanently" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                </>
            ) : (
                <>
                    {hasActivities ? (
                        <button onClick={() => actions.openActivityHistoryModal(connect.id, 'connect')} title="View Timeline" className="p-2 rounded-full transition-colors text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
                            <HiOutlineClock className="w-5 h-5"/>
                        </button>
                    ) : (
                        <button onClick={() => actions.openActivityModal(connect.id, 'connect')} title="Add Activity" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors">
                            <HiPlus className="w-5 h-5"/>
                        </button>
                    )}
                    <button onClick={() => actions.openSuccessStoryModal(connect.id)} title={hasSuccessStory ? "Edit Success Story" : "Create Success Story"} className={`p-2 rounded-full transition-colors ${hasSuccessStory ? 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20' : 'text-slate-500 hover:text-amber-500 hover:bg-amber-100 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-500/20'}`}>
                        <HiStar className={`w-5 h-5 ${hasSuccessStory ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={() => actions.generateSummary(connect.id)} title="AI Summary" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors"><HiSparkles className="w-5 h-5"/></button>
                    <button onClick={() => actions.openConnectModal(connect)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><HiPencil className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteConnect(connect.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                </>
            )}
        </div>
      </div>
    </div>
  );
});