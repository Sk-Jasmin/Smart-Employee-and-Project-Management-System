import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput, FormSelect } from '../components/ui/FormInput';
import { Badge } from '../components/ui/Badge';
import { Settings, Sun, Moon, CheckCircle2, Palette, Sliders, Keyboard, Check, LayoutGrid } from 'lucide-react';
import { ThemePreset } from '../types';

interface SettingsPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ darkMode, setDarkMode }) => {
  const [apiBaseUrl, setApiBaseUrl] = useState('/api/v1');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [timezone, setTimezone] = useState('America/New_York');
  const [activePreset, setActivePreset] = useState<ThemePreset>('slate');
  const [density, setDensity] = useState<'cozy' | 'compact'>('cozy');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [msg, setMsg] = useState('');

  const themePresets: { id: ThemePreset; name: string; color: string; bg: string }[] = [
    { id: 'slate', name: 'Dark Slate (Default)', color: '#3b82f6', bg: 'bg-slate-900' },
    { id: 'cyber', name: 'Midnight Cyber', color: '#a855f7', bg: 'bg-zinc-950' },
    { id: 'emerald', name: 'Emerald Corporate', color: '#10b981', bg: 'bg-emerald-950' },
    { id: 'amber', name: 'Sunset Amber', color: '#f59e0b', bg: 'bg-amber-950' },
    { id: 'ocean', name: 'Ocean Breeze', color: '#06b6d4', bg: 'bg-cyan-950' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('System preferences and visual theme preset saved successfully.');
    setTimeout(() => setMsg(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="page-title-icon text-indigo-600 dark:text-indigo-400" /> Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize display themes, layout density, keyboard shortcuts, and REST API configurations.
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {msg}
        </div>
      )}

      {/* Visual Theme & Presets Card */}
      <Card>
        <CardHeader>
          <span className="flex items-center gap-1.5"><Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Interface Theme & Display Modes</span>
        </CardHeader>
        <CardBody className="p-5 space-y-6">
          
          <div className="flex items-center justify-between p-4 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Light / Dark Theme Switch</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                Current active mode: <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </p>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-md ${
                darkMode
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-500/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              {darkMode ? <><Sun className="w-4 h-4 text-amber-950" /> Switch to Light Mode</> : <><Moon className="w-4 h-4 text-white" /> Switch to Dark Mode</>}
            </button>
          </div>

          {/* Theme Presets Grid */}
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Corporate Palette Presets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {themePresets.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setActivePreset(preset.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-slate-800/90 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{preset.name}</span>
                      {isActive && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20" style={{ backgroundColor: preset.color }} />
                      <span className={`h-4 flex-1 rounded ${preset.bg}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Density & Font Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-200/80 dark:border-slate-800 pt-4">
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Layout Density
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDensity('cozy')}
                  className={`flex-1 py-2 px-3 rounded-lg border font-bold transition-colors cursor-pointer ${
                    density === 'cozy'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  Cozy (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setDensity('compact')}
                  className={`flex-1 py-2 px-3 rounded-lg border font-bold transition-colors cursor-pointer ${
                    density === 'compact'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  Compact Tally
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Glassmorphism Blur Effect
              </h4>
              <label className="flex items-center gap-3 p-2.5 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={glassmorphism}
                  onChange={(e) => setGlassmorphism(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Enable backdrop blur on navbar & card overlays</span>
              </label>
            </div>
          </div>

        </CardBody>
      </Card>

      {/* Keyboard Shortcuts Info */}
      <Card>
        <CardHeader>
          <span className="flex items-center gap-1.5"><Keyboard className="w-4 h-4 text-emerald-600" /> Keyboard Shortcuts Engine</span>
        </CardHeader>
        <CardBody className="p-4 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">Global Keyboard Shortcuts Active</p>
            <p className="text-slate-500 text-[11px] mt-0.5">Press <kbd className="font-mono font-bold bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+K</kbd> to open Global Search, <kbd className="font-mono font-bold bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">Ctrl+B</kbd> for Bookmarks, or <kbd className="font-mono font-bold bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">?</kbd> for help.</p>
          </div>
          <Badge variant="green">Active</Badge>
        </CardBody>
      </Card>

      {/* API & Backend Config Card */}
      <Card>
        <CardHeader>
          Backend Gateway & Dispatch Settings
        </CardHeader>
        <CardBody className="p-5 space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <FormInput
              label="Backend REST API Gateway Base URL"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              helperText="Axios HTTP client routes all REST requests through this gateway."
            />

            <FormSelect
              label="Default System Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'America/New_York', label: 'Eastern Standard Time (EST / UTC-5)' },
                { value: 'America/Chicago', label: 'Central Standard Time (CST / UTC-6)' },
                { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST / UTC-8)' },
                { value: 'Europe/London', label: 'Greenwich Mean Time (GMT / UTC+0)' }
              ]}
            />

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Notification Preferences
              </h4>

              <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                />
                <span>Send automated emails for leave approvals & task assignments</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                />
                <span>Enable desktop browser push notifications for announcements</span>
              </label>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" className="bg-blue-700 hover:bg-blue-800">
                Save Preferences
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

    </div>
  );
};
