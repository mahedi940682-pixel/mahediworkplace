import React, { useState, useRef } from 'react';
import { WorkspaceBackup } from '../types';
import { 
  Download, 
  Upload, 
  Settings, 
  Database, 
  ShieldAlert, 
  CloudLightning,
  Check, 
  RefreshCw,
  Sparkles,
  HelpCircle,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsProps {
  entireData: WorkspaceBackup;
  onRestoreBackup: (backup: WorkspaceBackup) => void;
  onClearDatabase: () => void;
}

export default function SettingsPage({
  entireData,
  onRestoreBackup,
  onClearDatabase,
}: SettingsProps) {
  const [themeSetting, setThemeSetting] = useState<'light' | 'nord' | 'warm'>('warm');
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export JSON file for laptop
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(entireData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `mahediworkplace_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Failed to export JSON file', err);
    }
  };

  // Convert schema into CSV format and download
  const handleExportCSV = (module: 'clients' | 'leads' | 'tasks') => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      const items = entireData[module];
      if (!items || items.length === 0) {
        alert(`No ${module} records exists to generate a CSV spreadsheet layout.`);
        return;
      }
      
      // Build simple columns based on types
      const headers = Object.keys(items[0]).join(",");
      csvContent += headers + "\r\n";
      
      items.forEach((item: any) => {
        const row = Object.values(item).map(val => {
          const str = String(val).replace(/"/g, '""');
          return str.includes(',') ? `"${str}"` : str;
        }).join(",");
        csvContent += row + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `mahediworkplace_${module}_table.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and Drop files upload parser
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Read upload JSON
  const handleFileImport = (file: File) => {
    setRestoreError(null);
    setRestoreSuccess(false);

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setRestoreError("Invalid format. Please supply a valid Mahediworkplace .json backup archive.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        
        // Basic verification
        if (!parsed.memories || !parsed.clients || !parsed.leads) {
          setRestoreError("Verification failed: File is missing required database structures (memories, clients, leads).");
          return;
        }

        onRestoreBackup(parsed);
        setRestoreSuccess(true);
        setTimeout(() => setRestoreSuccess(false), 5000);
      } catch (err) {
        setRestoreError("Critial: Failed to parse raw JSON contents. Verify file structures are undamaged.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileImport(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileImport(e.target.files[0]);
    }
  };

  const triggerReset = () => {
    if (confirm("🚨 WARNING: Are you absolutely sure you want to clear your local database?\nThis will erase all thoughts, tasks, client logs, and investment values. This action is irreversible unless you downloaded a backup JSON to your laptop!")) {
      onClearDatabase();
      alert("Database wiped fully. Seed modules reloaded.");
    }
  };

  return (
    <div className="space-y-6" id="settings-root">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Control Panel & Administration</h1>
        <p className="text-slate-500 text-xs mt-1">
          Configure systems interfaces, fetch exports, restore offline schemas, or toggle future sync components.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Backup, Import and Reset Operations (8 cells size) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Export Assets Block */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              Download Offline Database (Laptop Archives)
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Generate a local, self-contained, fully-structured JSON database snapshot. Keep this file stored securely on your desktop. You can reload this file at any time on any device.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                id="btn-export-json"
                onClick={handleExportJSON}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-orange-400 font-bold" />
                Export Complete Workspace JSON
              </button>

              <button
                id="btn-export-clients-csv"
                onClick={() => handleExportCSV('clients')}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs border border-slate-205 font-medium transition cursor-pointer"
              >
                Export Clients CSV
              </button>

              <button
                id="btn-export-leads-csv"
                onClick={() => handleExportCSV('leads')}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs border border-slate-205 font-medium transition cursor-pointer"
              >
                Export Leads CSV
              </button>
            </div>
          </div>

          {/* Import Drag & Drop system */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-500" />
              Import Offline Backup Database file
            </h3>
            <p className="text-slate-500 text-xs text-slate-505">
              Warning: Uploading a previous backup file will securely overwrite your current browser sandbox state. Make sure you back up active logs before proceeding.
            </p>

            {/* Drag Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
                dragActive ? 'border-orange-500 bg-orange-500/5' : 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".json"
                onChange={handleFileInputChange}
              />
              <Upload className="w-8 h-8 text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Drag & drop your Mahediworkplace .json file here</p>
                <p className="text-[10px] text-slate-400 mt-1">or click to browse local files on your machine</p>
              </div>
            </div>

            {/* Status alerts */}
            <AnimatePresence>
              {restoreSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-2xl text-xs font-semibold flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Interactive restore completed successfully! Core databases synced offline.</span>
                </motion.div>
              )}

              {restoreError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-rose-50 border border-rose-200 text-rose-850 rounded-2xl text-xs font-semibold flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-700 hover:animate-shake" />
                  <span>{restoreError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Database Reset */}
          <div className="bg-red-50/20 border border-red-500/10 rounded-3xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-red-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-red-700" />
              Destructive Operations
            </h4>
            <p className="text-slate-500 text-xs">
              Clear all current local data buffers including task records and workspace configurations. This is useful for clearing storage tests or changing system operators.
            </p>
            <button
              id="btn-trigger-reset-db"
              onClick={triggerReset}
              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
            >
              Reset Terminal Offline Storage
            </button>
          </div>

        </div>

        {/* Right Side: Options, Prefs & Future capabilities (4 cells size) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick theme selectors */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              Interface Theme Config
            </h3>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest block">Active visual scheme</span>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'warm', label: 'Warm Warehouse Sunset (Sunset Glow)', desc: 'Elegant amber headings, high contrast dark inputs' },
                  { key: 'light', label: 'Clean High Contrast Slate (Monochrome)', desc: 'Perfect for bright room shift environments' },
                  { key: 'nord', label: 'Nordic Operational Slate (Cool Slate)', desc: 'Chilled blues and slate tints' }
                ].map((th) => (
                  <button
                    id={`btn-config-theme-${th.key}`}
                    key={th.key}
                    onClick={() => setThemeSetting(th.key as any)}
                    className={`text-left p-3 rounded-2xl border transition text-xs ${
                      themeSetting === th.key 
                        ? 'border-indigo-600 bg-indigo-50/20 text-indigo-950 font-bold' 
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/30 font-medium text-slate-600'
                    }`}
                  >
                    <div>{th.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-normal">{th.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sync status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CloudLightning className="w-4 h-4 text-orange-500" />
              Optional Cloud Sync
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Enable optional automated backups to secure private cloud storage or coordinate collaborative changes with other team members in real-time.
            </p>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-705">Automated Online Sync</span>
              <button
                id="btn-toggle-cloud-sync"
                onClick={() => {
                  setSyncEnabled(!syncEnabled);
                  alert(`Sync features are fully optional. Real-time connections are inactive in this local offline utility mode.`);
                }}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${syncEnabled ? 'bg-orange-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-250 ${syncEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Help metadata */}
          <div className="bg-orange-50/40 border border-orange-550/10 rounded-3xl p-5 space-y-2.5 text-xs text-slate-650">
            <h4 className="font-bold text-orange-850 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-orange-600" />
              Farhan's Warehouse Operating system
            </h4>
            <div className="space-y-1 text-[11px] font-mono text-slate-500">
              <div>Version: v1.0.0 Stable</div>
              <div>Platform: Local Laptop Client</div>
              <div>User Email: mahedi940682@gmail.com</div>
              <div>Status: 100% Offline Active</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
