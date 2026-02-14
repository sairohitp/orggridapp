
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';

interface Option {
  id: string;
  name: string;
}

interface SingleSelectDropdownProps {
  options: Option[];
  selectedId: string;
  onChange: (selectedId: string) => void;
  placeholder: string;
  className?: string;
}

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({ options, selectedId, onChange, placeholder, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const optionsById = useMemo(() => Object.fromEntries(options.map(o => [o.id, o])), [options]);
    
    const filteredOptions = useMemo(() => {
        return options.filter(option => 
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
        setSearchTerm('');
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

    const selectedOption = optionsById[selectedId];

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm shadow-sm flex items-center justify-between text-left min-h-[42px]"
            >
                {selectedOption ? (
                    <span className="text-slate-900 dark:text-slate-100">{selectedOption.name}</span>
                ) : (
                    <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
                )}
                <HiChevronUpDown className="h-5 w-5 text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-20 no-scrollbar">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
                         <input 
                            type="text"
                            placeholder="Search organizations..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-xs bg-slate-50 dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <ul className="py-1">
                        {filteredOptions.length > 0 ? filteredOptions.map(option => (
                            <li 
                                key={option.id} 
                                onClick={() => handleSelect(option.id)}
                                className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
                            >
                                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{option.name}</p>
                                {selectedId === option.id && <HiCheck className="w-5 h-5 text-indigo-600" />}
                            </li>
                        )) : (
                            <li className="px-3 py-2 text-sm text-slate-500">No results found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
