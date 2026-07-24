import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FormInput, FormTextarea } from '../components/ui/FormInput';
import { ToastMessage, ToastNotification } from '../components/ui/ToastNotification';
import { mockBackend } from '../services/api';
import { Bell, CheckCircle2, Clock, Check, Trash2, Filter, Mail, Send, Settings, ShieldCheck } from 'lucide-react';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  setNotifications
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'UNREAD' | 'TASK' | 'LEAVE' | 'ANNOUNCEMENT'>('ALL');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Email Notification Event Preferences State
  const [emailPrefs, setEmailPrefs] = useState({
    taskAssignment: true,
    leaveApproval: true,
    projectUpdate: true,
    securityAlert: true
  });

  // Test Email Dispatcher Form State
  const [emailForm, setEmailForm] = useState({
    recipient: 'alex.morgan@smartcorp.com',
    subject: 'Task Assignment Notification: Sprint Q3 Mobile UI Sync',
    body: 'Hello Alex,\n\nYou have been assigned to high-priority task #TASK-402 (Mobile UI Sync). Deadline: 2026-08-15.\n\nBest regards,\nSmartCorp HR System'
  });
  const [dispatching, setDispatching] = useState(false);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkRead = async (id: number) => {
    await mockBackend.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await mockBackend.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDispatchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);

    setTimeout(() => {
      setDispatching(false);
      setIsEmailModalOpen(false);
      addToast('success', 'Email Notification Dispatched', `SMTP message sent to ${emailForm.recipient}.`);

      // Add to notifications feed
      const newNotification: NotificationItem = {
        id: Date.now(),
        title: `EMAIL DISPATCHED: ${emailForm.subject}`,
        message: `Sent to ${emailForm.recipient}: ${emailForm.body.substring(0, 80)}...`,
        type: 'TASK_ASSIGNED',
        isRead: false,
        createdAt: 'Just now'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }, 800);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterCategory === 'UNREAD') return !n.isRead;
    if (filterCategory === 'TASK') return n.type === 'TASK_ASSIGNED';
    if (filterCategory === 'LEAVE') return n.type === 'LEAVE_UPDATE';
    if (filterCategory === 'ANNOUNCEMENT') return n.type === 'ANNOUNCEMENT';
    return true;
  });

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'LEAVE_UPDATE': return 'green';
      case 'TASK_ASSIGNED': return 'blue';
      case 'ANNOUNCEMENT': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="page-title-icon text-indigo-600 dark:text-indigo-400" /> Notification & Email Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            System dispatch alerts, workflow updates, SMTP Email notifications, and team announcements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Mail className="w-3.5 h-3.5" />}
            onClick={() => setIsEmailModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 !text-[11px] !font-medium px-3 py-1.5"
          >
            Send Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Check className="w-3.5 h-3.5" />}
            onClick={handleMarkAllRead}
            className="!text-[11px] !font-medium px-3 py-1.5"
          >
            Mark All Read
          </Button>

          {notifications.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleClearAll}
              className="bg-rose-600 hover:bg-rose-700 !text-[11px] !font-medium px-3 py-1.5"
            >
              Clear Log
            </Button>
          )}
        </div>
      </div>

      {/* Email Notification Event Preferences Card */}
      <Card>
        <CardHeader action={<Badge variant="green" size="sm">SMTP Active</Badge>}>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Mail className="w-4 h-4 text-indigo-500" /> Email Notification Event Triggers
          </span>
        </CardHeader>
        <CardBody className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.taskAssignment}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, taskAssignment: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Task Assignment Email</span>
                <span className="text-[10px] text-slate-500">Notify when assigned a task</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.leaveApproval}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, leaveApproval: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Leave Request Decision</span>
                <span className="text-[10px] text-slate-500">Notify on leave status update</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.projectUpdate}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, projectUpdate: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Project Status Update</span>
                <span className="text-[10px] text-slate-500">Notify on project milestones</span>
              </div>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPrefs.securityAlert}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, securityAlert: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Security & Auth Alert</span>
                <span className="text-[10px] text-slate-500">Notify on password/role change</span>
              </div>
            </label>
          </div>
        </CardBody>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'UNREAD', label: `Unread (${notifications.filter(n => !n.isRead).length})` },
          { id: 'TASK', label: 'Tasks' },
          { id: 'LEAVE', label: 'Leaves' },
          { id: 'ANNOUNCEMENT', label: 'Announcements' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors duration-150 ${
              filterCategory === tab.id
                ? 'bg-indigo-600 text-white shadow-xs dark:bg-slate-900 dark:text-indigo-400 dark:border dark:border-indigo-500/60'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Notification Feed Card */}
      <Card>
        <CardHeader action={<span className="text-xs text-slate-400 font-mono">Showing {filteredNotifications.length} items</span>}>
          Activity Dispatch Feed
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p>No notifications matching category filter.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.isRead ? 'bg-indigo-50/60 dark:bg-slate-900/90 font-medium' : 'bg-white dark:bg-slate-950'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(n.type)} size="sm">{n.type}</Badge>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{n.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                    <Clock className="w-3 h-3" /> {n.createdAt}
                  </span>
                </div>

                {!n.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Dispatch Test Email Modal */}
      {isEmailModalOpen && (
        <Modal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          title="Dispatch Corporate Email Notification"
          maxWidth="lg"
        >
          <form onSubmit={handleDispatchEmail} className="space-y-4 text-xs">
            <FormInput
              label="Recipient Corporate Email"
              type="email"
              value={emailForm.recipient}
              onChange={(e) => setEmailForm({ ...emailForm, recipient: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <FormInput
              label="Email Subject Line"
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              required
            />

            <FormTextarea
              label="Email Message Content (HTML / Text)"
              rows={4}
              value={emailForm.body}
              onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
              required
            />

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">SMTP Transport Telemetry</span>
              <span>Host: smtp.smartcorp.internal:587 | Auth: TLS 1.3 | Security: Active</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsEmailModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={dispatching} icon={<Send className="w-4 h-4" />} className="bg-indigo-600 hover:bg-indigo-700">
                {dispatching ? 'Dispatching SMTP Email...' : 'Send Corporate Email'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
