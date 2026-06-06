import React, { useState } from 'react';
import { Memory, LocalTask, Client, Lead, ActivityLog, Investment } from '../types';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Pin, 
  Activity, 
  HelpCircle, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeDashboardProps {
  memories: Memory[];
  tasks: LocalTask[];
  clients: Client[];
  leads: Lead[];
  investments: Investment[];
  activityLogs: ActivityLog[];
  onAddTask: (title: string, priority: 'low' | 'medium' | 'high') => void;
  onToggleTask: (id: string) => void;
  onQuickAddMemory: (content: string) => void;
  onNavigateToModule: (module: string) => void;
}

export default function HomeDashboard({
  memories,
  tasks,
  clients,
  leads,
  investments,
  activityLogs,
  onAddTask,
  onToggleTask,
  onQuickAddMemory,
  onNavigateToModule,
}: HomeDashboardProps) {
  const [quickInput, setQuickInput] = useState('');
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const liveTasks = tasks.filter(t => !t.completed).slice(0, 5);
  const pinnedMemories = memories.filter(m => m.pinned).slice(0, 3);
  
  const totalInvestmentAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeClientsCount = clients.filter(c => c.status === 'active').length;
  const activeLeadsCount = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost').length;

  const handleQuickMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAddMemory(quickInput.trim());
    setQuickInput('');
  };

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    onAddTask(quickTaskTitle.trim(), quickTaskPriority);
    setQuickTaskTitle('');
  };

  return (
    <div className="space-y-8" id="home-dashboard-root">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl p-6 md:p-8 border border-amber-500/10 shadow-sm relative overflow-hidden" id="dashboard-hero">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full text-amber-800 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline Business Operating System</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Mahediworkplace
            </h1>
            <p className="text-slate-600 max-w-xl text-sm leading-relaxed">
              Welcome back to your offline command center. Every record is stored 100% locally on your machine for ultra-fast, zero-network utility.
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button 
              id="btn-nav-memory"
              onClick={() => onNavigateToModule('Memory Vault')}
              className="px-4 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl text-xs font-bold transition duration-200 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 font-bold" /> New Thought Dump
            </button>
            <button 
              id="btn-nav-client"
              onClick={() => onNavigateToModule('Clients')}
              className="px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold transition duration-200 flex items-center gap-2 cursor-pointer"
            >
              View Clients <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-kpis">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Active Clients</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{activeClientsCount}</div>
          <p className="text-xs text-slate-400 mt-1">Ready for follow-up cycles</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Active Leads</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{activeLeadsCount}</div>
          <p className="text-xs text-slate-400 mt-1">High conversion pipeline</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Invested Capital</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            ${totalInvestmentAmount.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Facility upgrade & assets</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Vault Keys</span>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Pin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{memories.length}</div>
          <p className="text-xs text-slate-400 mt-1">Captured business memories</p>
        </div>
      </div>

      {/* Main split: Input/Memory Sections and Tasks checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Thought Dump Box & Pinned Notes (Needs Dark card look for inputs as requested!) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Add Thought block - Dark content card as requested */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800" id="thought-dump-block">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500 text-slate-900 rounded-xl">
                  <Sparkles className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-amber-400 uppercase tracking-widest">Instant Thought Capture</h3>
                  <p className="text-xs text-slate-400">Press Enter to save instantly to Memory Vault</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleQuickMemorySubmit} className="space-y-3">
              <textarea
                id="quick-thought-textarea"
                rows={3}
                placeholder="Type a new warehouse workflow idea, client interaction takeaway, or raw notes..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleQuickMemorySubmit(e);
                  }
                }}
                className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-505 resize-none"
              />
              <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-850 text-xs">
                <span className="text-slate-500 font-mono">Status: Offline Buffer Ready</span>
                <button 
                  id="btn-quick-memory-save"
                  type="submit" 
                  disabled={!quickInput.trim()}
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-650 active:scale-95 text-white rounded-xl font-bold transition disabled:opacity-40 cursor-pointer"
                >
                  Dump Memory
                </button>
              </div>
            </form>
          </div>

          {/* Pinned Business Memories (Light elements or normal card grid) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
                Pinned Operational Guidelines
              </h2>
              <button 
                onClick={() => onNavigateToModule('Memory Vault')}
                className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Go to Vault <ArrowRight className="w-3 h-3 text-orange-500" />
              </button>
            </div>

            {pinnedMemories.length === 0 ? (
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No guidelines pinned yet. Pin memories from the Memory Vault to highlight them here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedMemories.map((mem) => (
                  <div 
                    key={mem.id} 
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative group hover:border-amber-300 transition"
                  >
                    <div className="absolute top-4 right-4 text-amber-500">
                      <Pin className="w-3.5 h-3.5 fill-amber-500" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1 block">
                      {mem.priority} priority
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-1">{mem.title || 'Untitled Thought'}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">{mem.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {mem.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-md font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Operations log */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Recent Workspace Audit Log
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex gap-3 text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div className="text-slate-400 font-mono shrink-0 whitespace-nowrap pt-0.5">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 mr-2 text-[10px] uppercase">
                      {log.module}
                    </span>
                    <span className="text-slate-600 font-medium">{log.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Quick Action Task Checklist */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Task Creation form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-500" />
              Fast Task Planner
            </h3>
            <form onSubmit={handleQuickTaskSubmit} className="space-y-3">
              <input
                id="quick-task-input"
                type="text"
                placeholder="e.g. Inspect cold room seal layout..."
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <div className="flex gap-2 items-center justify-between font-sans">
                <div className="flex gap-1.5">
                  {(['low', 'medium', 'high'] as const).map((prio) => (
                    <button
                      id={`btn-task-prio-${prio}`}
                      key={prio}
                      type="button"
                      onClick={() => setQuickTaskPriority(prio)}
                      className={`text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border transition cursor-pointer ${
                        quickTaskPriority === prio 
                          ? prio === 'high' ? 'bg-rose-50 border-rose-300 text-rose-700' : prio === 'medium' ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-slate-100 border-slate-300 text-slate-700'
                          : 'bg-transparent border-slate-100 text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
                <button
                  id="btn-quick-task-save"
                  type="submit"
                  disabled={!quickTaskTitle.trim()}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>

          {/* Today's Active Tasks list */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Active Urgent Tasks
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 py-0.5 px-2 rounded-full border border-slate-100">
                {tasks.filter(t => !t.completed).length} remaining
              </span>
            </div>

            {liveTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                🎉 Excellent! All scheduled tasks are cleared or none are registered.
              </div>
            ) : (
              <div className="space-y-2.5">
                {liveTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button 
                        id={`btn-toggle-task-${task.id}`}
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className="text-slate-400 hover:text-emerald-500 transition shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span className={`text-xs text-slate-700 font-medium truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' : task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Help Box */}
          <div className="bg-amber-50/40 border border-amber-500/10 rounded-3xl p-5">
            <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Keyboard-Driven Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono shadow-sm">Ctrl + K</kbd>
                <span>Global Search</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono shadow-sm">Ctrl + N</kbd>
                <span>Quick Memory</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 mt-1 pt-1.5 border-t border-amber-500/5">
                <span className="text-[10px] text-amber-700 italic">💡 Pressing Enter immediately submits simple inputs!</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
