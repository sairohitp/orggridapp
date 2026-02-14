
import React from 'react';
import { SuccessStory } from '../types';
import { HiPencil, HiTrash, HiCheckCircle, HiStar } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppContext } from '../contexts/AppContext';

interface SuccessStoryCardProps {
  story: SuccessStory;
}

export const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({ story }) => {
    const { connectsById, organizationsById, actions } = useAppContext();
    const connect = connectsById[story.connectId];

    if (!connect) {
        return (
            <div className="relative bg-white dark:bg-slate-800/50 border border-red-500 rounded-lg shadow-sm p-4">
                <p className="text-red-500">Error: Original Connect for this story not found.</p>
            </div>
        );
    }
    
    const startup = organizationsById[connect.startupId];
    const corporate = organizationsById[connect.corporateId];

    return (
        <div className="relative bg-white dark:bg-slate-800/50 border rounded-lg shadow-sm flex flex-col justify-between transition-all duration-200 border-slate-200 dark:border-slate-700 hover:shadow-md">
            <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                        <HiStar className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{story.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            From Connect: <span className="font-medium">{connect.title}</span>
                        </p>
                    </div>
                </div>
                
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none my-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {story.story}
                    </ReactMarkdown>
                </div>

                {story.keyOutcomes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2">Key Outcomes</h4>
                        <ul className="space-y-1.5">
                            {story.keyOutcomes.map((outcome, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                                    <span>{outcome}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700/50 px-4 py-2 mt-auto rounded-b-lg bg-slate-50/50 dark:bg-slate-800/20">
                 <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{startup?.name}</span> & <span className="font-semibold">{corporate?.name}</span>
                 </div>
                 <div className="flex gap-1">
                    <button onClick={() => actions.openSuccessStoryModal(connect.id)} title="Edit Story" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><HiPencil className="w-5 h-5"/></button>
                    <button onClick={() => actions.deleteSuccessStory(story.id)} title="Delete Story" className="p-2 text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"><HiTrash className="w-5 h-5"/></button>
                 </div>
            </div>
        </div>
    );
};
