import React, { useState } from 'react';
import { BACKEND_FILES } from '../data/backendCode';
import { 
  FileCode2, 
  Folder, 
  File, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Terminal, 
  Layers, 
  Shield, 
  Database, 
  Cpu 
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface CodeExplorerViewProps {
  onDownloadProject: () => void;
}

export const CodeExplorerView: React.FC<CodeExplorerViewProps> = ({ onDownloadProject }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(BACKEND_FILES[0].path);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedFile = BACKEND_FILES.find(f => f.path === selectedFilePath) || BACKEND_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("smart-employee-management");

    BACKEND_FILES.forEach(file => {
      folder?.file(file.path, file.content);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "smart-employee-management-backend.zip");
  };

  const filteredFiles = BACKEND_FILES.filter(f => 
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="page-title-icon text-indigo-600 dark:text-indigo-400" />
            Spring Boot 3 Java Source Code Workspace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete production Spring Boot backend source code, Maven POM, Docker containerization, and JUnit test suites
          </p>
        </div>

        <button
          onClick={handleExportZip}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Complete Backend (.zip)
        </button>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Tree List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Java files & configs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredFiles.map((f) => {
              const isSelected = f.path === selectedFilePath;
              const fileName = f.path.split('/').pop() || f.path;

              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFilePath(f.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <File className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <span className={`text-xs uppercase font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[600px]">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
