import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  LayoutDashboard, 
  Target, 
  BookX, 
  PlusCircle, 
  BookOpen, 
  Layers, 
  RotateCcw, 
  FolderArchive, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  GraduationCap,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { activeView, setActiveView, examSettings, exportToPdf, errors } = useStudy();

  const [openSections, setOpenSections] = useState({
    estudos: true,
    plano: true,
    escaninho: false,
    suporte: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const pendingErrorsCount = errors.filter(e => e.status === 'pendente').length;

  const handleNavClick = (view: string) => {
    setActiveView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden modal-backdrop"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-slate-600 flex flex-col border-r border-slate-200/80 shadow-xs
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static no-print
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1">
                Concurso<span className="text-indigo-600">Pro</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Plano Estratégico</p>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs font-medium">
          {/* Menu principal */}
          <div>
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Menu
            </div>
            <button
              onClick={() => handleNavClick('painel')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                activeView === 'painel'
                  ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeView === 'painel' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Painel</span>
            </button>
          </div>

          {/* Seção Estudos */}
          <div>
            <button
              onClick={() => toggleSection('estudos')}
              className="w-full flex items-center justify-between px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold hover:text-slate-600"
            >
              <span>Estudos</span>
              {openSections.estudos ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {openSections.estudos && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => handleNavClick('metas')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'metas'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Target className={`w-4 h-4 ${activeView === 'metas' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Metas</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Diárias / Semanal</span>
                </button>

                <button
                  onClick={() => handleNavClick('caderno-erros')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'caderno-erros'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookX className={`w-4 h-4 ${activeView === 'caderno-erros' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>Caderno de Erros</span>
                  </div>
                  {pendingErrorsCount > 0 && (
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200/80 px-1.5 py-0.5 rounded-full font-bold">
                      {pendingErrorsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('registrar')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'registrar'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className={`w-4 h-4 ${activeView === 'registrar' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Registrar</span>
                </button>
              </div>
            )}
          </div>

          {/* Seção Plano de Estudo */}
          <div>
            <button
              onClick={() => toggleSection('plano')}
              className="w-full flex items-center justify-between px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold hover:text-slate-600"
            >
              <span>Plano de Estudo</span>
              {openSections.plano ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {openSections.plano && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => handleNavClick('disciplinas')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'disciplinas'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${activeView === 'disciplinas' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Disciplinas & Cargas</span>
                </button>

                <button
                  onClick={() => handleNavClick('assuntos')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'assuntos'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Layers className={`w-4 h-4 ${activeView === 'assuntos' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Gerenciar Assuntos</span>
                </button>

                <button
                  onClick={() => handleNavClick('reprogramar')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'reprogramar'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <RotateCcw className={`w-4 h-4 ${activeView === 'reprogramar' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>Reprogramar Metas</span>
                </button>
              </div>
            )}
          </div>

          {/* Seção Escaninho */}
          <div>
            <button
              onClick={() => toggleSection('escaninho')}
              className="w-full flex items-center justify-between px-3 mb-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold hover:text-slate-600"
            >
              <span>Escaninho</span>
              {openSections.escaninho ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {openSections.escaninho && (
              <div className="space-y-1 pl-1">
                <button
                  onClick={() => handleNavClick('anotacoes')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                    activeView === 'anotacoes'
                      ? 'bg-indigo-50/90 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FolderArchive className="w-4 h-4 text-slate-400" />
                  <span>Material & Anotações</span>
                </button>
              </div>
            )}
          </div>

          {/* Ações rápidas: Exportar PDF */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={exportToPdf}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 text-slate-700 hover:text-indigo-700 transition text-left group"
              title="Exportar cronograma para PDF ou imprimir offline"
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-xs">Exportar PDF</span>
              </div>
              <span className="text-[10px] bg-indigo-100/70 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-medium">A4</span>
            </button>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200/80 transition cursor-pointer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-indigo-100 shadow-xs">
                {examSettings.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'RF'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{examSettings.studentName}</p>
                <p className="text-[10px] text-slate-500 truncate">{examSettings.examName}</p>
              </div>
            </div>
            <button
              onClick={() => handleNavClick('config')}
              title="Configurações do concurso"
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
