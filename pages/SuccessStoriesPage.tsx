
import React from 'react';
import { SuccessStory } from '../types';
import { SuccessStoryCard } from '../components/SuccessStoryCard';
import { useAppContext } from '../contexts/AppContext';

export const SuccessStoriesPage: React.FC = () => {
    const { displayedData } = useAppContext();
    const successStories = displayedData as SuccessStory[];

    if (successStories.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Success Stories Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Create your first success story from the 'Connects' page by clicking the star icon (⭐).
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {successStories.map(story => (
                    <SuccessStoryCard key={story.id} story={story} />
                ))}
            </div>
        </div>
    );
};
