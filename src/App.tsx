import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WeeklyGoalsView } from './components/WeeklyGoalsView';
import { ErrorNotebookView } from './components/ErrorNotebookView';
import { DisciplinesView } from './components/DisciplinesView';
import { TopicsManagerView } from './components/TopicsManagerView';
import { QuickRegisterView } from './components/QuickRegisterView';
import { RescheduleView } from './components/RescheduleView';
import { NotesView } from './components/NotesView';
import { SettingsView } from './components/SettingsView';
import { PrintScheduleView } from './components/PrintScheduleView';
import { GoalCompletionModal } from './components/GoalCompletionModal';

const AppContent: React.FC = () => {
  const { activeView } = useStudy();
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'painel':
        return <DashboardView />;
      case 'metas':
        return <WeeklyGoalsView />;
      case 'caderno-erros':
        return <ErrorNotebookView />;
      case 'disciplinas':
        return <DisciplinesView />;
      case 'assuntos':
        return <TopicsManagerView />;
      case 'registrar':
        return <QuickRegisterView />;
      case 'reprogramar':
        return <RescheduleView />;
      case 'anotacoes':
        return <NotesView />;
      case 'config':
        return <SettingsView />;
      case 'print-view':
        return <PrintScheduleView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f5] flex text-gray-900 font-sans antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header onOpenMobileSidebar={() => setIsOpenMobile(true)} />

        <main className="flex-1 pb-16">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Goal Completion Modal */}
      <GoalCompletionModal />

      {/* Invisible on screen, but formatted for printer / PDF export */}
      <div className="print-only">
        <PrintScheduleView />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}
