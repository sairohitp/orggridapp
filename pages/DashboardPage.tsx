
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { PipelineChart } from '../components/dashboard/PipelineChart';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { RecordsByMonthChart } from '../components/dashboard/ConnectsByMonthChart';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { currencyFormatter } from '../utils';
import { LeadsByIntentChart } from '../components/dashboard/LeadsByIntentChart';
import { LeadsByNeedTypeChart } from '../components/dashboard/LeadsByNeedTypeChart';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-t-md
            ${active 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-600'
            }`
        }
    >
        {children}
    </button>
);

export const DashboardPage: React.FC = () => {
    const { dashboardStats } = useAppContext();
    const [activeTab, setActiveTab] = useState<'connects' | 'leads'>('connects');

    const ConnectsDashboard = () => (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <KPICard title="Active Connects" value={dashboardStats.totalActiveConnects.toString()} icon="connects" />
                <KPICard title="Success Rate" value={`${dashboardStats.successRate.toFixed(1)}%`} icon="success" />
                <KPICard title="Avg. Deal Cycle" value={`${dashboardStats.averageDealCycleDays} days`} icon="cycle" />
                <KPICard title="Activities Logged" value={dashboardStats.totalActivities.toString()} icon="activities" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Connects Created (Last 6 Months)">
                        <RecordsByMonthChart data={dashboardStats.connectsByMonth} />
                    </ChartCard>
                </div>
                 <ChartCard title="Deal Pipeline">
                    <PipelineChart data={dashboardStats.pipelineDistribution} />
                </ChartCard>
                 <ChartCard title="Activity Breakdown">
                    <ActivityChart data={dashboardStats.activityTypeDistribution} />
                </ChartCard>
                <div className="lg:col-span-2">
                    <ChartCard title="Recent Activity">
                        <RecentActivityFeed activities={dashboardStats.recentActivities} />
                    </ChartCard>
                </div>
            </div>
        </>
    );

    const LeadsDashboard = () => (
         <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <KPICard title="Active Leads" value={dashboardStats.totalActiveLeads.toString()} icon="leads" />
                <KPICard title="Total Potential Revenue" value={currencyFormatter.format(dashboardStats.totalLeadsPotentialRevenue)} icon="revenue" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="Leads Created (Last 6 Months)">
                        <RecordsByMonthChart data={dashboardStats.leadsByMonth} />
                    </ChartCard>
                </div>
                 <ChartCard title="Leads by Intent">
                    <LeadsByIntentChart data={dashboardStats.leadsByIntentDistribution} />
                </ChartCard>
                 <ChartCard title="Leads by Need Type">
                    <LeadsByNeedTypeChart data={dashboardStats.leadsByNeedTypeDistribution} />
                </ChartCard>
            </div>
        </>
    );

    return (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-6">
            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton active={activeTab === 'connects'} onClick={() => setActiveTab('connects')}>Connects</TabButton>
                    <TabButton active={activeTab === 'leads'} onClick={() => setActiveTab('leads')}>Leads</TabButton>
                </nav>
            </div>
            
            {activeTab === 'connects' ? <ConnectsDashboard /> : <LeadsDashboard />}
        </div>
    );
};
