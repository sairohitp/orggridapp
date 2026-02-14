import React from 'react';
import { Stakeholder } from '../types';
import { HiXMark } from 'react-icons/hi2';

// Helper to get initials and a color
export const getInitials = (name: string = '') => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0]?.[0] || '').toUpperCase();
};

const colors = [
  'bg-indigo-600',
  'bg-slate-500',
  'bg-indigo-400',
  'bg-slate-600',
  'bg-indigo-500',
  'bg-slate-400',
];

export const getColorForId = (id: string = '') => {
  const charCodeSum = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

// Avatar-only Pill for compact lists
export const ContactPill: React.FC<{ contact?: Stakeholder; onClick: (contact: Stakeholder) => void }> = ({ contact, onClick }) => {
  if (!contact) return null;

  return (
    <button
      type="button"
      onClick={() => onClick(contact)}
      className="relative group/pill flex items-center -ml-3 first:ml-0 transition-transform hover:scale-110 focus:outline-none focus:scale-110 focus:z-10"
      title={contact.name}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white dark:border-slate-800 group-hover/pill:border-indigo-400 dark:group-hover/pill:border-indigo-500 transition-all ${getColorForId(contact.id)}`}>
        {getInitials(contact.name)}
      </div>
    </button>
  );
};

export const ContactPillGroup: React.FC<{ contacts: (Stakeholder | undefined)[]; onContactClick: (contact: Stakeholder) => void; }> = ({ contacts, onContactClick }) => (
    <div className="flex">
        {contacts.map((c, i) => c && <ContactPill key={c.id || i} contact={c} onClick={onContactClick} />)}
    </div>
);


// Chip with Avatar and Name for selects and other contexts
export const ContactChip: React.FC<{
  contact: Stakeholder;
  onRemove?: (id: string) => void;
}> = ({ contact, onRemove }) => (
    <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full pl-1 pr-3 py-1 text-sm font-medium">
        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${getColorForId(contact.id)}`}>
            {getInitials(contact.name)}
        </div>
        <span className="truncate">{contact.name}</span>
        {onRemove && (
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(contact.id); }}
                className="-mr-1 p-0.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
                <HiXMark className="w-3.5 h-3.5"/>
            </button>
        )}
    </span>
);