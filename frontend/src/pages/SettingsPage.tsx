import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormSelect } from '../components/ui/FormInput';
import { 
  Settings, 
  CheckCircle2, 
  Globe, 
  Bell, 
  Shield, 
  Save
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPageProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('smartcorp_app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      timezone: 'America/New_York',
      dateFormat: 'YYYY-MM-DD',
      language: 'en-US',
      emailAlerts: true,
      pushAlerts: true,
      weeklyDigest: false,
      sessionTimeout: '30',
      twoFactorAuth: false
    };
  });

  const [msg, setMsg] = useState('');

  const handleSelectChange = (key: keyof AppSettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('smartcorp_app_settings', JSON.stringify(settings));
    setMsg('Settings saved successfully.');
    setTimeout(() => setMsg(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2.5 text-xl sm:text-2xl font-bold">
          <Settings className="w-7 h-7 text-indigo-600 dark:text-indigo-400" /> System Settings
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 font-medium">
          Manage regional preferences, notification alerts, and security options.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Regional & System Preferences */}
        <Card>
          <CardHeader className="py-4">
            <span className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Regional & System Preferences
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormSelect
                label="System Timezone"
                value={settings.timezone}
                onChange={(e) => handleSelectChange('timezone', e.target.value)}
                options={[
                  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                  { value: 'America/New_York', label: 'Eastern Time (EST / UTC-5)' },
                  { value: 'America/Chicago', label: 'Central Time (CST / UTC-6)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PST / UTC-8)' },
                  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT / UTC+0)' },
                  { value: 'Europe/Paris', label: 'Central European Time (CET / UTC+1)' },
                  { value: 'Asia/Kolkata', label: 'India Standard Time (IST / UTC+5:30)' },
                  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST / UTC+9)' }
                ]}
              />

              <FormSelect
                label="Date Format"
                value={settings.dateFormat}
                onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
                options={[
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (Standard ISO)' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK / EU Standard)' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Standard)' }
                ]}
              />

              <FormSelect
                label="Language"
                value={settings.language}
                onChange={(e) => handleSelectChange('language', e.target.value)}
                options={[
                  { value: 'en-US', label: 'English (US)' },
                  { value: 'en-GB', label: 'English (UK)' },
                  { value: 'es-ES', label: 'Spanish (Español)' },
                  { value: 'fr-FR', label: 'French (Français)' },
                  { value: 'de-DE', label: 'German (Deutsch)' }
                ]}
              />
            </div>
          </CardBody>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader className="py-4">
            <span className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Notification Preferences
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="space-y-3.5">
              <label className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/60">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleSelectChange('emailAlerts', e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 block">Email Notifications</span>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 block font-medium leading-relaxed">
                    Receive email updates for leave request status changes, project milestones, and task assignments.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/60">
                <input
                  type="checkbox"
                  checked={settings.pushAlerts}
                  onChange={(e) => handleSelectChange('pushAlerts', e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 block">Browser Push Notifications</span>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 block font-medium leading-relaxed">
                    Enable desktop notifications for instant alerts on urgent company announcements and reminders.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/60">
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => handleSelectChange('weeklyDigest', e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 block">Weekly Performance Summary</span>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 block font-medium leading-relaxed">
                    Receive a weekly summary email detailing team attendance metrics and project completion stats.
                  </span>
                </div>
              </label>
            </div>
          </CardBody>
        </Card>

        {/* Security & Session Management */}
        <Card>
          <CardHeader className="py-4">
            <span className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Security & Session Settings
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormSelect
                label="Automatic Session Timeout"
                value={settings.sessionTimeout}
                onChange={(e) => handleSelectChange('sessionTimeout', e.target.value)}
                options={[
                  { value: '15', label: '15 Minutes of Inactivity' },
                  { value: '30', label: '30 Minutes of Inactivity' },
                  { value: '60', label: '1 Hour of Inactivity' },
                  { value: '240', label: '4 Hours of Inactivity' },
                  { value: '0', label: 'Never (Not Recommended)' }
                ]}
              />

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                  Two-Factor Authentication (2FA)
                </label>
                <label className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSelectChange('twoFactorAuth', e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    Require 2FA verification for administrator logins
                  </span>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base py-2.5 px-6 flex items-center gap-2">
            <Save className="w-5 h-5" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
