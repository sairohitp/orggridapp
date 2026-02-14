import React from 'react';
import { Button } from './Button';
import { HiXMark, HiOutlineGlobeAlt, HiLink } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppContext } from '../contexts/AppContext';


export const IndustryInsightsModal: React.FC = () => {
  const { industryInsightsData, isIndustryInsightsLoading, actions } = useAppContext();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] flex flex-col p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button onClick={actions.closeIndustryInsightsModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
            <HiOutlineGlobeAlt className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Industry Insights</h2>
            <p className="text-slate-500 dark:text-slate-400">Powered by Gemini with Google Search</p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar -mx-8 px-8">
          {isIndustryInsightsLoading ? (
            <div className="flex flex-col justify-center h-full space-y-4 animate-pulse pt-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mt-6"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
            </div>
          ) : industryInsightsData ? (
            <>
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-4 prose-p:my-1 prose-ul:my-2 prose-li:my-0.5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {industryInsightsData.analysis}
                    </ReactMarkdown>
                </div>
                {industryInsightsData.sources && industryInsightsData.sources.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">Sources</h4>
                        <ul className="space-y-2">
                            {industryInsightsData.sources.map((source, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <HiLink className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline break-all" title={source.uri}>
                                        {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">No data available.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <Button type="button" variant="secondary" onClick={actions.closeIndustryInsightsModal}>Close</Button>
        </div>
      </div>
    </div>
  );
};