


import React from 'react';
import { 
    HiOutlineDocumentText, HiOutlineChartBar, HiOutlineStar, HiOutlineRocketLaunch, 
    HiOutlineBuildingOffice2, HiOutlineAcademicCap, HiOutlineTrash, HiOutlineCog6Tooth,
    HiOutlineLightBulb
} from 'react-icons/hi2';
import { ActiveView } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

const NavItem: React.FC<{
  href: string;
  active: boolean; 
  icon: React.ReactNode; 
  label: string;
  onClick: (href: string) => void;
}> = ({href, active, icon, label, onClick}) => (
  <button onClick={() => onClick(href)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left ${active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100'}`}>
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

export const Sidebar: React.FC = () => {
    const { activeView, user, currentUserStakeholder } = useAppContext();
    const handleNav = (href: string) => {
        window.location.hash = href;
    };

    return (
      <aside className="w-60 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-4 flex flex-col space-y-2 flex-shrink-0">
        <div className="px-2 py-2 mb-2"><h1 className="text-2xl font-black text-slate-800 dark:text-white">OrgGrid</h1></div>
        <nav className="flex-grow space-y-1.5 pt-2">
          <p className="px-3 pb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Master Data</p>
          <NavItem href="#/connects" onClick={handleNav} active={activeView === 'connects'} icon={<HiOutlineDocumentText className="w-5 h-5"/>} label="Connects" />
          <NavItem href="#/leads" onClick={handleNav} active={activeView === 'leads'} icon={<HiOutlineLightBulb className="w-5 h-5"/>} label="Leads" />
          <NavItem href="#/startups" onClick={handleNav} active={activeView === 'startups'} icon={<HiOutlineRocketLaunch className="w-5 h-5"/>} label="Startups" />
          <NavItem href="#/corporates" onClick={handleNav} active={activeView === 'corporates'} icon={<HiOutlineBuildingOffice2 className="w-5 h-5"/>} label="Corporates" />
          <NavItem href="#/stakeholders" onClick={handleNav} active={activeView === 'stakeholders'} icon={<HiOutlineAcademicCap className="w-5 h-5"/>} label="Contacts" />
          <p className="px-3 pt-4 pb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Reports</p>
          <NavItem href="#/statistics" onClick={handleNav} active={activeView === 'statistics'} icon={<HiOutlineChartBar className="w-5 h-5"/>} label="Statistics" />
          <NavItem href="#/success" onClick={handleNav} active={activeView === 'success'} icon={<HiOutlineStar className="w-5 h-5"/>} label="Success Stories" />
        </nav>
        <div className="mt-auto">
             <div className="px-3 pb-4 space-y-2">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Workspace</p>
                <div className="flex items-center gap-2" title={user.email || ''}>
                    <img src={user.photoURL || ''} alt="User Avatar" className="w-6 h-6 rounded-full"/>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user.email}</span>
                </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                {currentUserStakeholder?.affiliation === 'internal' && (
                    <NavItem href="#/admin" onClick={handleNav} active={activeView === 'admin'} icon={<HiOutlineCog6Tooth className="w-5 h-5"/>} label="Admin" />
                )}
                <NavItem href="#/trash" onClick={handleNav} active={activeView === 'trash'} icon={<HiOutlineTrash className="w-5 h-5"/>} label="Trash" />
            </div>
        </div>
      </aside>
    );
};