
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { HiXMark, HiPlus, HiTrash } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

export const SuccessStoryModal: React.FC = () => {
    const { 
        isSuccessStoryModalOpen,
        connectForStory,
        existingStory,
        actions
    } = useAppContext();
    
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [keyOutcomes, setKeyOutcomes] = useState<string[]>(['']);

    const inputStyle = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "text-sm font-semibold text-slate-700 dark:text-slate-300";

    useEffect(() => {
        if (isSuccessStoryModalOpen && connectForStory) {
            if (existingStory) {
                setTitle(existingStory.title);
                setStory(existingStory.story);
                setKeyOutcomes(existingStory.keyOutcomes.length > 0 ? existingStory.keyOutcomes : ['']);
            } else {
                setTitle(`Success Story for: ${connectForStory.title}`);
                setStory('');
                setKeyOutcomes(['']);
            }
        }
    }, [isSuccessStoryModalOpen, connectForStory, existingStory]);
    
    if (!isSuccessStoryModalOpen || !connectForStory) return null;

    const handleOutcomeChange = (index: number, value: string) => {
        const newOutcomes = [...keyOutcomes];
        newOutcomes[index] = value;
        setKeyOutcomes(newOutcomes);
    };

    const addOutcome = () => setKeyOutcomes([...keyOutcomes, '']);
    const removeOutcome = (index: number) => {
        if (keyOutcomes.length > 1) {
            setKeyOutcomes(keyOutcomes.filter((_, i) => i !== index));
        } else {
            setKeyOutcomes(['']); // Reset the last one if it's the only one
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalOutcomes = keyOutcomes.map(o => o.trim()).filter(Boolean);
        const storyData = {
            connectId: connectForStory.id,
            title,
            story,
            keyOutcomes: finalOutcomes,
        };
        actions.saveSuccessStory(storyData, existingStory?.id);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative no-scrollbar">
                <button onClick={actions.closeSuccessStoryModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <HiXMark className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{existingStory ? 'Edit Success Story' : 'Create Success Story'}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Based on the connect: "{connectForStory.title}"</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={labelStyle}>Story Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} required />
                    </div>
                     <div>
                        <label className={labelStyle}>Story (Markdown supported)</label>
                        <textarea value={story} onChange={(e) => setStory(e.target.value)} className={`${inputStyle} min-h-[150px]`} required />
                    </div>
                    <div>
                        <label className={labelStyle}>Key Outcomes</label>
                        <div className="space-y-2 mt-1">
                            {keyOutcomes.map((outcome, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" value={outcome} onChange={(e) => handleOutcomeChange(index, e.target.value)} placeholder={`Outcome #${index + 1}`} className={`${inputStyle} mt-0`} />
                                    <button type="button" onClick={() => removeOutcome(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-full">
                                        <HiTrash className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="secondary" size="small" onClick={addOutcome} className="mt-2">
                            <HiPlus className="w-4 h-4 mr-1"/> Add Outcome
                        </Button>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={actions.closeSuccessStoryModal}>Cancel</Button>
                        <Button type="submit">{existingStory ? 'Save Changes' : 'Create Story'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};