
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Stakeholder, ActiveFilters, IntentLevel, NeedType } from '../types';
import { HiCog6Tooth } from 'react-icons/hi2';

interface LeadFilterDropdownProps {
    filters: ActiveFilters;
    onFilterChange: (newFilters: ActiveFilters) => void;
    stakeholders: Stakeholder[];
    intentLevels: IntentLevel[];
    needTypes: NeedType[];
    onManageIntentLevels: () => void;
    onManageNeedTypes: () => void;
    onClose: () => void;
}

const FilterCheckbox: React.FC<{ label: React.ReactNode; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-md cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600" />
        <span>{label}</span>
    </label>
);

const intentLevelColors: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-500',
};

export const LeadFilterDropdown: React.FC<LeadFilterDropdownProps> = ({ 
    filters, onFilterChange, stakeholders, intentLevels, needTypes, 
    onManageIntentLevels, onManageNeedTypes, onClose 
}) => {
    const [localFilters, setLocalFilters] = useState<ActiveFilters>(filters);

    useEffect(() => {
        const newFiltersCopy = {
            ...filters,
            ownerIds: new Set(filters.ownerIds),
            intentLevelIds: new Set(filters.intentLevelIds),
            needTypeIds: new Set(filters.needTypeIds),
        };
        setLocalFilters(newFiltersCopy);
    }, [filters]);

    const handleToggleSet = (key: keyof ActiveFilters, value: any) => {
        setLocalFilters(prev => {
            const newSet = new Set(prev[key]);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return { ...prev, [key]: newSet };
        });
    };
    
    const handleApply = () => {
        onFilterChange(localFilters);
        onClose();
    };

    const handleClear = () => {
        const cleared: ActiveFilters = { ...filters, ownerIds: new Set(), intentLevelIds: new Set(), needTypeIds: new Set() };
        setLocalFilters(cleared);
        onFilterChange(cleared);
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50">
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div>
                    <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Intent Level</h4>
                     <div className="space-y-1">
                        {intentLevels.map(level => (
                            <FilterCheckbox 
                                key={level.id} 
                                label={
                                    <span className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${intentLevelColors[level.color] || 'bg-slate-400'}`}></span>
                                        {level.name}
                                    </span>
                                }
                                checked={localFilters.intentLevelIds.has(level.id)} 
                                onChange={() => handleToggleSet('intentLevelIds', level.id)} 
                            />
                        ))}
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700"></div>
                <div>
                    <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Need Type</h4>
                     <div className="space-y-1">
                        {needTypes.map(type => (
                            <FilterCheckbox 
                                key={type.id} 
                                label={<span>{type.name}</span>}
                                checked={localFilters.needTypeIds.has(type.id)} 
                                onChange={() => handleToggleSet('needTypeIds', type.id)} 
                            />
                        ))}
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700"></div>
                 <div>
                    <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Record Owner</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                        {stakeholders.map(s => (
                           <FilterCheckbox key={s.id} label={s.name} checked={localFilters.ownerIds.has(s.id)} onChange={() => handleToggleSet('ownerIds', s.id)} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
                <Button variant="ghost" size="small" className="w-full justify-start" onClick={() => { onManageIntentLevels(); onClose(); }}>
                    <HiCog6Tooth className="w-4 h-4 mr-2"/>
                    Manage Intent Levels
                </Button>
                <Button variant="ghost" size="small" className="w-full justify-start" onClick={() => { onManageNeedTypes(); onClose(); }}>
                    <HiCog6Tooth className="w-4 h-4 mr-2"/>
                    Manage Need Types
                </Button>
            </div>
            <div className="flex justify-between items-center p-4 border-t bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-b-md">
                <Button variant="ghost" size="small" onClick={handleClear}>Clear All</Button>
                <Button size="small" onClick={handleApply}>Apply Filters</Button>
            </div>
        </div>
    );
};
