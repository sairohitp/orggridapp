
import React from 'react';
import { Button } from './Button';
import { HiXMark, HiExclamationTriangle } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

export const ErrorModal: React.FC = () => {
    const { errorModalContent, actions } = useAppContext();

    if (!errorModalContent) {
        return null;
    }

    const { title, message } = errorModalContent;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                <button onClick={actions.closeErrorModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <HiXMark className="w-6 h-6"/>
                </button>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                        <HiExclamationTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{title}</h2>
                        <pre className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words font-sans text-sm mt-2">{message}</pre>
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={actions.closeErrorModal}>
                        Understood
                    </Button>
                </div>
            </div>
        </div>
    );
};
