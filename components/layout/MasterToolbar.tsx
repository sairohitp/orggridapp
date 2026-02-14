
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../Button';
import { 
    HiPlus, HiSquares2X2, HiListBullet, HiArrowUpTray, HiArrowDownTray,
    HiArrowPath, HiTrash, HiXMark, HiFunnel
} from 'react-icons/hi2';
import { FilterDropdown } from '../FilterDropdown';
import { useAppContext } from '../../contexts/AppContext';
import { LeadFilterDropdown } from '../LeadFilterDropdown';

export const MasterToolbar: React.FC = () => {
    const { 
        activeView, searchQuery, viewMode, selectedIds,
        filters, activeFilterCount, internalStakeholders,
        statuses, intentLevels, needTypes,
        actions
    } = useAppContext();
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterBtnRef = useRef<HTMLDivElement>(null);

    const isBulkMode = selectedIds.size > 0;
    const isTrashView = activeView === 'trash';
    const showImportExport = ['connects', 'leads', 'startups', 'corporates', 'stakeholders'].includes(activeView);
    const showAddNew = ['connects', 'leads', 'startups', 'corporates', 'stakeholders', 'admin'].includes(activeView);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterBtnRef.current && !filterBtnRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
        <header className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between h-16 z-20">
            {/* Left Side: Search & Filters, or Bulk Actions */}
            <div className="flex-1 flex items-center h-full">
                 {/* Normal Mode Controls */}
                <div className={`flex items-center gap-2 transition-opacity duration-300 ${isBulkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="relative">
                        <input 
                            type="search" 
                            placeholder="Search..." 
                            value={searchQuery} 
                            onChange={(e) => actions.setSearchQuery(e.target.value)} 
                            className="w-80 pl-4 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 shadow-sm bg-white dark:bg-slate-700" 
                        />
                    </div>
                    {(activeView === 'connects' || activeView === 'leads') && (
                        <div className="relative" ref={filterBtnRef}>
                             <Button variant="secondary" onClick={() => setIsFilterOpen(o => !o)}>
                                <HiFunnel className="w-4 h-4 mr-2"/>
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>
                                )}
                            </Button>
                             {isFilterOpen && activeView === 'connects' && (
                                <FilterDropdown 
                                    filters={filters}
                                    onFilterChange={actions.handleFilterChange}
                                    stakeholders={internalStakeholders}
                                    statuses={statuses}
                                    onManageStatuses={actions.openStatusModal}
                                    onClose={() => setIsFilterOpen(false)}
                                />
                            )}
                             {isFilterOpen && activeView === 'leads' && (
                                <LeadFilterDropdown
                                    filters={filters}
                                    onFilterChange={actions.handleFilterChange}
                                    stakeholders={internalStakeholders}
                                    intentLevels={intentLevels}
                                    needTypes={needTypes}
                                    onManageIntentLevels={actions.openIntentLevelModal}
                                    onManageNeedTypes={actions.openNeedTypeModal}
                                    onClose={() => setIsFilterOpen(false)}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Bulk Mode Controls */}
                <div className={`absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4 transition-all duration-300 ${isBulkMode ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                     <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{selectedIds.size} selected</span>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center gap-2">
                        {isTrashView ? (
                            <>
                                <Button variant="ghost" size="small" onClick={() => actions.handleBulkAction('restore')} className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><HiArrowPath className="w-4 h-4 mr-1.5"/> Restore</Button>
                                <Button variant="ghost" size="small" onClick={() => actions.handleBulkAction('delete')} className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10"><HiTrash className="w-4 h-4 mr-1.5"/> Delete Permanently</Button>
                            </>
                        ) : (
                            <>
                                {activeView === 'connects' && <Button variant="ghost" size="small" onClick={() => actions.handleBulkAction('export')} className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><HiArrowDownTray className="w-4 h-4 mr-1.5"/> Export CSV</Button>}
                                <Button variant="ghost" size="small" onClick={() => actions.handleBulkAction('delete')} className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10"><HiTrash className="w-4 h-4 mr-1.5"/> To Trash</Button>
                            </>
                        )}
                    </div>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                    <button onClick={actions.clearSelection} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Clear selection"><HiXMark className="w-5 h-5"/></button>
                </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex-shrink-0 flex items-center gap-2">
                {(activeView === 'connects' || activeView === 'leads' || activeView === 'trash') && (
                    <div className="flex items-center rounded-md bg-slate-200 dark:bg-slate-700 p-0.5">
                    <button onClick={() => actions.setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} aria-label="List View"><HiListBullet className="w-5 h-5"/></button>
                    <button onClick={() => actions.setViewMode('card')} className={`p-1.5 rounded-md ${viewMode === 'card' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} aria-label="Card View"><HiSquares2X2 className="w-5 h-5"/></button>
                    </div>
                )}
                {showImportExport && <Button variant="secondary" onClick={actions.openImportModal}><HiArrowUpTray className="w-4 h-4 mr-2"/> Import</Button>}
                {showImportExport && <Button variant="secondary" onClick={actions.handleExport}><HiArrowDownTray className="w-4 h-4 mr-2"/> Export</Button>}
                {showAddNew && <Button onClick={actions.handleOpenAddNew}><HiPlus className="w-5 h-5 mr-1"/> Add New</Button>}
            </div>
        </header>
    );
};