import React from 'react';
import { HiComputerDesktop } from 'react-icons/hi2';

export const MobileBlocker: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-900 lg:hidden">
            <div className="text-center">
                <HiComputerDesktop className="mx-auto h-16 w-16 text-indigo-500" />
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Optimized for Desktop
                </h1>
                <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                    This application is best experienced on a larger screen.
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                    Mobile support is coming soon!
                </p>
            </div>
        </div>
    );
};
