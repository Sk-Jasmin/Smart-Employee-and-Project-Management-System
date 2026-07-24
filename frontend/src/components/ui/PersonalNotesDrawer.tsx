import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { StickyNote, Plus, Trash2, X, Check } from 'lucide-react';

interface NoteItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const PersonalNotesDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('smartcorp_personal_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Prepare Q3 engineering budget review slides', completed: false, createdAt: '10:15 AM' },
      { id: '2', text: 'Review pull request #104 for Auth Service', completed: true, createdAt: '09:30 AM' }
    ];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('smartcorp_personal_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newNote: NoteItem = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotes([newNote, ...notes]);
    setInput('');
  };

  const handleToggle = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, completed: !n.completed } : n));
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <>
      {/* Floating Notes Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Personal Quick Notes Scratchpad"
      >
        <StickyNote className="w-5 h-5" />
        {notes.filter(n => !n.completed).length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            {notes.filter(n => !n.completed).length}
          </span>
        )}
      </button>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <StickyNote className="w-4 h-4 text-blue-600" /> Personal Notes & Scratchpad
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              placeholder="Add quick reminder or task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Button size="sm" variant="primary" type="submit" className="bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </form>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No notes saved. Add one above!</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="pt-2 flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2 flex-1">
                    <button
                      onClick={() => handleToggle(note.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                        note.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {note.completed && <Check className="w-3 h-3" />}
                    </button>
                    <span className={`leading-tight ${note.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {note.text}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer shrink-0"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
