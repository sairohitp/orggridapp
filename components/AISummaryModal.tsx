
import React from 'react';
import { Button } from './Button';
import { HiXMark, HiSparkles } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppContext } from '../contexts/AppContext';


export const AISummaryModal: React.FC = () => {
  const { summaryContent, isSummaryLoading, actions } = useAppContext();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] flex flex-col p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button onClick={actions.closeSummaryModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
            <HiSparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Summary & Next Steps</h2>
            <p className="text-slate-500 dark:text-slate-400">Powered by Gemini</p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar">
          {isSummaryLoading ? (
            <div className="flex flex-col justify-center h-full space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mt-6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-h2:mb-2 prose-h2:mt-4 prose-p:my-1 prose-ul:my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summaryContent}
                </ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <Button type="button" variant="secondary" onClick={actions.closeSummaryModal}>Close</Button>
        </div>
      </div>
    </div>
  );
};