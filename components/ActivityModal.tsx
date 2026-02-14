


import React, { useState, useMemo, useEffect } from 'react';
import { Activity, ActivityType, Stakeholder, Connect, Lead } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Button } from './Button';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { HiXMark } from 'react-icons/hi2';

export const ActivityModal: React.FC = () => {
    const { stakeholders, stakeholdersById, connectsById, leadsById, organizationsById, parentIdForActivity, parentTypeForActivity, activityToEdit, actions } = useAppContext();
    
    const [type, setType] = useState<ActivityType>('Note');
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    
    // States for different participant types
    const [startupParticipants, setStartupParticipants] = useState<string[]>([]);
    const [corporateParticipants, setCorporateParticipants] = useState<string[]>([]);
    const [leadParticipants, setLeadParticipants] = useState<string[]>([]);


    const parentRecord = useMemo(() => {
        if (!parentIdForActivity) return null;
        return parentTypeForActivity === 'connect' ? connectsById[parentIdForActivity] : leadsById[parentIdForActivity];
    }, [parentIdForActivity, parentTypeForActivity, connectsById, leadsById]);

    const { startupContacts, corporateContacts, allNonInternalStakeholders } = useMemo(() => {
        if (!parentRecord) return { startupContacts: [], corporateContacts: [], allNonInternalStakeholders: [] };

        if (parentTypeForActivity === 'connect') {
             const connect = parentRecord as Connect;
             const getContactsFromIds = (ids: string[]) => ids.map(id => stakeholdersById[id]).filter((s): s is Stakeholder => !!s);
             return {
                startupContacts: getContactsFromIds(connect.startupContactIds),
                corporateContacts: getContactsFromIds(connect.corporateContactIds),
                allNonInternalStakeholders: []
            };
        } else {
            return {
                startupContacts: [],
                corporateContacts: [],
                allNonInternalStakeholders: stakeholders.filter(s => s.affiliation !== 'internal')
            }
        }
    }, [parentRecord, parentTypeForActivity, stakeholdersById, stakeholders]);
    
    useEffect(() => {
        if (parentIdForActivity) {
            if (activityToEdit) {
                setType(activityToEdit.type);
                setTitle(activityToEdit.title);
                setNotes(activityToEdit.notes || '');

                if(parentTypeForActivity === 'connect') {
                    const startupContactIds = startupContacts.map(c => c.id);
                    const corporateContactIds = corporateContacts.map(c => c.id);
                    setStartupParticipants(activityToEdit.participants.filter(pId => startupContactIds.includes(pId)));
                    setCorporateParticipants(activityToEdit.participants.filter(pId => corporateContactIds.includes(pId)));
                    setLeadParticipants([]);
                } else {
                    setLeadParticipants(activityToEdit.participants);
                    setStartupParticipants([]);
                    setCorporateParticipants([]);
                }
            } else {
                // Reset form for new activity
                setType('Note');
                setTitle('');
                setNotes('');
                setStartupParticipants([]);
                setCorporateParticipants([]);
                setLeadParticipants([]);
            }
        }
    }, [parentIdForActivity, parentTypeForActivity, activityToEdit, startupContacts, corporateContacts]);
    
    if (!parentIdForActivity || !parentRecord) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        const allParticipants = parentTypeForActivity === 'connect' 
            ? [...new Set([...startupParticipants, ...corporateParticipants])]
            : leadParticipants;
        
        const activityData: Partial<Activity> = {
            type,
            title,
            notes,
            date: activityToEdit?.date || new Date().toISOString(),
            participants: allParticipants,
        };
        
        if (parentTypeForActivity === 'connect') activityData.connectId = parentIdForActivity;
        if (parentTypeForActivity === 'lead') activityData.leadId = parentIdForActivity;
        
        if (activityToEdit) {
            activityData.id = activityToEdit.id;
            activityData.authorId = activityToEdit.authorId;
        }
        
        await actions.saveActivity(activityData);
    };
    
    const inputStyle = "w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "text-sm font-semibold text-slate-700 dark:text-slate-300";
    const subLabelStyle = "text-xs font-semibold text-slate-500 dark:text-slate-400";
    
    const startupName = parentTypeForActivity === 'connect' ? organizationsById[(parentRecord as Connect).startupId]?.name : '';
    const corporateName = parentTypeForActivity === 'connect' ? organizationsById[(parentRecord as Connect).corporateId]?.name : '';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative no-scrollbar">
                <button onClick={actions.closeActivityModal} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <HiXMark className="w-6 h-6"/>
                </button>
                <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{activityToEdit ? 'Edit Activity' : 'Add Activity'}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Log an interaction for: "{(parentRecord as Connect).title || (parentRecord as Lead).name}"</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className={labelStyle}>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value as ActivityType)} className={inputStyle}>
                                <option>Note</option>
                                <option>Meeting</option>
                                <option>Call</option>
                                <option>Email</option>
                                <option>Milestone</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelStyle}>Title / Subject</label>
                            <input type="text" placeholder="e.g., Follow-up call with engineering" value={title} onChange={e => setTitle(e.target.value)} className={inputStyle} required />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Notes (Markdown supported)</label>
                        <textarea placeholder="Add details about the activity..." value={notes} onChange={e => setNotes(e.target.value)} className={`${inputStyle} min-h-[100px]`}></textarea>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <label className={labelStyle}>Participants</label>
                        {parentTypeForActivity === 'connect' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={subLabelStyle}>{startupName} Contacts</label>
                                    <MultiSelectDropdown
                                        options={startupContacts}
                                        selectedIds={startupParticipants}
                                        onChange={setStartupParticipants}
                                        placeholder="Select startup contacts..."
                                    />
                                </div>
                                 <div>
                                    <label className={subLabelStyle}>{corporateName} Contacts</label>
                                    <MultiSelectDropdown
                                        options={corporateContacts}
                                        selectedIds={corporateParticipants}
                                        onChange={setCorporateParticipants}
                                        placeholder="Select corporate contacts..."
                                    />
                                </div>
                            </div>
                        ) : (
                             <div>
                                <MultiSelectDropdown
                                    options={allNonInternalStakeholders}
                                    selectedIds={leadParticipants}
                                    onChange={setLeadParticipants}
                                    placeholder="Select participants..."
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button type="button" variant="secondary" onClick={actions.closeActivityModal}>Cancel</Button>
                        <Button type="submit">{activityToEdit ? 'Save Changes' : 'Add Activity'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};