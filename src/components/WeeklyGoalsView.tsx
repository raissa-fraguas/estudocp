import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { DayOfWeek, DifficultyLevel, StudyGoal } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Printer, 
  Trash2, 
  RotateCcw, 
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const WeeklyGoalsView: React.FC = () => {
  const { 
    goals, 
    subjects, 
    addGoal, 
    deleteGoal, 
    resetGoal, 
    setSelectedGoalForModal, 
    exportToPdf 
  } = useStudy();

  const [viewMode, setViewMode] = useState<'diario' | 'semanal'>('semanal');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('qua');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New goal form state
  const [newSubjectId, setNewSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newDay, setNewDay] = useState<DayOfWeek>('qua');

  const daysConfig: Array<{ key: DayOfWeek; label: string; fullLabel: string }> = [
    { key: 'seg', label: 'Seg', fullLabel: 'Segunda-feira' },
    { key: 'ter', label: 'Ter', fullLabel: 'Terça-feira' },
    { key: 'qua', label: 'Qua', fullLabel: 'Quarta-feira (Hoje)' },
    { key: 'qui', label: 'Qui', fullLabel: 'Quinta-feira' },
    { key: 'sex', label: 'Sex', fullLabel: 'Sexta-feira' },
    { key: 'sab', label: 'Sáb', fullLabel: 'Sábado' },
    { key: 'dom', label: 'Dom', fullLabel: 'Domingo' },
  ];

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    addGoal({
      subjectId: newSubjectId || subjects[0]?.id,
      topicTitle: newTopic,
      targetDurationMinutes: Number(newDuration),
      dayOfWeek: newDay,
      date: '2026-11-11',
      status: 'pendente',
    });

    setNewTopic('');
    setShowAddModal(false);
  };

  const filteredGoals = goals.filter(g => {
    if (filterSubject !== 'all' && g.subjectId !== filterSubject) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Cronograma & Metas de Estudo
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize suas metas diárias e semanais com acompanhamento detalhado e impressão offline.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Daily vs Weekly toggle */}
          <div className="bg-gray-200 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('diario')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'diario'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visualização Diária
            </button>
            <button
              onClick={() => setViewMode('semanal')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'semanal'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Visualização Semanal
            </button>
          </div>

          {/* Export to PDF button */}
          <button
            onClick={exportToPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition cursor-pointer"
            title="Exportar cronograma para PDF"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span>Exportar PDF</span>
          </button>

          {/* New Goal button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Meta</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-medium">
        <span className="text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filtrar:
        </span>
        <button
          onClick={() => setFilterSubject('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
            filterSubject === 'all'
              ? 'bg-slate-900 text-white font-bold'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Todas as Matérias
        </button>
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setFilterSubject(s.id)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition flex items-center gap-1.5 ${
              filterSubject === s.id
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span>{s.code}</span>
          </button>
        ))}
      </div>

      {/* VIEW MODE: SEMANAL (7 Columns) */}
      {viewMode === 'semanal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {daysConfig.map((day) => {
            const dayGoals = filteredGoals.filter(g => g.dayOfWeek === day.key);
            const totalMins = dayGoals.reduce((acc, g) => acc + g.targetDurationMinutes, 0);
            const completedCount = dayGoals.filter(g => g.status === 'concluida').length;
            const isToday = day.key === 'qua';

            return (
              <div
                key={day.key}
                className={`flex flex-col bg-white rounded-2xl border transition-all ${
                  isToday 
                    ? 'border-indigo-300 ring-2 ring-indigo-100 shadow-xs' 
                    : 'border-slate-200/80 shadow-2xs'
                }`}
              >
                {/* Column Day Header */}
                <div className={`p-3.5 border-b rounded-t-2xl ${
                  isToday ? 'bg-indigo-50/80 border-indigo-100' : 'bg-slate-50/80 border-slate-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {day.label}
                      {isToday && (
                        <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                          HOJE
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-slate-500">
                      {formatMinutes(totalMins)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                    <span>{dayGoals.length} meta(s)</span>
                    <span className="font-semibold text-slate-700">
                      {completedCount}/{dayGoals.length} concluídas
                    </span>
                  </div>
                </div>

                {/* Goals Cards List inside Day Column */}
                <div className="p-2.5 flex-1 space-y-2.5 min-h-[220px]">
                  {dayGoals.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                      <p className="text-[11px]">Nenhuma meta</p>
                      <button
                        onClick={() => {
                          setNewDay(day.key);
                          setShowAddModal(true);
                        }}
                        className="mt-2 text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        + Adicionar
                      </button>
                    </div>
                  ) : (
                    dayGoals.map((goal) => {
                      const sub = getSubject(goal.subjectId);
                      const isCompleted = goal.status === 'concluida';

                      return (
                        <div
                          key={goal.id}
                          onClick={() => setSelectedGoalForModal(goal)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs relative group ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-950 border-emerald-200/90 shadow-2xs hover:bg-emerald-100/80'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {sub?.code || 'DISC'}
                            </span>
                            <span className={`text-[10px] font-mono font-bold ${
                              isCompleted ? 'text-emerald-800' : 'text-slate-500'
                            }`}>
                              {formatMinutes(goal.targetDurationMinutes)}
                            </span>
                          </div>

                          <p className={`font-semibold mt-1.5 line-clamp-2 ${
                            isCompleted ? 'text-emerald-900 font-bold' : 'text-slate-900'
                          }`}>
                            {goal.topicTitle}
                          </p>

                          {/* Completed stats tag */}
                          {isCompleted ? (
                            <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-700">
                              <span className="flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {goal.questionsCorrect !== undefined && (
                                  <span>{goal.questionsCorrect}C / {goal.questionsWrong}E</span>
                                )}
                              </span>
                              <span>{goal.difficulty || 'Feito'}</span>
                            </div>
                          ) : (
                            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Circle className="w-2.5 h-2.5" />
                                Pendente
                              </span>
                              <span className="text-slate-400 font-semibold group-hover:text-indigo-600">
                                Preencher →
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Column quick add button */}
                <div className="p-2 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                  <button
                    onClick={() => {
                      setNewDay(day.key);
                      setShowAddModal(true);
                    }}
                    className="w-full py-1.5 text-center text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                  >
                    + Meta rápida
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: DIÁRIO */}
      {viewMode === 'diario' && (
        <div className="space-y-4">
          {/* Days bar selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {daysConfig.map((day) => (
              <button
                key={day.key}
                onClick={() => setSelectedDay(day.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  selectedDay === day.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{day.fullLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedDay === day.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {goals.filter(g => g.dayOfWeek === day.key).length}
                </span>
              </button>
            ))}
          </div>

          {/* Daily Goals detailed cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Metas para {daysConfig.find(d => d.key === selectedDay)?.fullLabel}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clique em qualquer meta para registrar o tempo estudado, questões certas/erradas e nível de dificuldade
                </p>
              </div>

              <button
                onClick={() => {
                  setNewDay(selectedDay);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Meta</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredGoals.filter(g => g.dayOfWeek === selectedDay).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700 text-sm">Nenhuma meta programada para este dia</p>
                  <p className="text-xs text-slate-400 mt-1">Clique no botão acima para adicionar sua primeira meta de estudo.</p>
                </div>
              ) : (
                filteredGoals.filter(g => g.dayOfWeek === selectedDay).map((goal) => {
                  const sub = getSubject(goal.subjectId);
                  const isCompleted = goal.status === 'concluida';

                  return (
                    <div
                      key={goal.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCompleted
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {sub?.code} - {sub?.name}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatMinutes(goal.targetDurationMinutes)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{goal.topicTitle}</h4>

                        {isCompleted && (
                          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                            <span className="text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ {goal.actualMinutes || goal.targetDurationMinutes} min estudados
                            </span>
                            {goal.questionsCorrect !== undefined && (
                              <span className="text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                                {goal.questionsCorrect} certas / {goal.questionsWrong} erradas
                              </span>
                            )}
                            {goal.difficulty && (
                              <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                                Dificuldade: {goal.difficulty}
                              </span>
                            )}
                          </div>
                        )}
                        {goal.notes && (
                          <p className="text-xs text-slate-500 italic mt-1">"{goal.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        {isCompleted ? (
                          <>
                            <button
                              onClick={() => setSelectedGoalForModal(goal)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            >
                              Editar Registro
                            </button>
                            <button
                              onClick={() => resetGoal(goal.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                              title="Marcar como pendente novamente"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedGoalForModal(goal)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition"
                          >
                            Registrar & Concluir
                          </button>
                        )}

                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Excluir meta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Meta de Estudo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Adicionar Nova Meta de Estudo</h3>
            <p className="text-xs text-slate-500 mb-4">
              Defina a matéria, o assunto específico e o tempo planejado.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Disciplina
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assunto / Tema da Meta
                </label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Ex: Teoria de Atos Administrativos e 20 questões"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Dia da Semana
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {daysConfig.map(d => (
                      <option key={d.key} value={d.key}>{d.fullLabel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Duração Planejada
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={30}>30 min (00:30:00)</option>
                    <option value={45}>45 min (00:45:00)</option>
                    <option value={60}>1h (01:00:00)</option>
                    <option value={90}>1h30 (01:30:00)</option>
                    <option value={120}>2h (02:00:00)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
