import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Subject } from '../types';
import { 
  BookOpen, 
  Plus, 
  Clock, 
  Trash2, 
  Edit2, 
  Layers, 
  PieChart, 
  CheckCircle2, 
  Scale, 
  AlertCircle 
} from 'lucide-react';

export const DisciplinesView: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, addTopic, deleteTopic, examSettings } = useStudy();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [weeklyTargetHours, setWeeklyTargetHours] = useState<number>(4);
  const [weight, setWeight] = useState<number>(2);
  const [color, setColor] = useState<string>('#b38e44');

  // Topic add state
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');

  const totalWeeklyHours = subjects.reduce((acc, s) => acc + s.weeklyTargetHours, 0);

  const colors = [
    '#b38e44', '#0f766e', '#15803d', '#2563eb', '#7c3aed', 
    '#ea580c', '#e11d48', '#4f46e5', '#0891b2', '#059669'
  ];

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setWeeklyTargetHours(4);
    setWeight(2);
    setColor('#b38e44');
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingSubject(s);
    setName(s.name);
    setCode(s.code);
    setWeeklyTargetHours(s.weeklyTargetHours);
    setWeight(s.weight);
    setColor(s.color);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name,
        code,
        weeklyTargetHours: Number(weeklyTargetHours),
        weight: Number(weight),
        color,
      });
    } else {
      addSubject({
        name,
        code,
        weeklyTargetHours: Number(weeklyTargetHours),
        weight: Number(weight),
        color,
        topics: [
          { id: `top-${Date.now()}-1`, title: 'Conceitos Iniciais e Teoria Geral', completed: false }
        ],
      });
    }

    setShowAddModal(false);
  };

  const handleAddTopicToSubject = (subjectId: string) => {
    if (!newTopicTitle.trim()) return;
    addTopic(subjectId, newTopicTitle);
    setNewTopicTitle('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Disciplinas do Concurso & Carga Horária
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure as disciplinas cobradas no seu edital, seus respectivos pesos e as horas semanais de dedicação.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#b38e44] to-[#96742e] rounded-xl shadow-sm hover:shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Disciplina</span>
        </button>
      </div>

      {/* Carga Horária Semanal Distribution Summary */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#b38e44]" />
              Carga Horária Semanal Total Planejada
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900 font-mono">
                {totalWeeklyHours}h
              </span>
              <span className="text-xs text-gray-500">distribuídas em {subjects.length} disciplinas</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-xl">
              <span className="text-[10px] text-amber-800 font-bold uppercase block">Meta do Concurso</span>
              <span className="text-sm font-extrabold text-amber-900">
                {examSettings.weeklyTargetHours}h / semana
              </span>
            </div>
            <div className={`p-3 rounded-xl border ${
              totalWeeklyHours === examSettings.weeklyTargetHours
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <span className="text-[10px] font-bold uppercase block">Balanço</span>
              <span className="text-sm font-extrabold">
                {totalWeeklyHours >= examSettings.weeklyTargetHours ? '100% Coberto' : `${examSettings.weeklyTargetHours - totalWeeklyHours}h a planejar`}
              </span>
            </div>
          </div>
        </div>

        {/* Stacked bar visualization of workload */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Distribuição percentual do tempo de estudo por matéria:</span>
          </div>

          <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100 p-0.5">
            {subjects.map(s => {
              const pct = totalWeeklyHours > 0 ? (s.weeklyTargetHours / totalWeeklyHours) * 100 : 0;
              return (
                <div
                  key={s.id}
                  style={{ width: `${pct}%`, backgroundColor: s.color }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all group relative cursor-pointer"
                  title={`${s.code}: ${s.weeklyTargetHours}h (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            {subjects.map(s => {
              const pct = totalWeeklyHours > 0 ? Math.round((s.weeklyTargetHours / totalWeeklyHours) * 100) : 0;
              return (
                <div key={s.id} className="flex items-center gap-1.5 text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="font-semibold">{s.code}</span>
                  <span className="text-gray-400 font-mono">({s.weeklyTargetHours}h - {pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Disciplines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          const completedTopics = sub.topics.filter(t => t.completed).length;
          const totalTopics = sub.topics.length;
          const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
          const isExpanded = expandedSubjectId === sub.id;

          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0" 
                      style={{ backgroundColor: sub.color }} 
                    />
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                      {sub.code}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                      title="Editar disciplina"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {subjects.length > 1 && (
                      <button
                        onClick={() => deleteSubject(sub.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Excluir disciplina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm">{sub.name}</h3>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Carga Semanal</span>
                    <span className="text-base font-extrabold text-gray-900 font-mono">
                      {sub.weeklyTargetHours}h / sem
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Peso na Prova</span>
                    <span className="text-base font-extrabold text-gray-900">
                      Peso {sub.weight}
                    </span>
                  </div>
                </div>

                {/* Progress bar of syllabus */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Progresso do Edital</span>
                    <span className="font-bold text-gray-900 font-mono">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progressPct}%`, backgroundColor: sub.color }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block pt-0.5">
                    {completedTopics} de {totalTopics} tópicos concluídos
                  </span>
                </div>
              </div>

              {/* Topics section toggle */}
              <div className="border-t border-gray-100 bg-gray-50/70 p-3">
                <button
                  onClick={() => setExpandedSubjectId(isExpanded ? null : sub.id)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 hover:text-gray-900"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                    Gerenciar Tópicos do Edital ({totalTopics})
                  </span>
                  <span className="text-xs text-[#b38e44] font-bold">
                    {isExpanded ? 'Recolher' : 'Expandir'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200/80 space-y-2 text-xs">
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                      {sub.topics.map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between p-2 rounded bg-white border border-gray-200">
                          <span className={`text-[11px] truncate pr-2 ${topic.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {topic.title}
                          </span>
                          <button
                            onClick={() => deleteTopic(sub.id, topic.id)}
                            className="text-gray-400 hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Novo tópico do edital..."
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTopicToSubject(sub.id);
                          }
                        }}
                        className="flex-1 text-xs p-1.5 bg-white border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTopicToSubject(sub.id)}
                        className="px-2.5 py-1.5 bg-[#b38e44] text-white rounded text-xs font-bold hover:bg-[#96742e]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Adicionar / Editar Disciplina */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {editingSubject ? 'Editar Disciplina' : 'Nova Disciplina do Concurso'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Informe os dados da matéria para balancear sua carga horária semanal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome da Disciplina</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Direito Previdenciário"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b38e44]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sigla / Código Curto</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: CES.INSS.TS ou DPV"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b38e44]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Horas Semanais</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={weeklyTargetHours}
                    onChange={(e) => setWeeklyTargetHours(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b38e44]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Peso na Prova</label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b38e44]"
                  >
                    <option value={1}>Peso 1 (Básica)</option>
                    <option value={2}>Peso 2 (Intermediária)</option>
                    <option value={3}>Peso 3 (Alta relevância)</option>
                    <option value={4}>Peso 4 (Específica / Decisiva)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Cor de Identificação</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        color === c ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#b38e44] hover:bg-[#96742e] rounded-xl shadow-sm transition"
                >
                  {editingSubject ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
