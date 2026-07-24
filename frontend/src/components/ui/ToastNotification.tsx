import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container-corporate p-3">
      {toasts.map((toast) => {
        let bgClass = 'bg-white text-dark border-start border-4 border-primary';
        let Icon = Info;
        let iconColor = 'text-primary';

        if (toast.type === 'success') {
          bgClass = 'bg-white text-dark border-start border-4 border-success';
          Icon = CheckCircle2;
          iconColor = 'text-success';
        } else if (toast.type === 'error') {
          bgClass = 'bg-white text-dark border-start border-4 border-danger';
          Icon = XCircle;
          iconColor = 'text-danger';
        } else if (toast.type === 'warning') {
          bgClass = 'bg-white text-dark border-start border-4 border-warning';
          Icon = AlertTriangle;
          iconColor = 'text-warning';
        }

        return (
          <div
            key={toast.id}
            className={`toast show align-items-center shadow-sm mb-2 rounded-2 ${bgClass}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ minWidth: '300px', maxWidth: '400px' }}
          >
            <div className="d-flex p-2 align-items-start">
              <div className={`me-2 mt-1 ${iconColor}`}>
                <Icon size={20} />
              </div>
              <div className="toast-body p-0 flex-grow-1">
                <strong className="d-block text-dark small font-weight-bold">{toast.title}</strong>
                {toast.message && <span className="small text-secondary">{toast.message}</span>}
              </div>
              <button
                type="button"
                className="btn-close ms-2 me-1 mt-1 small"
                onClick={() => onDismiss(toast.id)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
