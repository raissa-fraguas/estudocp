import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  Menu as MenuIcon, 
  Bell, 
  Printer, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles,
  ChevronRight,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { activeView, exportToPdf, stats, goals } = useStudy();
  const [showNotifications, setShowNotifications] = useState(false);

  // Today formatted in Brazilian Portuguese matching the screenshot
  // "Hoje, quarta-feira dia 11 de novembro de 2026"
  const formattedDate = "Hoje, quarta-feira dia 11 de novembro de 2026";

  const viewTitles: Record<string, string> = {
    'painel': 'Painel',
    'metas': 'Metas de Estudo',
    'caderno-erros': 'Caderno de Erros',
    'registrar': 'Registrar Sessão',
    'disciplinas': 'Disciplinas & Cargas',
    'assuntos': 'Gerenciador de Assuntos',
    'reprogramar': 'Reprogramação de Metas',
    'anotacoes': 'Material & Anotações',
    'config': 'Configurações do Concurso',
  };

  const currentTitle = viewTitles[activeView] || 'Painel';

  const pendingGoalsCount = goals.filter(g => g.status === 'pendente').length;

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 no-print">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          aria-label="Abrir menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center text-gray-500">
            <div className="w-2.5 h-2.5 border-l-2 border-t-2 border-gray-500"></div>
          </div>
          <span className="font-semibold text-gray-800 text-sm">{currentTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date string matching screenshot */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span>{formattedDate}</span>
        </div>

        {/* Quick PDF export button */}
        <button
          onClick={exportToPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-200"
          title="Exportar metas e cronograma para PDF"
        >
          <Printer className="w-3.5 h-3.5 text-gray-600" />
          <span className="hidden sm:inline">Exportar PDF</span>
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-full transition relative"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {pendingGoalsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="font-bold text-gray-800">Lembretes & Avisos</span>
                <span className="text-[10px] text-gray-500">{stats.dailyGoalsCount} metas hoje</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2.5 bg-amber-50 border border-amber-200/60 rounded-lg flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">Metas de hoje pendentes</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Você ainda tem {stats.dailyGoalsCount - stats.dailyCompletedGoalsCount} metas programadas para hoje.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-green-50 border border-green-200/60 rounded-lg flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Desempenho semanal</p>
                    <p className="text-[11px] text-green-700 mt-0.5">
                      Você atingiu {stats.weeklyProgressPercent}% das metas semanais estipuladas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
