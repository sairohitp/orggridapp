
import React, { useState, useEffect, useMemo } from 'react';
import { Connect, Organization, Status, Stakeholder } from '../types';
import { Button } from './Button';
import { HiXMark } from 'react-icons/hi2';
import { useAppContext } from '../contexts/AppContext';
import { SingleSelectDropdown } from './SingleSelectDropdown';
import { MultiSelectDropdown } from './MultiSelectDropdown';

const getInitialState = (statuses: Status[], internalStakeholders: Stakeholder[]): Omit<Connect, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> => ({
  title: '',
  startupId: '',
  corporateId: '',
  ownerId: internalStakeholders[0]?.id || '',
  statusId: statuses[0]?.id || '',
  date: new Date().toISOString().split('T')[0], // Default to today
  startupContactIds: [],
  corporateContactIds: [],
});

export const ConnectModal: React.FC = () => {
  const { 
    connectToEdit, 
    organizations, 
    stakeholdersById,
    statuses,
    internalStakeholders,
    actions
  } = useAppContext();

  const [formData, setFormData] = useState(getInitialState(statuses, internalStakeholders));

  const { startupOrgs, corporateOrgs } = useMemo(() => {
    const sorter = (a: Organization, b: Organization) => a.name.localeCompare(b.name);
    return {
      startupOrgs: organizations.filter(o => o.type === 'startup').sort(sorter),
      corporateOrgs: organizations.filter(o => o.type === 'corporate').sort(sorter),
    }
  }, [organizations]);

  const availableStartupContacts = useMemo(() => {
    if (!formData.startupId) return [];
    
    const org = organizations.find(o => o.id === formData.startupId);
    const orgContactIds = org?.contactIds || [];
    
    // Combine with currently selected contacts to ensure they are always in the options list,
    // which is crucial for editing existing connects.
    const allContactIds = [...new Set([...orgContactIds, ...formData.startupContactIds])];
    
    return allContactIds
        .map(id => stakeholdersById[id])
        .filter((c): c is Stakeholder => !!c)
        .sort((a,b) => a.name.localeCompare(b.name));
  }, [formData.startupId, formData.startupContactIds, organizations, stakeholdersById]);
  
  const availableCorporateContacts = useMemo(() => {
    if (!formData.corporateId) return [];
    const org = organizations.find(o => o.id === formData.corporateId);
    const orgContactIds = org?.contactIds || [];
    const allContactIds = [...new Set([...orgContactIds, ...formData.corporateContactIds])];
    return allContactIds
        .map(id => stakeholdersById[id])
        .filter((c): c is Stakeholder => !!c)
        .sort((a,b) => a.name.localeCompare(b.name));
  }, [formData.corporateId, formData.corporateContactIds, organizations, stakeholdersById]);
  
  const inputStyle = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelStyle = "text-sm font-semibold text-slate-700 dark:text-slate-300";

  useEffect(() => {
    if (connectToEdit) {
        setFormData({
            ...connectToEdit,
            date: new Date(connectToEdit.date).toISOString().split('T')[0] // Format for date input
        });
    } else {
        setFormData(getInitialState(statuses, internalStakeholders));
    }
  }, [connectToEdit, statuses, internalStakeholders]);

  const handleFormValueChange = (name: string, value: any) => {
    setFormData(prev => {
        const newState = { ...prev, [name]: value };
        // When an organization is changed, clear its respective contact selection.
        if (name === 'startupId' && prev.startupId !== value) {
            newState.startupContactIds = [];
        }
        if (name === 'corporateId' && prev.corporateId !== value) {
            newState.corporateContactIds = [];
        }
        return newState;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormValueChange(e.target.name, e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startupId || !formData.corporateId) {
        alert("Please select both a Startup and a Corporate organization.");
        return;
    }
    if (formData.startupContactIds.length === 0 || formData.corporateContactIds.length === 0) {
        alert("Please select at least one contact for both the Startup and the Corporate organization.");
        return;
    }
    const dataToSave = {
        ...formData,
        date: new Date(formData.date).toISOString() // Convert back to ISO string
    };

    actions.saveConnect(dataToSave as Connect);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative no-scrollbar">
        <button onClick={actions.closeConnectModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{connectToEdit ? 'Edit Connect' : 'Create New Connect'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Create a new deal folder to track all related activities.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label className={labelStyle}>Connect / Deal Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className={inputStyle} required placeholder="e.g. Series A Funding, Project Phoenix"/>
                </div>
                <div>
                    <label className={labelStyle}>Connect Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputStyle} required />
                </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Startup</h3>
              <SingleSelectDropdown
                  options={startupOrgs}
                  selectedId={formData.startupId}
                  onChange={(id) => handleFormValueChange('startupId', id)}
                  placeholder="Select a startup..."
              />
               <label className={labelStyle}>Startup Contacts</label>
               <MultiSelectDropdown
                    options={availableStartupContacts}
                    selectedIds={formData.startupContactIds}
                    onChange={(ids) => handleFormValueChange('startupContactIds', ids)}
                    placeholder="Select contacts..."
                    className={!formData.startupId ? 'opacity-50 pointer-events-none' : ''}
                />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Corporate</h3>
              <SingleSelectDropdown
                  options={corporateOrgs}
                  selectedId={formData.corporateId}
                  onChange={(id) => handleFormValueChange('corporateId', id)}
                  placeholder="Select a corporate..."
              />
               <label className={labelStyle}>Corporate Contacts</label>
                <MultiSelectDropdown
                    options={availableCorporateContacts}
                    selectedIds={formData.corporateContactIds}
                    onChange={(ids) => handleFormValueChange('corporateContactIds', ids)}
                    placeholder="Select contacts..."
                    className={!formData.corporateId ? 'opacity-50 pointer-events-none' : ''}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <label className={labelStyle}>Status</label>
              <select name="statusId" value={formData.statusId} onChange={handleInputChange} className={inputStyle}>
                {statuses.map(status => <option key={status.id} value={status.id}>{status.name}</option>)}
              </select>
            </div>
            <div>
                <label className={labelStyle}>Record Owner</label>
                <select name="ownerId" value={formData.ownerId} onChange={handleInputChange} className={inputStyle} required>
                    <option value="" disabled>Select an owner</option>
                    {internalStakeholders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={actions.closeConnectModal}>Cancel</Button>
            <Button type="submit">{connectToEdit ? 'Save Changes' : 'Create Connect'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
