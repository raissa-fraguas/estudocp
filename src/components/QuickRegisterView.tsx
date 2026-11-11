import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { DifficultyLevel, MistakeReason } from '../types';
import { PlusCircle, Clock, Check, X, BookX, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuickRegisterView: React.FC = () => {
  const { subjects, addGoal, completeGoal, setActiveView } = useStudy();

  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [actualMinutes, setActualMinutes] = useState<number>(60);
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(15);
  const [questionsWrong, setQuestionsWrong] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Médio');
  const [notes, setNotes] = useState<string>('');

  const [sendToErrorNotebook, setSendToErrorNotebook] = useState<boolean>(false);
  const [errorStatement, setErrorStatement] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<string>('');
  const [mistakeReason, setMistakeReason] = useState<MistakeReason>('Falta de atenção / Pegadinha');
  const [explanation, setExplanation] = useState<string>('');

  const totalQuestions = questionsCorrect + questionsWrong;
  const accuracy = totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    const newGoalId = `goal-${Date.now()}`;
    addGoal({
      subjectId,
      topicTitle,
      targetDurationMinutes: actualMinutes,
      dayOfWeek: 'qua',
      date: '2026-11-11',
      status: 'pendente',
    });

    completeGoal(newGoalId, {
      actualMinutes,
      questionsCorrect,
      questionsWrong,
      difficulty,
      notes,
      createErrorQuestions: sendToErrorNotebook && errorStatement.trim() ? [{
        statement: errorStatement,
        correctOption,
        mistakeReason,
        explanation,
      }] : [],
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setActiveView('painel');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-[#b38e44]/10 rounded-xl text-[#b38e44]">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Registrar Sessão de Estudo
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Registre o tempo estudado, o volume de questões certas e erradas e alimente seus gráficos.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Disciplina
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#b38e44]"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Assunto Estudado
              </label>
              <input
                type="text"
                required
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Ex: Resolução de questões de Direito Constitucional"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#b38e44]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Tempo Líquido (Minutos)
              </label>
              <input
                type="number"
                min="5"
                max="600"
                required
                value={actualMinutes}
                onChange={(e) => setActualMinutes(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">
                Questões Certas
              </label>
              <input
                type="number"
                min="0"
                required
                value={questionsCorrect}
                onChange={(e) => setQuestionsCorrect(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-red-700 uppercase mb-1">
                Questões Erradas
              </label>
              <input
                type="number"
                min="0"
                required
                value={questionsWrong}
                onChange={(e) => setQuestionsWrong(parseInt(e.target.value) || 0)}
                className="w-full text-xs p-2.5 rounded-xl border border-red-300 font-bold text-red-800"
              />
            </div>
          </div>

          {/* Quick accuracy feedback */}
          {totalQuestions > 0 && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">Total de questões resolvidas: <strong>{totalQuestions}</strong></span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${
                accuracy >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {accuracy}% de aproveitamento
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Dificuldade Percebida
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['Muito Fácil', 'Fácil', 'Médio', 'Difícil', 'Muito Difícil'] as DifficultyLevel[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    difficulty === d
                      ? 'bg-[#b38e44] text-white border-[#b38e44]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Anotações da Sessão
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Dúvida tirada na aula 4, ler artigo 37 novamente..."
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
            />
          </div>

          {/* Send error to notebook */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={sendToErrorNotebook}
                onChange={(e) => setSendToErrorNotebook(e.target.checked)}
                className="w-4 h-4 rounded text-[#b38e44] focus:ring-[#b38e44]"
              />
              <span>Desejo registrar uma questão errada no Caderno de Erros agora</span>
            </label>

            {sendToErrorNotebook && (
              <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Enunciado ou Resumo da Questão</label>
                  <input
                    type="text"
                    value={errorStatement}
                    onChange={(e) => setErrorStatement(e.target.value)}
                    placeholder="Enunciado ou pegadinha..."
                    className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Gabarito Correto</label>
                  <input
                    type="text"
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                    placeholder="Gabarito oficial..."
                    className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">O que aprender com este erro?</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Anotação de revisão..."
                    className="w-full text-xs p-2 bg-white rounded border border-gray-200"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setActiveView('painel')}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#b38e44] to-[#96742e] rounded-xl shadow-sm hover:shadow-md transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Registro de Estudo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
