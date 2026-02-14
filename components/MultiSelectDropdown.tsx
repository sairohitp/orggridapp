
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Stakeholder } from '../types';
import { getInitials, getColorForId, ContactChip } from './ContactViews';
import { HiXMark } from 'react-icons/hi2';

interface MultiSelectDropdownProps {
  options: Stakeholder[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder: string;
  className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedIds, onChange, placeholder, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsById = useMemo(() => Object.fromEntries(options.map(o => [o.id, o])), [options]);
    
    const filteredOptions = useMemo(() => {
        return options.filter(option => 
            option.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            option.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const handleToggle = (id: string) => {
        const newSelectedIds = selectedIds.includes(id) 
            ? selectedIds.filter(sid => sid !== id) 
            : [...selectedIds, id];
        onChange(newSelectedIds);
    };
    
    const handleRemove = (id: string) => {
        onChange(selectedIds.filter(sid => sid !== id));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOptions = selectedIds.map(id => optionsById[id]).filter(Boolean);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm shadow-sm flex items-center flex-wrap gap-2 cursor-pointer min-h-[42px]"
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map(contact => <ContactChip key={contact.id} contact={contact} onRemove={handleRemove}/>)
                ) : (
                    <span className="text-slate-400 dark:text-slate-500 px-1">{placeholder}</span>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-10 no-scrollbar">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                         <input 
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-xs bg-slate-50 dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <ul className="py-1">
                        {filteredOptions.map(option => (
                            <li 
                                key={option.id} 
                                onClick={() => handleToggle(option.id)}
                                className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-3"
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(option.id)}
                                    readOnly
                                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-600"
                                />
                                <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${getColorForId(option.id)}`}>
                                        {getInitials(option.name)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{option.name}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs">{option.role}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};