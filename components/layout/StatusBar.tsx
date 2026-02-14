import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

interface StatusBarProps {
  selectedCount: number;
  displayedCount: number;
  totalCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ selectedCount, displayedCount, totalCount }) => {
  return (
    <footer className="h-10 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 flex-shrink-0">
      <div>
        {selectedCount > 0 ? (
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedCount} item{selectedCount > 1 ? 's' : ''} selected</span>
        ) : (
          <span>Welcome to OrgGrid</span>
        )}
      </div>
      <div>
        <span>Showing {displayedCount} of {totalCount} records</span>
      </div>
    </footer>
  );
};