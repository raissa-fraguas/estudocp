import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { ErrorQuestion, MistakeReason, DifficultyLevel } from '../types';
import { 
  BookX, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Eye, 
  EyeOff, 
  RotateCw, 
  HelpCircle,
  TrendingDown,
  BarChart3,
  Bookmark
} from 'lucide-react';

export const ErrorNotebookView: React.FC = () => {
  const { errors, subjects, addErrorQuestion, updateErrorQuestion, deleteErrorQuestion, markErrorReviewed } = useStudy();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [revealFlashcard, setRevealFlashcard] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New error question form
  const [newSubjectId, setNewSubjectId] = useState<string>(subjects[0]?.id || '');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newInstitution, setNewInstitution] = useState<string>('Cebraspe');
  const [newYear, setNewYear] = useState<number>(2023);
  const [newStatement, setNewStatement] = useState<string>('');
  const [markedOption, setMarkedOption] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<string>('');
  const [mistakeReason, setMistakeReason] = useState<MistakeReason>('Falta de atenção / Pegadinha');
  const [explanation, setExplanation] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Médio');

  const mistakeReasonsList: MistakeReason[] = [
    'Falta de atenção / Pegadinha',
    'Lacuna teórica / Conteúdo não visto',
    'Esquecimento de regra / Prazo',
    'Dúvida entre duas alternativas',
    'Interpretação do enunciado',
    'Jurisprudência / Lei Seca recente',
  ];

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  // Filtering
  const filteredErrors = errors.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterSubject !== 'all' && item.subjectId !== filterSubject) return false;
    if (filterReason !== 'all' && item.mistakeReason !== filterReason) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchText = (item.statement + ' ' + item.explanation + ' ' + item.topicTitle).toLowerCase();
      if (!matchText.includes(term)) return false;
    }
    return true;
  });

  // Calculate mistake reasons distribution
  const reasonCounts: Record<string, number> = {};
  errors.forEach(err => {
    reasonCounts[err.mistakeReason] = (reasonCounts[err.mistakeReason] || 0) + 1;
  });

  const handleCreateError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim() || !correctOption.trim()) return;

    addErrorQuestion({
      subjectId: newSubjectId || subjects[0]?.id,
      topicTitle: newTopic || 'Assunto Geral',
      institution: newInstitution,
      year: newYear,
      statement: newStatement,
      markedOption,
      correctOption,
      mistakeReason,
      explanation,
      difficulty,
      status: 'pendente',
    });

    setNewStatement('');
    setMarkedOption('');
    setCorrectOption('');
    setExplanation('');
    setShowAddModal(false);
  };

  const currentFlashcard = filteredErrors[flashcardIndex];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <BookX className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Caderno de Erros Inteligente
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Revise suas falhas recorrentes, aprenda com as pegadinhas e blinde seus pontos fracos para a prova.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setIsFlashcardMode(!isFlashcardMode);
              setRevealFlashcard(false);
              setFlashcardIndex(0);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition ${
              isFlashcardMode
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFlashcardMode ? 'Sair do Modo Revisão' : 'Modo Revisão (Cards)'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#b38e44] to-[#96742e] rounded-xl shadow-sm hover:shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Erro</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Total, Pendentes, Revisados, Dominados */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Cadastrado</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{errors.length}</div>
          <span className="text-[10px] text-gray-400">questões mapeadas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-xs bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Pendentes de Revisão</span>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            {errors.filter(e => e.status === 'pendente').length}
          </div>
          <span className="text-[10px] text-amber-600">precisam de atenção</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200/60 shadow-xs bg-blue-50/20">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Em Revisão</span>
          <div className="text-2xl font-extrabold text-blue-900 mt-1">
            {errors.filter(e => e.status === 'revisado').length}
          </div>
          <span className="text-[10px] text-blue-600">revisados 1+ vezes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/60 shadow-xs bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Dominados / Fixados</span>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">
            {errors.filter(e => e.status === 'dominado').length}
          </div>
          <span className="text-[10px] text-emerald-600">100% compreendidos</span>
        </div>
      </div>

      {/* Diagnóstico Pedagógico: Motivos mais frequentes de erro */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#b38e44]" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Diagnóstico: Por que você erra questões?
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">Identificação de gargalos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mistakeReasonsList.map(reason => {
            const count = reasonCounts[reason] || 0;
            const pct = errors.length > 0 ? Math.round((count / errors.length) * 100) : 0;
            return (
              <div key={reason} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                <div className="flex items-center justify-between font-semibold text-gray-700 mb-1">
                  <span className="truncate pr-1 text-[11px]">{reason}</span>
                  <span className="font-mono font-bold text-[#b38e44]">{count} ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#b38e44] h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {isFlashcardMode && (
        <div className="bg-gradient-to-br from-gray-900 to-[#1e2329] rounded-2xl p-6 text-white shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-gray-700/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#b38e44] font-bold">
                Card {filteredErrors.length > 0 ? flashcardIndex + 1 : 0} de {filteredErrors.length}
              </span>
              {currentFlashcard && (
                <span className="text-xs text-gray-300">
                  {getSubject(currentFlashcard.subjectId)?.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFlashcardIndex(prev => (prev > 0 ? prev - 1 : filteredErrors.length - 1));
                  setRevealFlashcard(false);
                }}
                disabled={filteredErrors.length <= 1}
                className="px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 rounded disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  setFlashcardIndex(prev => (prev < filteredErrors.length - 1 ? prev + 1 : 0));
                  setRevealFlashcard(false);
                }}
                disabled={filteredErrors.length <= 1}
                className="px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 rounded disabled:opacity-40"
              >
                Próximo
              </button>
            </div>
          </div>

          {!currentFlashcard ? (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhuma questão encontrada com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Assunto: {currentFlashcard.topicTitle} ({currentFlashcard.institution || 'Banca'} {currentFlashcard.year || ''})
                </span>
                <p className="text-sm font-medium text-gray-100 mt-2 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                  {currentFlashcard.statement}
                </p>
              </div>

              {currentFlashcard.markedOption && (
                <div className="text-xs bg-red-950/40 border border-red-800/50 p-3 rounded-lg text-red-200">
                  <strong>O que você marcou:</strong> {currentFlashcard.markedOption}
                  <span className="block text-[10px] text-red-300/80 mt-0.5">
                    Motivo do erro: {currentFlashcard.mistakeReason}
                  </span>
                </div>
              )}

              {/* Reveal toggle */}
              {!revealFlashcard ? (
                <button
                  onClick={() => setRevealFlashcard(true)}
                  className="w-full py-3 bg-[#b38e44] hover:bg-[#a07c34] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Revelar Gabarito Oficial & Anotação de Revisão</span>
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-emerald-950/50 border border-emerald-700/60 p-4 rounded-xl text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gabarito Oficial:</span>
                    </div>
                    <p className="text-emerald-100 font-medium text-sm">
                      {currentFlashcard.correctOption}
                    </p>

                    <div className="pt-2 border-t border-emerald-800/40 mt-2 text-gray-200">
                      <strong className="text-amber-300">Explicação / Conceito que você precisa lembrar:</strong>
                      <p className="mt-1 leading-relaxed text-gray-300">
                        {currentFlashcard.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        markErrorReviewed(currentFlashcard.id, false);
                        setRevealFlashcard(false);
                        setFlashcardIndex(prev => (prev < filteredErrors.length - 1 ? prev + 1 : 0));
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                    >
                      Revisar Mais Tarde (Pendente)
                    </button>

                    <button
                      onClick={() => {
                        markErrorReviewed(currentFlashcard.id, true);
                        setRevealFlashcard(false);
                        setFlashcardIndex(prev => (prev < filteredErrors.length - 1 ? prev + 1 : 0));
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Já Dominei Este Ponto!</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW (Detailed questions) */}
      {!isFlashcardMode && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Pesquisar por palavra-chave, tema ou comentário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b38e44]"
              />
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs">
              {/* Filter by status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700"
              >
                <option value="all">Todos os Status</option>
                <option value="pendente">Pendentes</option>
                <option value="revisado">Revisados</option>
                <option value="dominado">Dominados</option>
              </select>

              {/* Filter by subject */}
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700"
              >
                <option value="all">Todas as Matérias</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>

              {/* Filter by mistake reason */}
              <select
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 max-w-[180px] truncate"
              >
                <option value="all">Todos os Motivos</option>
                {mistakeReasonsList.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-4">
            {filteredErrors.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BookX className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="font-semibold text-gray-700 text-sm">Nenhuma questão encontrada</p>
                <p className="text-xs text-gray-400 mt-1">
                  Cadastre questões ao concluir suas metas diárias ou pelo botão "Adicionar Erro".
                </p>
              </div>
            ) : (
              filteredErrors.map((item) => {
                const sub = getSubject(item.subjectId);
                const isDominated = item.status === 'dominado';
                const isRevised = item.status === 'revisado';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isDominated
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isRevised
                        ? 'bg-blue-50/30 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                          {sub?.code || 'DISC'}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {item.topicTitle}
                        </span>
                        {item.institution && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                            {item.institution} {item.year ? `(${item.year})` : ''}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDominated
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRevised
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isDominated ? '✓ Dominado' : isRevised ? 'Revisado' : 'Pendente'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => markErrorReviewed(item.id, !isDominated)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                            isDominated
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {isDominated ? 'Desmarcar Dominado' : 'Marcar Dominado'}
                        </button>

                        <button
                          onClick={() => deleteErrorQuestion(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Excluir questão"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Statement */}
                    <div className="text-xs text-gray-800 font-medium bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 mb-3 leading-relaxed">
                      {item.statement}
                    </div>

                    {/* Marked vs Correct */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      {item.markedOption && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-900">
                          <span className="font-bold text-[10px] uppercase text-red-600 block">Sua resposta incorreta</span>
                          {item.markedOption}
                        </div>
                      )}

                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                        <span className="font-bold text-[10px] uppercase text-emerald-600 block">Gabarito Oficial</span>
                        {item.correctOption}
                      </div>
                    </div>

                    {/* Explanation & Reason */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs pt-2 border-t border-gray-100">
                      <div className="flex-1">
                        <strong className="text-gray-900">Por que errou / Anotação da regra: </strong>
                        <span className="text-gray-600">{item.explanation}</span>
                      </div>

                      <div className="shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                          {item.mistakeReason}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Adicionar Erro */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl p-6 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Cadastrar Questão no Caderno de Erros</h3>
            <p className="text-xs text-gray-500 mb-4">
              Registre a pegadinha ou conceito que você errou para revisar depois.
            </p>

            <form onSubmit={handleCreateError} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Disciplina</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tópico / Assunto</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Ex: Segurados do RGPS"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Banca Examinadora</label>
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="Ex: Cebraspe, FGV, FCC"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ano</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(parseInt(e.target.value) || 2024)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Enunciado da Questão</label>
                <textarea
                  required
                  rows={3}
                  value={newStatement}
                  onChange={(e) => setNewStatement(e.target.value)}
                  placeholder="Copie ou resuma o enunciado da questão..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sua Resposta Incorreta</label>
                  <input
                    type="text"
                    value={markedOption}
                    onChange={(e) => setMarkedOption(e.target.value)}
                    placeholder="Ex: Marquei Certo"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gabarito Correto</label>
                  <input
                    type="text"
                    required
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    placeholder="Ex: Errado"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Motivo Principal do Erro</label>
                <select
                  value={mistakeReason}
                  onChange={(e) => setMistakeReason(e.target.value as MistakeReason)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                >
                  {mistakeReasonsList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Comentário / O que memorizar</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explique com suas palavras a regra correta..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
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
                  Salvar no Caderno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
