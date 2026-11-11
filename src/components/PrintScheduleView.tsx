import React from 'react';
import { useStudy } from '../context/StudyContext';
import { Printer, ArrowLeft, Download, CheckSquare } from 'lucide-react';

export const PrintScheduleView: React.FC = () => {
  const { examSettings, goals, subjects, setActiveView, stats } = useStudy();

  const daysOrder: Array<{ key: string; name: string }> = [
    { key: 'seg', name: 'Segunda-feira' },
    { key: 'ter', name: 'Terça-feira' },
    { key: 'qua', name: 'Quarta-feira' },
    { key: 'qui', name: 'Quinta-feira' },
    { key: 'sex', name: 'Sexta-feira' },
    { key: 'sab', name: 'Sábado' },
    { key: 'dom', name: 'Domingo' },
  ];

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
      {/* On-screen action toolbar (hidden during print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('painel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Painel</span>
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Visualização de Impressão / PDF Offline</h2>
            <p className="text-[11px] text-gray-500">
              Esta folha foi estruturada para preenchimento manual impresso ou para salvar como PDF no navegador.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar como PDF</span>
        </button>
      </div>

      {/* Printable Sheet (Always clean, A4 styled, black & white friendly) */}
      <div className="bg-white p-8 rounded-2xl border border-gray-300 shadow-sm print:border-none print:shadow-none print:p-0 print-container font-sans text-gray-900">
        {/* Header */}
        <div className="border-b-2 border-gray-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold uppercase tracking-wider text-gray-900">
                Plano de Estudo Semanal & Acompanhamento Offline
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Concurso: <strong className="text-black">{examSettings.examName}</strong> | Aluno: <strong className="text-black">{examSettings.studentName}</strong>
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-gray-800">ConcursoPro</span>
              <p className="text-[10px] text-gray-500">Semana de 09/11 a 15/11/2026</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4 text-[11px] bg-gray-50 p-2.5 rounded-lg border border-gray-200 print:bg-transparent">
            <div>
              <span className="text-gray-500 block">Carga Planejada:</span>
              <strong className="text-xs font-mono">{examSettings.weeklyTargetHours}h / semana</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Data da Prova:</span>
              <strong className="text-xs">{examSettings.examDate ? new Date(examSettings.examDate).toLocaleDateString('pt-BR') : 'A definir'}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Horas Acumuladas:</span>
              <strong className="text-xs font-mono">{stats.totalHoursFormatted}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">Questões Feitas:</span>
              <strong className="text-xs">{stats.totalQuestions}</strong>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b pb-1">
            Grade de Metas por Dia da Semana
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-800 bg-gray-100 print:bg-gray-100">
                  <th className="py-2 px-2 font-bold w-20">Dia</th>
                  <th className="py-2 px-2 font-bold w-28">Disciplina</th>
                  <th className="py-2 px-2 font-bold">Assunto / Conteúdo</th>
                  <th className="py-2 px-2 font-bold w-16 text-center">Previsto</th>
                  <th className="py-2 px-2 font-bold w-20 text-center">Tempo Real</th>
                  <th className="py-2 px-2 font-bold w-28 text-center">Questões (C / E)</th>
                  <th className="py-2 px-2 font-bold w-20 text-center">Dificuldade</th>
                  <th className="py-2 px-2 font-bold w-14 text-center">Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {daysOrder.map((day) => {
                  const dayGoals = goals.filter(g => g.dayOfWeek === day.key);
                  if (dayGoals.length === 0) {
                    return (
                      <tr key={day.key} className="text-gray-400">
                        <td className="py-2 px-2 font-bold text-gray-700">{day.name.split('-')[0]}</td>
                        <td colSpan={7} className="py-2 px-2 italic text-[11px]">
                          Revisão livre ou descanso programado
                        </td>
                      </tr>
                    );
                  }

                  return dayGoals.map((goal, idx) => {
                    const sub = getSubject(goal.subjectId);
                    const isDone = goal.status === 'concluida';

                    return (
                      <tr key={goal.id} className="hover:bg-gray-50/50 break-inside-avoid">
                        {idx === 0 ? (
                          <td 
                            rowSpan={dayGoals.length} 
                            className="py-2 px-2 font-bold text-gray-800 align-top border-r border-gray-200"
                          >
                            {day.name.split('-')[0]}
                          </td>
                        ) : null}
                        <td className="py-2 px-2 font-semibold text-gray-800">
                          {sub?.code || 'DISC'}
                        </td>
                        <td className="py-2 px-2">
                          <span className="font-medium text-gray-900">{goal.topicTitle}</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-center text-gray-600">
                          {goal.targetDurationMinutes}m
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          {isDone && goal.actualMinutes ? `${goal.actualMinutes}m` : '[____] min'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          {isDone && goal.questionsCorrect !== undefined 
                            ? `${goal.questionsCorrect} C / ${goal.questionsWrong} E` 
                            : '[  ] C / [  ] E'}
                        </td>
                        <td className="py-2 px-2 text-center text-[11px]">
                          {isDone && goal.difficulty ? goal.difficulty : '[ F | M | D ]'}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="inline-block w-4 h-4 border-2 border-gray-700 rounded-sm">
                            {isDone ? '✓' : ''}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </table>
          </div>

          {/* Caderno de Erros - Espaço para Registro Manual Offline */}
          <div className="pt-6 border-t-2 border-gray-800 break-inside-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
              Caderno de Erros Rápido da Semana (Preenchimento durante a resolução offline)
            </h3>
            <p className="text-[10px] text-gray-500 mb-3">
              Anote aqui as questões que você errou ou teve dúvida para transcrever e revisar na plataforma:
            </p>

            <table className="w-full text-left border border-gray-300 text-[10px]">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-1.5 w-16">Matéria</th>
                  <th className="p-1.5 w-32">Assunto</th>
                  <th className="p-1.5">O que errou / Pegadinha da banca</th>
                  <th className="p-1.5 w-48">Regra / Artigo a memorizar</th>
                  <th className="p-1.5 w-12 text-center">Revisto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="h-9">
                    <td className="p-1.5 border-r border-gray-200"></td>
                    <td className="p-1.5 border-r border-gray-200"></td>
                    <td className="p-1.5 border-r border-gray-200"></td>
                    <td className="p-1.5 border-r border-gray-200"></td>
                    <td className="p-1.5 text-center">[ ]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Anotações Gerais & Assinatura */}
          <div className="pt-4 grid grid-cols-2 gap-4 text-xs break-inside-avoid">
            <div className="border border-gray-300 p-3 rounded-lg h-24">
              <span className="font-bold text-gray-700 block mb-1">Anotações e Ajustes para a Próxima Semana:</span>
            </div>
            <div className="border border-gray-300 p-3 rounded-lg h-24 flex flex-col justify-between">
              <span className="font-bold text-gray-700">Avaliação do Aluno:</span>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Metas atingidas: [   ] %</span>
                <span>Data: ___/___/______</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
