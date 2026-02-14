

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Lead, NonRevenueTag } from '../types';
import { Button } from './Button';
import { HiXMark, HiCheck } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

// --- TagMultiSelectDropdown Component (defined locally) ---

interface TagOption {
  id: string;
  name: string;
  color: string;
}

const tagColors: Record<string, string> = {
  red: 'bg-red-500', yellow: 'bg-yellow-500', green: 'bg-green-500',
  blue: 'bg-blue-500', purple: 'bg-purple-500', slate: 'bg-slate-500',
  pink: 'bg-pink-500', rose: 'bg-rose-500', amber: 'bg-amber-500', sky: 'bg-sky-500',
};

const getBackgroundColor = (color: string) => tagColors[color] || 'bg-slate-400';
const getTextColor = (color: string) => {
    switch(color) {
        case 'red': return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 ring-red-600/20';
        case 'yellow': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 ring-yellow-600/20';
        case 'green': return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 ring-green-600/20';
        case 'blue': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 ring-blue-600/20';
        case 'purple': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 ring-purple-600/20';
        case 'pink': return 'bg-pink-100 dark:bg-pink-500/20 text-pink-800 dark:text-pink-300 ring-pink-600/20';
        case 'rose': return 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 ring-rose-600/20';
        case 'amber': return 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 ring-amber-600/20';
        case 'sky': return 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-300 ring-sky-600/20';
        default: return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 ring-slate-600/20';
    }
};

const SelectedTagPill: React.FC<{ tag: TagOption; onRemove: (id: string) => void }> = ({ tag, onRemove }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getTextColor(tag.color)}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${getBackgroundColor(tag.color)}`}></span>
        <span>{tag.name}</span>
        <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(tag.id); }} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <HiXMark className="w-3 h-3"/>
        </button>
    </span>
);

const TagMultiSelectDropdown: React.FC<{
  options: TagOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder: string;
  className?: string;
}> = ({ options, selectedIds, onChange, placeholder, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsById = useMemo(() => Object.fromEntries(options.map(o => [o.id, o])), [options]);
    
    const handleToggle = (id: string) => {
        const newSelectedIds = selectedIds.includes(id) 
            ? selectedIds.filter(sid => sid !== id) 
            : [...selectedIds, id];
        onChange(newSelectedIds);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOptions = selectedIds.map(id => optionsById[id]).filter(Boolean);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm shadow-sm flex items-center flex-wrap gap-1 cursor-pointer min-h-[42px]">
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(tag => <SelectedTagPill key={tag.id} tag={tag} onRemove={handleToggle}/>)
                ) : (
                    <span className="text-slate-400 dark:text-slate-500 px-1">{placeholder}</span>
                )}
            </div>
            {isOpen && (
                <div className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-10 no-scrollbar">
                    <ul className="py-1">
                        {options.map(option => (
                            <li key={option.id} onClick={() => handleToggle(option.id)} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-3">
                                <input type="checkbox" checked={selectedIds.includes(option.id)} readOnly className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-600" />
                                <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(option.color)}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${getBackgroundColor(option.color)}`}></span>
                                    {option.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- LeadModal Component ---

const getInitialState = (internalStakeholders: any[], intentLevels: any[], needTypes: any[]): Partial<Lead> => ({
  name: '',
  organizationType: 'startup',
  source: '',
  intentLevelId: intentLevels[0]?.id || '',
  needTypeId: needTypes[0]?.id || '',
  revenuePotential: 0,
  nonRevenueTagIds: [],
  ownerId: internalStakeholders[0]?.id || '',
  comments: '',
});

export const LeadModal: React.FC = () => {
  const { leadToEdit, internalStakeholders, intentLevels, needTypes, nonRevenueTags, actions } = useAppContext();
  const [formData, setFormData] = useState<Partial<Lead>>(getInitialState(internalStakeholders, intentLevels, needTypes));

  const inputStyle = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelStyle = "text-sm font-semibold text-slate-700 dark:text-slate-300";

  useEffect(() => {
    if (leadToEdit) {
      setFormData(leadToEdit);
    } else {
      setFormData(getInitialState(internalStakeholders, intentLevels, needTypes));
    }
  }, [leadToEdit, internalStakeholders, intentLevels, needTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleTagsChange = (ids: string[]) => {
    setFormData(prev => ({ ...prev, nonRevenueTagIds: ids }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.saveLead(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative no-scrollbar">
        <button onClick={actions.closeLeadModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{leadToEdit ? 'Edit Lead' : 'Create New Lead'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Track a new potential opportunity before it becomes a connect.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className={labelStyle}>Lead Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={inputStyle} required placeholder="e.g., Potential Partnership with InnovateAI"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyle}>Organization Type</label>
                    <select name="organizationType" value={formData.organizationType} onChange={handleInputChange} className={inputStyle} required>
                        <option value="startup">Startup</option>
                        <option value="corporate">Corporate</option>
                    </select>
                </div>
                <div>
                    <label className={labelStyle}>Lead Source</label>
                    <input type="text" name="source" value={formData.source || ''} onChange={handleInputChange} className={inputStyle} placeholder="e.g., Conference, Referral, Website"/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyle}>Intent Level</label>
                    <select name="intentLevelId" value={formData.intentLevelId} onChange={handleInputChange} className={inputStyle} required>
                         {intentLevels.map(level => <option key={level.id} value={level.id}>{level.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelStyle}>Need Type</label>
                    <select name="needTypeId" value={formData.needTypeId} onChange={handleInputChange} className={inputStyle} required>
                         {needTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelStyle}>Revenue Potential (₹)</label>
                    <input type="number" name="revenuePotential" value={formData.revenuePotential || ''} onChange={handleInputChange} className={inputStyle} placeholder="e.g., 5000000"/>
                </div>
                 <div>
                    <label className={labelStyle}>Owner</label>
                    <select name="ownerId" value={formData.ownerId} onChange={handleInputChange} className={inputStyle} required>
                        <option value="" disabled>Select an owner</option>
                        {internalStakeholders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div>
                <label className={labelStyle}>Non-Revenue Value</label>
                <TagMultiSelectDropdown
                    options={nonRevenueTags}
                    selectedIds={formData.nonRevenueTagIds || []}
                    onChange={handleTagsChange}
                    placeholder="Select tags..."
                />
            </div>
            
            <div>
                <label className={labelStyle}>Comments</label>
                <textarea name="comments" value={formData.comments || ''} onChange={handleInputChange} className={`${inputStyle} min-h-[80px]`} placeholder="Add any relevant notes or context here..."></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button type="button" variant="secondary" onClick={actions.closeLeadModal}>Cancel</Button>
                <Button type="submit">{leadToEdit ? 'Save Changes' : 'Create Lead'}</Button>
            </div>
        </form>
      </div>
    </div>
  );
};