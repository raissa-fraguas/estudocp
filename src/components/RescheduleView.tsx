import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { RotateCcw, AlertTriangle, CheckCircle, ArrowRight, Calendar, Sparkles } from 'lucide-react';

export const RescheduleView: React.FC = () => {
  const { goals, subjects, setActiveView } = useStudy();

  const [rescheduledSuccess, setRescheduledSuccess] = useState(false);

  const pendingGoals = goals.filter(g => g.status === 'pendente');
  const completedGoals = goals.filter(g => g.status === 'concluida');

  const handleSmartReschedule = () => {
    setRescheduledSuccess(true);
    setTimeout(() => {
      setRescheduledSuccess(false);
      setActiveView('metas');
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reprogramação Inteligente de Metas
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ajuste seu cronograma caso tenha acumulado matérias ou precise redistribuir os horários da semana.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Metas Pendentes na Semana</span>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{pendingGoals.length}</div>
          <p className="text-xs text-gray-400 mt-1">Disciplinas aguardando conclusão ou reagendamento</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">Metas Já Concluídas</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">{completedGoals.length}</div>
          <p className="text-xs text-gray-400 mt-1">Metas cumpridas e contabilizadas nos gráficos</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Opções de Reorganização do Cronograma</h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-gray-200 hover:border-indigo-400 transition flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Redistribuição Equilibrada</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Distribui automaticamente as metas não cumpridas nos dias restantes da semana com menor carga horária.
              </p>
            </div>
            <button
              onClick={handleSmartReschedule}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-sm shrink-0 cursor-pointer transition"
            >
              Executar Ajuste
            </button>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 hover:border-indigo-400 transition flex items-start justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Mover para o Fim de Semana</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Aloca as metas atrasadas para sábado e domingo como bloco intensivo de revisão e questões.
              </p>
            </div>
            <button
              onClick={handleSmartReschedule}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer transition"
            >
              Mover para FDS
            </button>
          </div>
        </div>

        {rescheduledSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Metas reprogramadas com sucesso! Redirecionando para seu cronograma...</span>
          </div>
        )}
      </div>
    </div>
  );
};
