import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const icons = {
    danger: <div className="p-2.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full shrink-0"><Trash2 className="w-5 h-5" /></div>,
    warning: <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-full shrink-0"><AlertTriangle className="w-5 h-5" /></div>,
    primary: <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full shrink-0"><Info className="w-5 h-5" /></div>
  };

  const confirmVariants = {
    danger: 'danger' as const,
    warning: 'secondary' as const,
    primary: 'primary' as const
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-4 pt-1">
          {icons[variant]}
          <div className="space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {message}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              This action cannot be undone. Please confirm if you wish to proceed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariants[variant]}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
