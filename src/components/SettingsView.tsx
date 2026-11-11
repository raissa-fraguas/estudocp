import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Settings, Save, RotateCcw, Award, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { examSettings, updateExamSettings, resetAllData, setActiveView } = useStudy();

  const [studentName, setStudentName] = useState(examSettings.studentName);
  const [examName, setExamName] = useState(examSettings.examName);
  const [examDate, setExamDate] = useState(examSettings.examDate);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(examSettings.weeklyTargetHours);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateExamSettings({
      studentName,
      examName,
      examDate,
      weeklyTargetHours: Number(weeklyTargetHours),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Deseja realmente restaurar os dados de exemplo originais?')) {
      resetAllData();
      setActiveView('painel');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gray-100 rounded-xl text-gray-800">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Configurações do Concurso & Perfil
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Personalize seu nome, a data da sua prova e a meta de horas semanais.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Seu Nome Completo
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Nome do Concurso / Cargo
              </label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Data Prevista da Prova (Contagem Regressiva)
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Meta de Estudo Semanal (Horas Líquidas)
              </label>
              <input
                type="number"
                min="5"
                max="80"
                required
                value={weeklyTargetHours}
                onChange={(e) => setWeeklyTargetHours(parseInt(e.target.value) || 20)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configurações atualizadas com sucesso!</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Padrão</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>

      {/* Local Data Storage & Backup Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Armazenamento 100% Local (Privacidade Total)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Todos os seus dados (matérias, metas, horas de estudo e o caderno de erros) são salvos exclusivamente no armazenamento interno do seu navegador (<code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">localStorage</code>). Nada é enviado para a nuvem ou servidores externos.
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-gray-800">Backup & Portabilidade dos Seus Estudos</h4>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Baixe uma cópia dos seus dados em arquivo JSON para guardar no seu computador ou transferir para outro navegador.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const backupData = {
                  subjects: JSON.parse(localStorage.getItem('concursopro_subjects_v1') || '[]'),
                  goals: JSON.parse(localStorage.getItem('concursopro_goals_v1') || '[]'),
                  errors: JSON.parse(localStorage.getItem('concursopro_errors_v1') || '[]'),
                  settings: JSON.parse(localStorage.getItem('concursopro_settings_v1') || '{}'),
                  exportedAt: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup_estudos_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs hover:shadow-sm transition cursor-pointer"
            >
              Exportar Backup (.json)
            </button>

            <label className="px-3.5 py-2 text-xs font-semibold bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer transition">
              <span>Restaurar Backup</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target?.result as string);
                      if (data.subjects) localStorage.setItem('concursopro_subjects_v1', JSON.stringify(data.subjects));
                      if (data.goals) localStorage.setItem('concursopro_goals_v1', JSON.stringify(data.goals));
                      if (data.errors) localStorage.setItem('concursopro_errors_v1', JSON.stringify(data.errors));
                      if (data.settings) localStorage.setItem('concursopro_settings_v1', JSON.stringify(data.settings));
                      alert('Backup restaurado com sucesso! A página será atualizada.');
                      window.location.reload();
                    } catch {
                      alert('Erro ao ler arquivo de backup. Verifique se é um arquivo JSON válido.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
