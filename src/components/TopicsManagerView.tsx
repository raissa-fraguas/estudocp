import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Layers, CheckCircle2, Circle, Clock, Check, Plus, Trash2, Search, Filter } from 'lucide-react';

export const TopicsManagerView: React.FC = () => {
  const { subjects, toggleTopicCompletion, toggleTopicRevision, addTopic, deleteTopic } = useStudy();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !currentSubject) return;
    addTopic(currentSubject.id, newTopicTitle);
    setNewTopicTitle('');
  };

  const filteredTopics = currentSubject ? currentSubject.topics.filter(t => {
    if (searchTerm) {
      return t.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  }) : [];

  const completedCount = currentSubject ? currentSubject.topics.filter(t => t.completed).length : 0;
  const totalCount = currentSubject ? currentSubject.topics.length : 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Gerenciador de Assuntos (Edital Verticalizado)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Controle tópico a tópico o avanço do conteúdo programático e os ciclos de revisão espaçada (R24h, R7d, R30d).
          </p>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subjects.map(s => {
          const isSelected = s.id === currentSubject?.id;
          const sCompleted = s.topics.filter(t => t.completed).length;
          const sPct = s.topics.length > 0 ? Math.round((sCompleted / s.topics.length) * 100) : 0;

          return (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span>{s.code}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {sPct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main card */}
      {currentSubject && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                  {currentSubject.code}
                </span>
                <h2 className="text-lg font-bold text-gray-900">{currentSubject.name}</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {completedCount} de {totalCount} assuntos cobertos ({pct}%)
              </p>
            </div>

            {/* Quick search */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Filtrar assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* Add topic form */}
          <form onSubmit={handleAddTopic} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Inserir novo assunto do edital para esta matéria..."
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="flex-1 text-xs p-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition cursor-pointer"
            >
              + Adicionar Assunto
            </button>
          </form>

          {/* Topics table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <th className="py-2 px-3 w-10">Status</th>
                  <th className="py-2 px-3">Tópico do Edital</th>
                  <th className="py-2 px-3 w-20 text-center">R24h</th>
                  <th className="py-2 px-3 w-20 text-center">R7d</th>
                  <th className="py-2 px-3 w-20 text-center">R30d</th>
                  <th className="py-2 px-3 w-12 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleTopicCompletion(currentSubject.id, topic.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition ${
                          topic.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-gray-300 text-transparent hover:border-gray-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-medium ${topic.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {topic.title}
                      </span>
                    </td>

                    {/* Revision R24 */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleTopicRevision(currentSubject.id, topic.id, 'revisedR24')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          topic.revisedR24 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {topic.revisedR24 ? 'Feito' : 'R24'}
                      </button>
                    </td>

                    {/* Revision R7 */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleTopicRevision(currentSubject.id, topic.id, 'revisedR7')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          topic.revisedR7 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {topic.revisedR7 ? 'Feito' : 'R7'}
                      </button>
                    </td>

                    {/* Revision R30 */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleTopicRevision(currentSubject.id, topic.id, 'revisedR30')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          topic.revisedR30 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {topic.revisedR30 ? 'Feito' : 'R30'}
                      </button>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => deleteTopic(currentSubject.id, topic.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
