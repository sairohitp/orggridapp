
import React, { useState } from 'react';
import { NeedType } from '../types';
import { Button } from './Button';
import { HiXMark, HiPencil, HiTrash } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';

const initialFormState = { id: '', name: '' };

export const NeedTypeManagementModal: React.FC = () => {
  const { needTypes, needTypeUsageCount, actions } = useAppContext();
  
  const [formData, setFormData] = useState<NeedType | Omit<NeedType, 'id'>>(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleEdit = (type: NeedType) => {
      setFormData(type);
      setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
      setFormData(initialFormState);
      setIsEditing(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '') return;
    actions.saveNeedType(formData as NeedType);
    handleCancelEdit();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button onClick={actions.closeNeedTypeModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Manage Need Types</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Add, edit, or delete your custom lead need types.</p>
        
        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2 no-scrollbar">
            {needTypes.map(type => (
                <div key={type.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{type.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {needTypeUsageCount[type.id] || 0} in use
                        </span>
                        <button onClick={() => handleEdit(type)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"><HiPencil className="w-4 h-4"/></button>
                        <button 
                            onClick={() => actions.deleteNeedType(type.id)} 
                            disabled={(needTypeUsageCount[type.id] || 0) > 0}
                            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        >
                            <HiTrash className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold">{isEditing ? 'Edit Need Type' : 'Add New Need Type'}</h3>
            <div>
                 <label htmlFor="typeName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type Name</label>
                 <input
                    id="typeName"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., 'Market Expansion'"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm"
                    required
                />
            </div>
            <div className="flex justify-end gap-3 mt-4">
                {isEditing && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>}
                <Button type="submit">{isEditing ? 'Save Changes' : 'Add Type'}</Button>
            </div>
        </form>
      </div>
    </div>
  );
};
