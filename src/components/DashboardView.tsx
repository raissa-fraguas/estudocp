import React from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  Gauge, 
  BookOpen, 
  TrendingUp, 
  HelpCircle, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Info, 
  CheckCircle,
  Plus,
  ChevronRight,
  Filter,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { StudyGoal } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    examSettings, 
    stats, 
    goals, 
    subjects, 
    activeTab, 
    setActiveTab, 
    setActiveView,
    setSelectedGoalForModal 
  } = useStudy();

  // Filter daily goals (today)
  const todayGoals = goals.filter(g => g.date === '2026-11-11' || g.dayOfWeek === 'qua');

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const getSubjectById = (id: string) => {
    return subjects.find(s => s.id === id);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome + Tab selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Olá, <span className="text-gray-900">{examSettings.studentName}</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Você atingiu <strong className="text-gray-900 font-semibold">{stats.generalProgressPercent}%</strong> da sua meta geral.
          </p>
        </div>

        {/* Tab switcher matching screenshot: Geral, Conteúdo, Desempenho, Questões */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-200/70 rounded-full text-xs font-semibold self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('geral')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
              activeTab === 'geral'
                ? 'bg-[#b38e44] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('conteudo')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
              activeTab === 'conteudo'
                ? 'bg-[#b38e44] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Conteúdo</span>
          </button>

          <button
            onClick={() => setActiveTab('desempenho')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
              activeTab === 'desempenho'
                ? 'bg-[#b38e44] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Desempenho</span>
          </button>

          <button
            onClick={() => setActiveTab('questoes')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
              activeTab === 'questoes'
                ? 'bg-[#b38e44] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questões</span>
          </button>
        </div>
      </div>

      {/* VIEW CONDITIONAL ON ACTIVE TAB */}
      {activeTab === 'geral' && (
        <>
          {/* Main Grid: Metas Diárias + Bronze cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Metas diárias card (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Metas diárias</h2>
                  <span className="text-xs font-medium text-gray-400">Clique para registrar</span>
                </div>

                {/* List of goals in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todayGoals.map((goal) => {
                    const sub = getSubjectById(goal.subjectId);
                    const isCompleted = goal.status === 'concluida';

                    return (
                      <div
                        key={goal.id}
                        onClick={() => setSelectedGoalForModal(goal)}
                        className={`p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between text-xs font-medium group hover:scale-[1.01] ${
                          isCompleted
                            ? 'bg-[#0f462c] text-white shadow-sm hover:bg-[#0c3c25]'
                            : 'bg-[#f3f4f6] text-gray-800 hover:bg-gray-200/90'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold truncate">
                              {sub?.code || 'DISC'} - {sub?.name || 'Disciplina'}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate mt-0.5 ${isCompleted ? 'text-emerald-200' : 'text-gray-500'}`}>
                            {goal.topicTitle}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono text-xs font-bold ${isCompleted ? 'text-emerald-100' : 'text-gray-700'}`}>
                            {formatDuration(goal.targetDurationMinutes)}
                          </span>
                          {isCompleted && (
                            <div className="flex items-center justify-end gap-1 mt-0.5">
                              <CheckCircle className="w-3 h-3 text-emerald-300" />
                              <span className="text-[9px] text-emerald-200">Feito</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer of Metas diárias */}
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#b38e44] text-white font-bold text-xs flex items-center justify-center">
                    {todayGoals.length}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    – total de metas diária
                  </span>
                </div>

                <button
                  onClick={() => setActiveView('metas')}
                  className="text-xs font-bold text-gray-800 hover:text-[#b38e44] flex items-center gap-1 transition"
                >
                  <span>Todas as Metas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bronze/Gold Gradient Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Progresso Semanal */}
              <div className="bg-gradient-to-r from-[#b38e44] to-[#99742e] text-white rounded-2xl p-6 shadow-md shadow-[#b38e44]/15 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Progresso Semanal</h3>
                    <p className="text-xs text-amber-100/80 mt-0.5">Percentual de metas concluídas</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-6">
                  {/* Progress track */}
                  <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5 backdrop-blur-sm">
                    <div 
                      className="bg-white rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${Math.min(100, stats.weeklyProgressPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      {stats.weeklyProgressPercent}% das metas concluídas ↗
                    </span>
                    <span className="text-amber-100 text-[11px]">
                      {stats.dailyCompletedGoalsCount} de {todayGoals.length} hoje
                    </span>
                  </div>
                </div>
              </div>

              {/* Progresso Geral */}
              <div className="bg-gradient-to-r from-[#b38e44] to-[#99742e] text-white rounded-2xl p-6 shadow-md shadow-[#b38e44]/15 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Progresso Geral</h3>
                    <p className="text-xs text-amber-100/80 mt-0.5">Percentual de metas concluídas</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-6">
                  {/* Progress track */}
                  <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5 backdrop-blur-sm">
                    <div 
                      className="bg-white rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${Math.min(100, stats.generalProgressPercent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      {stats.generalProgressPercent}% das metas concluídas ↗
                    </span>
                    <span className="text-amber-100 text-[11px]">
                      Edital Verticalizado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 White KPI Stat Cards matching screenshot: Dias para prova, Horas, Questões */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dias para prova */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Dias para prova</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {stats.daysToExam > 0 ? stats.daysToExam : '0'}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Data alvo: {examSettings.examDate ? new Date(examSettings.examDate).toLocaleDateString('pt-BR') : 'Não definida'}
                </p>
              </div>
            </div>

            {/* Horas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Horas</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
                  {stats.totalHoursFormatted}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Tempo total líquido acumulado
                </p>
              </div>
            </div>

            {/* Questões */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Questões</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {stats.totalQuestions.toLocaleString('pt-BR')}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {stats.overallAccuracyRate}% de taxa média de acertos
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Charts matching screenshot: Progresso por Conteúdo & Desempenho por Questões */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progresso por Conteúdo */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 text-sm">Progresso por Conteúdo</h3>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">Assuntos finalizados</span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-[11px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b38e44]"></span>
                <span>Conteúdo</span>
              </div>

              {/* Horizontal progress bars with gold gradients */}
              <div className="space-y-4">
                {stats.subjectProgressList.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 truncate max-w-[240px]">
                        {item.code} - {item.name}
                      </span>
                      <span className="font-bold text-gray-900 font-mono">{item.percentCompleted}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#caa658] to-[#b38e44] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(4, item.percentCompleted)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desempenho por Questões */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 text-sm">Desempenho por Questões</h3>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <span className="text-[11px] text-gray-400 font-medium">% Acertos em simulados</span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-[11px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b38e44]"></span>
                <span>Questão</span>
              </div>

              {/* Horizontal accuracy bars */}
              <div className="space-y-4">
                {stats.subjectQuestionsPerformanceList.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 truncate max-w-[240px]">
                        {item.code} - {item.name}
                      </span>
                      <span className="font-bold text-gray-900 font-mono">{item.accuracyPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#caa658] to-[#b38e44] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, item.accuracyPercent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB: CONTEÚDO */}
      {activeTab === 'conteudo' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Detalhamento de Conteúdo e Edital</h2>
              <p className="text-xs text-gray-500">Avanço teórico em cada disciplina do concurso</p>
            </div>
            <button
              onClick={() => setActiveView('assuntos')}
              className="text-xs font-bold text-[#b38e44] hover:underline"
            >
              Abrir Edital Verticalizado Completo →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(s => {
              const comp = s.topics.filter(t => t.completed).length;
              const tot = s.topics.length;
              const p = tot > 0 ? Math.round((comp / tot) * 100) : 0;
              return (
                <div key={s.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-gray-800 border">
                      {s.code}
                    </span>
                    <span className="text-xs font-extrabold text-[#b38e44]">{p}%</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{s.name}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#b38e44] h-full rounded-full" style={{ width: `${p}%` }} />
                  </div>
                  <div className="text-[11px] text-gray-500 flex justify-between">
                    <span>{comp} de {tot} tópicos concluídos</span>
                    <span>Carga: {s.weeklyTargetHours}h/sem</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: DESEMPENHO */}
      {activeTab === 'desempenho' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Evolução do Rendimento por Matéria</h2>
              <p className="text-xs text-gray-500">Taxa de assertividade em questões e horas de dedicação</p>
            </div>
            <button
              onClick={() => setActiveView('caderno-erros')}
              className="text-xs font-bold text-[#b38e44] hover:underline"
            >
              Ver Caderno de Erros →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-600">Taxa de Acerto por Disciplina</h3>
              {stats.subjectQuestionsPerformanceList.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">{item.code} - {item.name}</span>
                    <span className="font-mono font-extrabold text-[#b38e44]">{item.accuracyPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${item.accuracyPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{item.totalAnswered} questões resolvidas</span>
                    <span>{item.accuracyPercent >= 80 ? 'Excelente' : 'Zona de atenção'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-600">Horas Líquidas Estudadas</h3>
              {stats.subjectProgressList.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">{item.code} - {item.name}</span>
                    <span className="font-mono font-extrabold text-gray-900">{item.studiedHours}h estudadas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#b38e44] h-full rounded-full" style={{ width: `${Math.min(100, (item.studiedHours / item.targetHours) * 100)}%` }} />
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Meta semanal: {item.targetHours}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUESTÕES */}
      {activeTab === 'questoes' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Histórico de Questões Resolvidas</h2>
              <p className="text-xs text-gray-500">Acompanhamento de simulados e listas de exercícios</p>
            </div>
            <button
              onClick={() => setActiveView('registrar')}
              className="text-xs font-bold px-3 py-1.5 bg-[#b38e44] text-white rounded-lg hover:bg-[#96742e]"
            >
              + Registrar Nova Lista
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border">
              <span className="text-xs text-gray-500">Total de Questões</span>
              <div className="text-2xl font-extrabold text-gray-900 mt-1">{stats.totalQuestions}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs text-emerald-800 font-semibold">Total de Acertos</span>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{stats.totalQuestionsCorrect}</div>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <span className="text-xs text-red-800 font-semibold">Total de Erros</span>
              <div className="text-2xl font-extrabold text-red-900 mt-1">{stats.totalQuestionsWrong}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3 White KPI Stat Cards matching screenshot: Dias para prova, Horas, Questões */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dias para prova */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Dias para prova</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {stats.daysToExam > 0 ? stats.daysToExam : '0'}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Data alvo: {examSettings.examDate ? new Date(examSettings.examDate).toLocaleDateString('pt-BR') : 'Não definida'}
            </p>
          </div>
        </div>

        {/* Horas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Horas</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
              {stats.totalHoursFormatted}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Tempo total líquido acumulado
            </p>
          </div>
        </div>

        {/* Questões */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Questões</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {stats.totalQuestions.toLocaleString('pt-BR')}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {stats.overallAccuracyRate}% de taxa média de acertos
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Charts matching screenshot: Progresso por Conteúdo & Desempenho por Questões */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progresso por Conteúdo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 text-sm">Progresso por Conteúdo</h3>
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium">Assuntos finalizados</span>
          </div>

          <div className="flex items-center gap-2 mb-4 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b38e44]"></span>
            <span>Conteúdo</span>
          </div>

          {/* Horizontal progress bars with gold gradients */}
          <div className="space-y-4">
            {stats.subjectProgressList.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 truncate max-w-[240px]">
                    {item.code} - {item.name}
                  </span>
                  <span className="font-bold text-gray-900 font-mono">{item.percentCompleted}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#caa658] to-[#b38e44] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, item.percentCompleted)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desempenho por Questões */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 text-sm">Desempenho por Questões</h3>
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium">% Acertos em simulados</span>
          </div>

          <div className="flex items-center gap-2 mb-4 text-[11px] text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b38e44]"></span>
            <span>Questão</span>
          </div>

          {/* Horizontal accuracy bars */}
          <div className="space-y-4">
            {stats.subjectQuestionsPerformanceList.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 truncate max-w-[240px]">
                    {item.code} - {item.name}
                  </span>
                  <span className="font-bold text-gray-900 font-mono">{item.accuracyPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#caa658] to-[#b38e44] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, item.accuracyPercent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
