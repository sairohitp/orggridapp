

import React from 'react';
import { Stakeholder, StakeholderAffiliation } from '../types';
import { HiXMark } from 'react-icons/hi2';
import { getInitials, getColorForId } from './ContactViews';
import { useAppContext } from '../contexts/AppContext';

const AffiliationTag: React.FC<{ affiliation: StakeholderAffiliation }> = ({ affiliation }) => {
    const colors: Record<StakeholderAffiliation, string> = {
      internal: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 ring-blue-500/20',
      startup: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 ring-green-600/20',
      corporate: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 ring-purple-600/20',
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${colors[affiliation]}`}>
        {affiliation.charAt(0).toUpperCase() + affiliation.slice(1)}
      </span>
    );
};

export const ContactOverlay: React.FC = () => {
    const { viewingContact, stakeholderOrgMap, actions } = useAppContext();
    const contact = viewingContact; // for brevity
    
    if (!contact) return null;

    const organizationName = stakeholderOrgMap[contact.id];

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            actions.closeContact();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-white dark:bg-slate-900 w-full max-w-sm p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xl relative text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={actions.closeContact} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <HiXMark className="w-6 h-6"/>
                </button>
                
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 ring-4 ring-white/50 dark:ring-slate-800/50 ${getColorForId(contact.id)}`}>
                    {getInitials(contact.name)}
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{contact.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-base mb-4">{contact.role}</p>
                
                <div className="text-left space-y-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Affiliation</p>
                        <div className="mt-1">
                            <AffiliationTag affiliation={contact.affiliation} />
                        </div>
                    </div>

                    {contact.affiliation !== 'internal' && (
                         <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Organization</p>
                            <p className="text-slate-700 dark:text-slate-300 font-medium">{organizationName || <span className="text-slate-400 dark:text-slate-500">Not assigned</span>}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                        <button type="button" onClick={() => window.location.href = `mailto:${contact.email}`} className="text-indigo-600 dark:text-indigo-400 font-medium break-words hover:underline text-left">{contact.email}</button>
                    </div>
                     <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{contact.phone || <span className="text-slate-400 dark:text-slate-500">Not provided</span>}</p>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    0% {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};