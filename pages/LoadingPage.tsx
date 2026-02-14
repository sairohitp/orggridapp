import React from 'react';

const Spinner = () => (
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
);

export const LoadingPage: React.FC = () => {
    return (
        <div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
           <Spinner />
        </div>
    );
};