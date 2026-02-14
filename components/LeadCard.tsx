
import React from 'react';
import { Lead, IntentLevel, NonRevenueTag as NonRevenueTagType } from '../types';
import { HiPencil, HiTrash, HiCheck, HiOutlineClock, HiPlus } from 'react-icons/hi2';
import { ContactPillGroup } from './ContactViews';
import { useAppContext } from '../contexts/AppContext';
import { currencyFormatter } from '../utils';

// --- Copied Tag Components from LeadsListView ---

const tagColors: Record<string, string> = {
  red: 'bg-red-500 dark:bg-red-400/20 dark:text-red-300 ring-red-600/20 text-red-700',
  yellow: 'bg-yellow-500 dark:bg-yellow-400/20 dark:text-yellow-300 ring-yellow-500/20 text-yellow-700',
  green: 'bg-green-500 dark:bg-green-400/20 dark:text-green-300 ring-green-600/20 text-green-700',
  blue: 'bg-blue-500 dark:bg-blue-400/20 dark:text-blue-300 ring-blue-500/20 text-blue-700',
  purple: 'bg-purple-500 dark:bg-purple-400/20 dark:text-purple-300 ring-purple-500/20 text-purple-700',
  slate: 'bg-slate-500 dark:bg-slate-400/20 dark:text-slate-300 ring-slate-500/20 text-slate-700',
  pink: 'bg-pink-500 dark:bg-pink-400/20 dark:text-pink-300 ring-pink-500/20 text-pink-700',
  rose: 'bg-rose-500 dark:bg-rose-400/20 dark:text-rose-300 ring-rose-500/20 text-rose-700',
  amber: 'bg-amber-500 dark:bg-amber-400/20 dark:text-amber-300 ring-amber-500/20 text-amber-700',
  sky: 'bg-sky-500 dark:bg-sky-400/20 dark:text-sky-300 ring-sky-500/20 text-sky-700',
};

const getBackgroundColor = (color: string) => tagColors[color]?.split(' ')[0] || 'bg-slate-400';
const getTextColor = (color: string) => {
    const classes = tagColors[color];
    if (!classes) return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 ring-slate-200 dark:ring-slate-600';
    const darkBg = classes.split(' ').find(c => c.startsWith('dark:bg-')) || 'dark:bg-slate-700';
    const darkText = classes.split(' ').find(c => c.startsWith('dark:text-')) || 'dark:text-slate-200';
    const lightBg = `bg-${color}-100`;
    const lightText = classes.split(' ').find(c => c.startsWith('text-')) || 'text-slate-700';
    const ring = classes.split(' ').find(c => c.startsWith('ring-')) || 'ring-slate-200/20';
    return `${lightBg} ${darkBg} ${lightText} ${darkText} ring-1 ring-inset ${ring}`;
};

const IntentLevelTag: React.FC<{ intentLevel?: IntentLevel }> = ({ intentLevel }) => {
    if (!intentLevel) return null;
    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(intentLevel.color)}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getBackgroundColor(intentLevel.color)}`}></span>
            {intentLevel.name}
        </span>
    );
};

const NonRevenueValueTag: React.FC<{ tag?: NonRevenueTagType }> = ({ tag }) => {
    if (!tag) return null;
    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(tag.color)}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getBackgroundColor(tag.color)}`}></span>
            {tag.name}
        </span>
    );
};

const NonRevenueValueTagGroup: React.FC<{ tagIds?: string[] }> = ({ tagIds }) => {
    const { nonRevenueTagsById } = useAppContext();
    if (!tagIds || tagIds.length === 0) return <span className="text-xs text-slate-400 dark:text-slate-500">No tags</span>;
    
    return (
        <div className="flex flex-wrap gap-1">
            {tagIds.map(id => nonRevenueTagsById[id] ? <NonRevenueValueTag key={id} tag={nonRevenueTagsById[id]} /> : null)}
        </div>
    );
}

// --- LeadCard Component ---

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = React.memo(({ lead }) => {
    const { 
        stakeholdersById,
        intentLevelsById,
        activitiesByLeadId,
        selectedIds,
        actions
    } = useAppContext();
    
    const owner = stakeholdersById[lead.ownerId];
    const intentLevel = intentLevelsById[lead.intentLevelId];
    const isSelected = selectedIds.has(lead.id);
    const activities = activitiesByLeadId[lead.id] || [];
    const hasActivities = activities.length > 0;

  return (
    <div className={`relative bg-white dark:bg-slate-800/50 border rounded-lg shadow-sm flex flex-col justify-between transition-all duration-300 group ${isSelected ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-500/50' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'}`}>
        <div className="absolute top-4 left-4 z-10">
            <label htmlFor={`select-${lead.id}`} className="flex items-center space-x-2 cursor-pointer">
                <div className={`w-5 h-5 border-2 rounded ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'} flex items-center justify-center transition-all`}>
                    {isSelected && <HiCheck className="w-3 h-3 text-white" />}
                </div>
                <input id={`select-${lead.id}`} type="checkbox" checked={isSelected} onChange={() => actions.handleSelect(lead.id)} className="sr-only" />
            </label>
        </div>
        <div className="p-4 pt-12">
            <h3 className="text-base font-bold pr-4 text-slate-800 dark:text-slate-100">{lead.name}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                Last activity: {new Date(lead.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-3 mb-4 text-sm">
                <div>
                    <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Details</p>
                    <div className="flex items-center justify-between mt-1 text-slate-800 dark:text-slate-200">
                        <span className="capitalize">{lead.organizationType}</span>
                        {lead.source && <span className="font-semibold">{lead.source}</span>}
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Potential Revenue</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{currencyFormatter.format(lead.revenuePotential)}</p>
                </div>
                 <div>
                    <p className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Non-Revenue Value</p>
                    <div className="mt-2"><NonRevenueValueTagGroup tagIds={lead.nonRevenueTagIds} /></div>
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
                {intentLevel && <IntentLevelTag intentLevel={intentLevel} />}
            </div>
        </div>

      <div className={`flex justify-end items-center border-t border-slate-200 dark:border-slate-700/50 px-4 py-2 mt-auto rounded-b-lg transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
        <div className="flex gap-1">
            {hasActivities ? (
                <button onClick={() => actions.openActivityHistoryModal(lead.id, 'lead')} title="View Timeline" className="p-2 rounded-full transition-colors text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
                    <HiOutlineClock className="w-5 h-5"/>
                </button>
            ) : (
                <button onClick={() => actions.openActivityModal(lead.id, 'lead')} title="Add Activity" className="p-2 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-full transition-colors">
                    <HiPlus className="w-5 h-5"/>
                </button>
            )}
            <button onClick={() => actions.openLeadModal(lead)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><HiPencil className="w-5 h-5"/></button>
            <button onClick={() => actions.deleteLead(lead.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
});
