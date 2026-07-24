import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { QrCode, Scan, CheckCircle2, RefreshCw, Camera } from 'lucide-react';

interface QrCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess: () => void;
  employeeName?: string;
  employeeCode?: string;
}

export const QrCheckInModal: React.FC<QrCheckInModalProps> = ({
  isOpen,
  onClose,
  onCheckInSuccess,
  employeeName = 'Alex Morgan',
  employeeCode = 'EMP-101'
}) => {
  const [mode, setMode] = useState<'badge' | 'scan'>('badge');
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      onCheckInSuccess();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code Attendance Check-In" maxWidth="md">
      <div className="space-y-5">
        
        {/* Toggle Mode */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setMode('badge')}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'badge'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            My Digital QR Pass
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 py-2 font-bold text-center border-b-2 transition-colors cursor-pointer ${
              mode === 'scan'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Scan Kiosk Scanner
          </button>
        </div>

        {mode === 'badge' ? (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm relative group">
              {/* SVG QR Code Simulation */}
              <svg className="w-44 h-44 text-slate-900 dark:text-slate-100" viewBox="0 0 100 100" fill="currentColor">
                {/* Corners */}
                <rect x="5" y="5" width="25" height="25" fill="currentColor"/>
                <rect x="8" y="8" width="19" height="19" fill="white" className="dark:fill-slate-950"/>
                <rect x="12" y="12" width="11" height="11" fill="currentColor"/>

                <rect x="70" y="5" width="25" height="25" fill="currentColor"/>
                <rect x="73" y="8" width="19" height="19" fill="white" className="dark:fill-slate-950"/>
                <rect x="77" y="12" width="11" height="11" fill="currentColor"/>

                <rect x="5" y="70" width="25" height="25" fill="currentColor"/>
                <rect x="8" y="73" width="19" height="19" fill="white" className="dark:fill-slate-950"/>
                <rect x="12" y="77" width="11" height="11" fill="currentColor"/>

                {/* Random Pattern Grid */}
                <rect x="35" y="5" width="6" height="6"/>
                <rect x="45" y="12" width="6" height="6"/>
                <rect x="55" y="5" width="6" height="6"/>
                <rect x="35" y="24" width="6" height="6"/>
                <rect x="45" y="70" width="6" height="6"/>
                <rect x="55" y="80" width="6" height="6"/>
                <rect x="70" y="35" width="6" height="6"/>
                <rect x="80" y="45" width="6" height="6"/>
                <rect x="70" y="60" width="6" height="6"/>
                <rect x="85" y="75" width="6" height="6"/>
                <rect x="10" y="38" width="6" height="6"/>
                <rect x="20" y="48" width="6" height="6"/>
                <rect x="35" y="50" width="15" height="15" fill="#1e88e5"/>
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{employeeName}</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{employeeCode} • Verified Corporate ID</p>
            </div>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Hold this QR pass up to the lobby entrance kiosk scanner for instant automated check-in.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-lg text-white text-center space-y-4 relative overflow-hidden">
            
            {/* Camera Viewfinder */}
            <div className="w-48 h-48 border-2 border-emerald-500 rounded-xl relative flex items-center justify-center bg-black/40 overflow-hidden">
              {scanning ? (
                <div className="w-full h-1 bg-emerald-400 absolute top-0 animate-bounce shadow-lg" />
              ) : scanned ? (
                <div className="flex flex-col items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12" />
                  <span className="text-xs font-bold">Check-In Verified!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 gap-2">
                  <Camera className="w-8 h-8 stroke-1" />
                  <span className="text-[11px]">Align QR in scanner frame</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300">
              {scanned
                ? 'Timestamp recorded at ' + new Date().toLocaleTimeString()
                : scanning
                ? 'Reading QR code matrix...'
                : 'Click button below to trigger simulated optical scan.'}
            </p>

            <Button
              variant="success"
              size="sm"
              icon={scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              onClick={handleSimulateScan}
              disabled={scanning}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {scanning ? 'Scanning...' : 'Trigger Kiosk Scan'}
            </Button>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>

      </div>
    </Modal>
  );
};
