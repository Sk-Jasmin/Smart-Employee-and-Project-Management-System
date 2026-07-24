import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const shortcuts = [
    { key: 'Ctrl / Cmd + K', action: 'Focus Global Search Bar' },
    { key: 'Ctrl / Cmd + Shift + D', action: 'Toggle Dark / Light Mode' },
    { key: 'Ctrl / Cmd + Shift + E', action: 'Navigate to Employees' },
    { key: 'Ctrl / Cmd + Shift + P', action: 'Navigate to Projects' },
    { key: 'Ctrl / Cmd + Shift + T', action: 'Navigate to Task Board' },
    { key: '?', action: 'Open Keyboard Shortcuts Guide' },
    { key: 'Esc', action: 'Close any active Modal / Drawer' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts Guide" maxWidth="md">
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-md flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200">
          <Keyboard className="w-4 h-4 shrink-0 text-blue-600" />
          <span>Use these hotkeys to navigate the employee management system quickly.</span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">{sc.action}</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
