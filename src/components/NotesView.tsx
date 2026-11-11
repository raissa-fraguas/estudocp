import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { FolderArchive, Plus, Search, Tag, Trash2, Edit3, Bookmark } from 'lucide-react';

interface NoteItem {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

const initialNotes: NoteItem[] = [
  {
    id: 'note-1',
    subjectId: 'ces-inss',
    title: 'Mnemônico Segurados Obrigatórios (RGPS)',
    content: 'C-E-D-T-S: Contribuinte Individual, Empregado, Doméstico, Trabalhador Avulso e Segurado Especial.',
    tags: ['Mnemônico', 'Segurados', 'RGPS'],
    date: '10/11/2026',
  },
  {
    id: 'note-2',
    subjectId: 'dad-inss',
    title: 'Requisitos do Ato Administrativo (COMFIFOR)',
    content: 'COM - Competência | FI - Finalidade | FOR - Forma | MO - Motivo | OB - Objeto. Competência, finalidade e forma são SEMPRE vinculados!',
    tags: ['Atos', 'Requisitos', 'Vinculado'],
    date: '09/11/2026',
  },
  {
    id: 'note-3',
    subjectId: 'eti-inss',
    title: 'Pena aplicada pela Comissão de Ética',
    content: 'A Comissão de Ética criada pelo Decreto 1.171/94 só pode aplicar CENSURA! Não confunda com as penas disciplinares da Lei 8.112 (advertência, suspensão, demissão).',
    tags: ['Decreto 1171', 'Comissão de Ética'],
    date: '08/11/2026',
  },
];

export const NotesView: React.FC = () => {
  const { subjects } = useStudy();
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: NoteItem = {
      id: `note-${Date.now()}`,
      subjectId: newSubjectId,
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      date: new Date().toLocaleDateString('pt-BR'),
    };

    setNotes(prev => [created, ...prev]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => {
    if (searchTerm) {
      const match = (n.title + ' ' + n.content + ' ' + n.tags.join(' ')).toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Material & Anotações de Revisão
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Mnemônicos, mapas mentais, prazos e anotações rápidas para consulta imediata.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Anotação</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Pesquisar por mnemônico ou assunto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid of notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const sub = getSubject(note.subjectId);
          return (
            <div key={note.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                    {sub?.code || 'GERAL'}
                  </span>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-2">{note.title}</h3>
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100/60 font-mono">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(t => (
                    <span key={t} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
                <span>{note.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add note modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Nova Anotação de Estudo</h3>
            <p className="text-xs text-gray-500 mb-4">Guarde mnemônicos ou resumos de artigos importantes.</p>

            <form onSubmit={handleAddNote} className="space-y-4">
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
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mnemônico dos Princípios Administrativos (LIMPE)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Conteúdo</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Digite sua anotação ou mnemônico..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Mnemônico, CF88, Art 37"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
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
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-sm transition cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
