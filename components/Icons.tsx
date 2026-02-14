
import React from 'react';
import { HiOutlineUsers, HiOutlinePhone, HiOutlineEnvelope, HiOutlinePencilSquare, HiOutlineFlag, HiOutlineDocumentText, HiOutlineChartBar, HiOutlineStar, HiOutlineRocketLaunch, HiOutlineBuildingOffice2, HiOutlineAcademicCap, HiOutlineTrash, HiOutlineChartPie, HiOutlineClock, HiOutlineClipboardDocumentList, HiOutlineLightBulb, HiOutlineBanknotes } from 'react-icons/hi2';
import { ActivityType } from '../types';

export const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const ActivityTypeIcon: React.FC<{ type: ActivityType; className?: string }> = ({ type, className = "w-5 h-5" }) => {
    switch (type) {
        case 'Meeting': return <HiOutlineUsers className={className} />;
        case 'Call': return <HiOutlinePhone className={className} />;
        case 'Email': return <HiOutlineEnvelope className={className} />;
        case 'Note': return <HiOutlinePencilSquare className={className} />;
        case 'Milestone': return <HiOutlineFlag className={className} />;
        default: return <HiOutlineDocumentText className={className} />;
    }
};

export const KPICardIcon: React.FC<{ type: 'connects' | 'success' | 'cycle' | 'activities' | 'leads' | 'revenue'; className?: string }> = ({ type, className = "w-7 h-7" }) => {
    switch (type) {
        case 'connects': return <HiOutlineRocketLaunch className={className} />;
        case 'success': return <HiOutlineChartPie className={className} />;
        case 'cycle': return <HiOutlineClock className={className} />;
        case 'activities': return <HiOutlineClipboardDocumentList className={className} />;
        case 'leads': return <HiOutlineLightBulb className={className} />;
        case 'revenue': return <HiOutlineBanknotes className={className} />;
        default: return <HiOutlineChartBar className={className} />;
    }
}
