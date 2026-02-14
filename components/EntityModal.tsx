
import React, { useState, useEffect } from 'react';
import { Organization, Stakeholder, Entity } from '../types';
import { Button } from './Button';
import { HiXMark } from 'react-icons/hi2';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { useAppContext } from '../contexts/AppContext';

const getInitialState = (type: 'organization' | 'stakeholder', defaultOrgType?: 'startup' | 'corporate'): Partial<Entity> => {
    if (type === 'organization') {
        return { name: '', type: defaultOrgType || 'startup', ownerId: '', contactIds: [] };
    }
    return { name: '', role: '', email: '', phone: '', affiliation: 'startup' };
};

export const EntityModal: React.FC = () => {
  const { 
    entityType, 
    entityToEdit, 
    defaultOrgType,
    stakeholders, 
    internalStakeholders,
    actions 
  } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Entity>>({});

  const inputStyle = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md mt-1 bg-white dark:bg-slate-800 text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelStyle = "text-sm font-semibold text-slate-700 dark:text-slate-300";

  useEffect(() => {
    if (entityToEdit) {
      setFormData(entityToEdit);
    } else {
      setFormData(getInitialState(entityType, defaultOrgType));
    }
  }, [entityToEdit, entityType, defaultOrgType]);

  const handleFormValueChange = (name: string, value: any) => {
    setFormData(prev => {
        const newState: Partial<Entity> = { ...prev, [name]: value };
        // If the organization type changes, reset the selected contacts
        // as the available contacts are filtered by this type.
        if (name === 'type') {
            (newState as Organization).contactIds = [];
        }
        return newState;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleFormValueChange(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.saveEntity(formData as Entity);
  };
  
  const isOrganization = entityType === 'organization';
  const orgData = formData as Partial<Organization>;
  const stakeholderData = formData as Partial<Stakeholder>;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <button onClick={actions.closeEntityModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <HiXMark className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">
          {entityToEdit ? 'Edit' : 'Create'} {isOrganization ? 'Organization' : 'Stakeholder'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {isOrganization ? 'Manage startup or corporate details.' : 'Manage contact information for an individual.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelStyle}>Name</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={inputStyle} required />
          </div>

          {isOrganization ? (
            <>
              <div>
                <label className={labelStyle}>Type</label>
                <select name="type" value={orgData.type} onChange={handleInputChange} className={inputStyle} required>
                  <option value="startup">Startup</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Record Owner</label>
                <select name="ownerId" value={orgData.ownerId || ''} onChange={handleInputChange} className={inputStyle}>
                  <option value="">Select an owner</option>
                  {internalStakeholders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
               <div>
                <label className={labelStyle}>Contacts</label>
                <MultiSelectDropdown 
                    options={stakeholders.filter(s => s.affiliation === orgData.type)}
                    selectedIds={orgData.contactIds || []}
                    onChange={(ids) => handleFormValueChange('contactIds', ids)}
                    placeholder="Assign contacts to this organization..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelStyle}>Role</label>
                <input type="text" name="role" value={stakeholderData.role || ''} onChange={handleInputChange} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>Email</label>
                <input type="email" name="email" value={stakeholderData.email || ''} onChange={handleInputChange} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>Phone</label>
                <input type="tel" name="phone" value={stakeholderData.phone || ''} onChange={handleInputChange} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Affiliation</label>
                <select name="affiliation" value={stakeholderData.affiliation} onChange={handleInputChange} className={inputStyle} required>
                  <option value="startup">Startup</option>
                  <option value="corporate">Corporate</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={actions.closeEntityModal}>Cancel</Button>
            <Button type="submit">{entityToEdit ? 'Save Changes' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
