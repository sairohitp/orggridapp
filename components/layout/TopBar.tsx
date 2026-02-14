


import React, { useState, useRef, useEffect } from 'react';
import { HiUserCircle, HiSun, HiMoon } from 'react-icons/hi2';
import type { ActiveView, Theme } from '../../types';
import type { User } from '../../services/firebase';
import { useAppContext } from '../../contexts/AppContext';

const viewTitles: Record<ActiveView, string> = {
    connects: 'Connects',
    leads: 'Leads',
    startups: 'Startups',
    corporates: 'Corporates',
    stakeholders: 'Contacts',
    statistics: 'Statistics',
    success: 'Success Stories',
    trash: 'Trash',
    admin: 'User Management',
};

const AccountDropdown: React.FC<{ user: User | null; onLogout: () => void; }> = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        onLogout();
    }

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="User avatar" className="w-full h-full rounded-full" />
                ) : (
                    <HiUserCircle className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                    {user && (
                         <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 mb-1">
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{user.displayName || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                    )}
                    <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Account Settings</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Help</button>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">Logout</button>
                </div>
            )}
        </div>
    );
}

const ThemeToggle: React.FC<{ theme: Theme; onThemeChange: (t: Theme) => void }> = ({ theme, onThemeChange }) => (
    <button onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
        {theme === 'light' ? <HiMoon className="w-5 h-5 text-slate-500" /> : <HiSun className="w-5 h-5 text-amber-400" />}
    </button>
);


interface TopBarProps {
    onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
    const { activeView, theme, user, actions } = useAppContext();
    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between h-16 flex-shrink-0">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{viewTitles[activeView] || 'Dashboard'}</h1>
            <div className="flex items-center gap-4">
                <ThemeToggle theme={theme} onThemeChange={actions.setTheme} />
                <AccountDropdown user={user} onLogout={onLogout} />
            </div>
        </header>
    );
};