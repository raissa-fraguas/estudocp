import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { DifficultyLevel, MistakeReason } from '../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Check, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  BookX, 
  Plus, 
  Trash2,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const GoalCompletionModal: React.FC = () => {
  const { selectedGoalForModal, setSelectedGoalForModal, completeGoal, subjects } = useStudy();

  const [actualMinutes, setActualMinutes] = useState<number>(60);
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(10);
  const [questionsWrong, setQuestionsWrong] = useState<number>(2);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Médio');
  const [notes, setNotes] = useState<string>('');

  // Built-in stopwatch / timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Errors quick entry
  const [showErrorEntry, setShowErrorEntry] = useState<boolean>(false);
  const [pendingErrorQuestions, setPendingErrorQuestions] = useState<Array<{
    statement: string;
    markedOption: string;
    correctOption: string;
    mistakeReason: MistakeReason;
    explanation: string;
  }>>([]);

  const goal = selectedGoalForModal;
  const subject = goal ? subjects.find(s => s.id === goal.subjectId) : null;

  useEffect(() => {
    if (goal) {
      setActualMinutes(goal.actualMinutes || goal.targetDurationMinutes || 60);
      setQuestionsCorrect(goal.questionsCorrect || 0);
      setQuestionsWrong(goal.questionsWrong || 0);
      setDifficulty(goal.difficulty || 'Médio');
      setNotes(goal.notes || '');
      setTimerSeconds((goal.actualMinutes || goal.targetDurationMinutes || 60) * 60);
      setIsTimerRunning(false);
      setPendingErrorQuestions([]);
      setShowErrorEntry(false);
    }
  }, [goal]);

  // Stopwatch ticking
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(sec => {
          const next = sec + 1;
          setActualMinutes(Math.max(1, Math.round(next / 60)));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!goal) return null;

  const totalQuestions = questionsCorrect + questionsWrong;
  const accuracy = totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0;

  const formatTimerDisplay = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddQuickError = () => {
    setPendingErrorQuestions(prev => [
      ...prev,
      {
        statement: '',
        markedOption: '',
        correctOption: '',
        mistakeReason: 'Falta de atenção / Pegadinha',
        explanation: '',
      }
    ]);
    setShowErrorEntry(true);
  };

  const handleRemoveQuickError = (index: number) => {
    setPendingErrorQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuickError = (index: number, field: string, value: any) => {
    setPendingErrorQuestions(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSave = () => {
    completeGoal(goal.id, {
      actualMinutes,
      questionsCorrect,
      questionsWrong,
      difficulty,
      notes,
      createErrorQuestions: pendingErrorQuestions.filter(q => q.statement.trim() || q.correctOption.trim()),
    });
    setSelectedGoalForModal(null);
  };

  const difficultyLevels: DifficultyLevel[] = ['Muito Fácil', 'Fácil', 'Médio', 'Difícil', 'Muito Difícil'];

  const mistakeReasonsList: MistakeReason[] = [
    'Falta de atenção / Pegadinha',
    'Lacuna teórica / Conteúdo não visto',
    'Esquecimento de regra / Prazo',
    'Dúvida entre duas alternativas',
    'Interpretação do enunciado',
    'Jurisprudência / Lei Seca recente',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 border-b border-slate-100 text-slate-900 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                {subject?.code || 'DISC'}
              </span>
              <span className="text-xs text-slate-600 font-medium">{subject?.name}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5">
              {goal.topicTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preencha o resultado do seu estudo para atualizar seus gráficos e métricas
            </p>
          </div>

          <button
            onClick={() => setSelectedGoalForModal(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Study Time with stopwatch option */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                Tempo de Estudo Real
              </label>

              {/* Stopwatch controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                    isTimerRunning
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isTimerRunning ? 'Pausar' : 'Cronômetro'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                    setActualMinutes(0);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Zerar"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {formatTimerDisplay(timerSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">Cronômetro em tempo real</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={actualMinutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setActualMinutes(val);
                      setTimerSeconds(val * 60);
                    }}
                    className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-600">minutos estudados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Questions Solved (Certas & Erradas) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                Questões Resolvidas Nesta Sessão
              </label>

              {totalQuestions > 0 && (
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    accuracy >= 65 ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {accuracy}% de acerto
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Certas */}
              <div className="bg-white p-3 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Questões Certas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuestionsCorrect(Math.max(0, questionsCorrect - 1))}
                    className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={questionsCorrect}
                    onChange={(e) => setQuestionsCorrect(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 py-1 text-center font-bold text-emerald-700 border border-emerald-300 rounded focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setQuestionsCorrect(questionsCorrect + 1)}
                    className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Erradas */}
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Questões Erradas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuestionsWrong(Math.max(0, questionsWrong - 1))}
                    className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={questionsWrong}
                    onChange={(e) => setQuestionsWrong(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 py-1 text-center font-bold text-red-700 border border-red-300 rounded focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setQuestionsWrong(questionsWrong + 1)}
                    className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Nível de Dificuldade */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Nível de Dificuldade da Meta
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {difficultyLevels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all ${
                    difficulty === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Anotações da Meta */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Anotações / Pontos de Destaque
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Artigo importante para ler novamente, mnemônico gravado, etc."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Section 5: Caderno de Erros Integrado */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <BookX className="w-4 h-4 text-amber-600" />
                  Caderno de Erros Integrado
                </span>
                <p className="text-[11px] text-gray-500">
                  Adicione questões erradas diretamente para revisão programada
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuickError}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Erro</span>
              </button>
            </div>

            {/* List of pending errors to be saved with this goal */}
            {pendingErrorQuestions.map((errItem, idx) => (
              <div key={idx} className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 mb-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">Questão #{idx + 1} para o Caderno de Erros</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuickError(idx)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">
                    Enunciado / Tema da Questão
                  </label>
                  <input
                    type="text"
                    value={errItem.statement}
                    onChange={(e) => handleUpdateQuickError(idx, 'statement', e.target.value)}
                    placeholder="Ex: Pegadinha sobre competência privativa vs concorrente..."
                    className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">
                      O que você marcou (Erro)
                    </label>
                    <input
                      type="text"
                      value={errItem.markedOption}
                      onChange={(e) => handleUpdateQuickError(idx, 'markedOption', e.target.value)}
                      placeholder="Ex: Letra B (concorrente)"
                      className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">
                      Gabarito Correto
                    </label>
                    <input
                      type="text"
                      value={errItem.correctOption}
                      onChange={(e) => handleUpdateQuickError(idx, 'correctOption', e.target.value)}
                      placeholder="Ex: Letra D (Art. 22 CF)"
                      className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">
                    Motivo Principal do Erro
                  </label>
                  <select
                    value={errItem.mistakeReason}
                    onChange={(e) => handleUpdateQuickError(idx, 'mistakeReason', e.target.value as MistakeReason)}
                    className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                  >
                    {mistakeReasonsList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-600 mb-0.5">
                    Comentário de Revisão / O que você aprendeu
                  </label>
                  <textarea
                    rows={2}
                    value={errItem.explanation}
                    onChange={(e) => handleUpdateQuickError(idx, 'explanation', e.target.value)}
                    placeholder="Ex: Não confundir legislar sobre direito civil com trânsito..."
                    className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedGoalForModal(null)}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-xs transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Concluir & Salvar Meta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
