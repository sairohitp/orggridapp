import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { HiXMark, HiArrowUpTray, HiCheckCircle } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

export const ImportModal: React.FC = () => {
    const { activeView, actions } = useAppContext();
    
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const requiredHeaders = actions.getRequiredHeaders(activeView);
    const headerDisclaimer = actions.getHeaderDisclaimer(activeView);

    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(isEntering);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (e.dataTransfer.files[0].type === 'text/csv' || e.dataTransfer.files[0].name.endsWith('.csv')) {
                setFile(e.dataTransfer.files[0]);
            } else {
                alert('Please upload a valid .csv file.');
            }
        }
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const handleImportClick = () => {
        if (file) {
            actions.handleFileImport(file);
        }
    };
    
    const handleClose = () => {
        setFile(null);
        setDragging(false);
        actions.closeImportModal();
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
                <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <HiXMark className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Import from CSV</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Create or update records in '{activeView}' by uploading a CSV file.</p>
                
                <div className="space-y-6">
                    <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">CSV Requirements</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Your CSV must include headers for at least the following columns:</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {requiredHeaders.map(header => (
                                <code key={header} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-sm rounded-md text-slate-700 dark:text-slate-300">{header}</code>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{headerDisclaimer}</p>
                    </div>

                    <div 
                        onDragEnter={(e) => handleDragEvent(e, true)}
                        onDragLeave={(e) => handleDragEvent(e, false)}
                        onDragOver={(e) => handleDragEvent(e, true)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-200
                            ${dragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'}
                        `}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv" />
                        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                           <HiArrowUpTray className="w-12 h-12 mb-3" />
                           <p className="font-semibold">Drop CSV file here or <span className="text-indigo-600 dark:text-indigo-400">click to browse</span></p>
                           <p className="text-sm">Max file size: 5MB</p>
                        </div>
                    </div>
                    
                    {file && (
                        <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                           <HiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                           <div className="text-sm">
                                <p className="font-bold text-green-800 dark:text-green-200">File Ready for Import</p>
                                <p className="text-green-700 dark:text-green-300">{file.name} - {(file.size / 1024).toFixed(2)} KB</p>
                           </div>
                           <button onClick={() => setFile(null)} className="ml-auto p-1 text-slate-500 hover:text-slate-800"><HiXMark/></button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="button" onClick={handleImportClick} disabled={!file}>Import File</Button>
                </div>
            </div>
        </div>
    );
};