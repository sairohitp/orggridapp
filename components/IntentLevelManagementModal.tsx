
import React, { useState } from 'react';
import { IntentLevel } from '../types';
import { Button } from './Button';
import { HiXMark, HiPencil, HiTrash } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

const colors = [
  'red', 'yellow', 'green', 'blue', 'purple', 'slate'
];

const intentLevelColors: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  slate: 'bg-slate-500',
};

const getTextColor = (color: string) => {
    const lightBg = `bg-${color}-100`;
    const darkBg = `dark:bg-${color}-500/20`;
    const lightText = `text-${color}-800`;
    const darkText = `dark:text-${color}-300`;
    const ring = `ring-${color}-600/20`;
    return `${lightBg} ${darkBg} ${lightText} ${darkText} ring-1 ring-inset ${ring}`;
};

const initialFormState = { id: '', name: '', color: 'blue' };

export const IntentLevelManagementModal: React.FC = () => {
  const { intentLevels, intentLevelUsageCount, actions } = useAppContext();
  
  const [formData, setFormData] = useState<IntentLevel | Omit<IntentLevel, 'id'>>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const handleEdit = (level: IntentLevel) => {
      setFormData(level);
      setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
      setFormData(initialFormState);
      setIsEditing(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '') return;
    actions.saveIntentLevel(formData as IntentLevel);
    handleCancelEdit();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button onClick={actions.closeIntentLevelModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Manage Intent Levels</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Add, edit, or delete your custom lead intent levels.</p>
        
        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2 no-scrollbar">
            {intentLevels.map(level => (
                <div key={level.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-800/50">
                    <span className={`inline-flex items-center gap-x-2 rounded-md px-2 py-1 text-xs font-medium ${getTextColor(level.color)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${intentLevelColors[level.color]}`}></span>
                        {level.name}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {intentLevelUsageCount[level.id] || 0} in use
                        </span>
                        <button onClick={() => handleEdit(level)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><HiPencil className="w-4 h-4"/></button>
                        <button 
                            onClick={() => actions.deleteIntentLevel(level.id)} 
                            disabled={(intentLevelUsageCount[level.id] || 0) > 0}
                            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        >
                            <HiTrash className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold">{isEditing ? 'Edit Intent Level' : 'Add New Intent Level'}</h3>
            <div>
                 <label htmlFor="levelName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Level Name</label>
                 <input
                    id="levelName"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., 'Warm'"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm"
                    required
                />
            </div>
            <div>
                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Color</label>
                 <div className="grid grid-cols-6 gap-2 mt-2">
                    {colors.map(color => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => handleColorChange(color)}
                            className={`w-full h-8 rounded-md transition-all ${intentLevelColors[color]} ${formData.color === color ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-indigo-500' : 'hover:scale-110'}`}
                        ></button>
                    ))}
                 </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
                {isEditing && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                <Button type="submit">{isEditing ? 'Save Changes' : 'Add Level'}</Button>
            </div>
        </form>
      </div>
    </div>
  );
};
