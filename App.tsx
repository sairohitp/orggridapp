
import React, { useState, useEffect, useRef } from 'react';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { MasterToolbar } from './components/layout/MasterToolbar';
import { StatusBar } from './components/layout/StatusBar';
import { ConnectsPage } from './pages/ConnectsPage';
import { EntitiesPage } from './pages/EntitiesPage';
import { TrashPage } from './pages/TrashPage';
import { DashboardPage } from './pages/DashboardPage';
import { TopBar } from './components/layout/TopBar';
import { StatusManagementModal } from './components/StatusManagementModal';
import { ImportModal } from './components/ImportModal';
import { AISummaryModal } from './components/AISummaryModal';
import { ConnectModal } from './components/ConnectModal';
import { EntityModal } from './components/EntityModal';
import { ContactOverlay } from './components/ContactOverlay';
import { onAuthStateChanged, signOutUser, User } from './services/firebase';
import { LoginPage } from './pages/LoginPage';
import { LoadingPage } from './pages/LoadingPage';
import { MobileBlocker } from './components/layout/MobileBlocker';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { SuccessStoryModal } from './components/SuccessStoryModal';
import { DeletionGuardModal } from './components/DeletionGuardModal';
import { IndustryInsightsModal } from './components/IndustryInsightsModal';
import { ActivityModal } from './components/ActivityModal';
import { AdminPage } from './pages/AdminPage';
import { ConfirmationModal } from './components/ConfirmationModal';
import { OrganizationDeletionGuardModal } from './components/OrganizationDeletionGuardModal';
import { LeadsPage } from './pages/LeadsPage';
import { LeadModal } from './components/LeadModal';
import { ErrorModal } from './components/ErrorModal';
import { IntentLevelManagementModal } from './components/IntentLevelManagementModal';
import { NeedTypeManagementModal } from './components/NeedTypeManagementModal';
import { ActivityHistoryModal } from './components/ActivityHistoryModal';

const PageRenderer: React.FC = () => {
    const { activeView } = useAppContext();
    
    switch(activeView) {
      case 'connects':
        return <ConnectsPage />
      case 'leads':
        return <LeadsPage />
      case 'startups':
      case 'corporates':
      case 'stakeholders':
        return <EntitiesPage />
      case 'trash':
        return <TrashPage />
      case 'success':
        return <SuccessStoriesPage />;
      case 'statistics':
        return <DashboardPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return null;
    }
}

const AppModals: React.FC = () => {
    const { 
        isConnectModalOpen, isEntityModalOpen, viewingContact,
        isStatusModalOpen, isImportModalOpen, isSummaryModalOpen,
        isSuccessStoryModalOpen, isDeletionGuardModalOpen,
        isIndustryInsightsModalOpen, isActivityModalOpen,
        isConfirmationModalOpen, isOrgDeletionGuardModalOpen,
        isLeadModalOpen, isErrorModalOpen,
        isIntentLevelModalOpen, isNeedTypeModalOpen,
        isActivityHistoryModalOpen,
    } = useAppContext();

    return (
        <>
            {isConnectModalOpen && <ConnectModal />}
            {isLeadModalOpen && <LeadModal />}
            {isEntityModalOpen && <EntityModal />}
            {isActivityModalOpen && <ActivityModal />}
            {isActivityHistoryModalOpen && <ActivityHistoryModal />}
            {viewingContact && <ContactOverlay />}
            {isStatusModalOpen && <StatusManagementModal />}
            {isIntentLevelModalOpen && <IntentLevelManagementModal />}
            {isNeedTypeModalOpen && <NeedTypeManagementModal />}
            {isImportModalOpen && <ImportModal />}
            {isSummaryModalOpen && <AISummaryModal />}
            {isSuccessStoryModalOpen && <SuccessStoryModal />}
            {isDeletionGuardModalOpen && <DeletionGuardModal />}
            {isOrgDeletionGuardModalOpen && <OrganizationDeletionGuardModal />}
            {isIndustryInsightsModalOpen && <IndustryInsightsModal />}
            {isConfirmationModalOpen && <ConfirmationModal />}
            {isErrorModalOpen && <ErrorModal />}
        </>
    )
}


const AppContent: React.FC = () => {
    const { totalCountForView, selectedIds, displayedData, mainContainerRef } = useAppContext();
    
    return (
        <div className="h-screen w-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 grid grid-cols-[auto_1fr] overflow-hidden">
            <Sidebar />
            <div className="grid grid-rows-[auto_auto_1fr_auto] h-full overflow-hidden">
                <TopBar onLogout={signOutUser} />
                <MasterToolbar />
                <main ref={mainContainerRef} className="flex-1 p-3 overflow-hidden min-h-0 flex flex-col">
                    <PageRenderer />
                </main>
                <StatusBar 
                    selectedCount={selectedIds.size} 
                    displayedCount={displayedData.length} 
                    totalCount={totalCountForView} 
                />
            </div>
            <AppModals />
            <MobileBlocker />
        </div>
    );
};

const AuthenticatedApp: React.FC = () => {
    const { isLoading } = useAppContext();

    if (isLoading) {
        return <LoadingPage />;
    }

    return <AppContent />;
};


// --- Main App Component ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMockMode = new URLSearchParams(window.location.search).get('mock') === 'true';
    if (isMockMode) {
      const mockUser: User = {
        uid: 'mock_user_123',
        displayName: 'Dev User',
        email: 'dev@orggrid.com',
        photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=Dev+User`,
      } as User;
      setUser(mockUser);
      setAuthLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
      return <LoadingPage />;
  }

  if (!user) {
      return <LoginPage />;
  }

  return (
    <AppContextProvider user={user} mainContainerRef={mainContainerRef}>
      <AuthenticatedApp />
    </AppContextProvider>
  );
};

export default App;