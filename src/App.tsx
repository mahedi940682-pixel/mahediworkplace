import React, { useState, useEffect } from 'react';
import { WorkspaceBackup, Memory, Client, Lead, ResearchItem, Investment, SocialIdea, TeamMember, LocalTask, ActivityLog } from './types';
import { getWorkspaceData, saveWorkspaceData, addLogEntry, INITIAL_SEED_DATA } from './utils/db';
import {
  Activity,
  Pin,
  TrendingUp,
  Users,
  Briefcase,
  BookOpen,
  Settings,
  Share2,
  Search,
  CheckCircle2,
  AlertCircle,
  Menu,
  Clock,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

// Components
import HomeDashboard from './components/HomeDashboard';
import MemoryVault from './components/MemoryVault';
import SocialIntel from './components/SocialIntel';
import Investments from './components/Investments';
import Clients from './components/Clients';
import Leads from './components/Leads';
import Research from './components/Research';
import Team from './components/Team';
import SettingsPage from './components/Settings';
import CommandPalette from './components/CommandPalette';

export default function App() {
  const [data, setData] = useState<WorkspaceBackup>(() => getWorkspaceData());
  const [activeModule, setActiveModule] = useState<string>('Home Dashboard');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Undo delete storage
  const [lastDeletedItem, setLastDeletedItem] = useState<{
    module: 'memories' | 'clients' | 'leads' | 'researchItems' | 'investments' | 'socialIdeas' | 'teamMembers' | 'tasks';
    data: any;
  } | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save whenever data state updates
  useEffect(() => {
    saveWorkspaceData(data);
  }, [data]);

  // Keyboard shortcut listeners (Ctrl + K / Cmd + K for Search, Ctrl + N / Cmd + N for Note Add)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K or Cmd + K -> Search Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // Ctrl + N or Cmd + N -> Create New Memory Thought
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setActiveModule('Memory Vault');
        setToastMessage('Triggered Fast Thought capture. Press Escape to close.');
        setTimeout(() => setToastMessage(null), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Log automated action in local audit trail
  const commitLog = (moduleName: string, actionName: string, text: string) => {
    setData(prev => addLogEntry(prev, moduleName, actionName, text));
  };

  // Toast notifier
  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5050);
  };

  // --- ACTIONS WORKFLOWS ---

  // Memory Vault
  const handleAddMemory = (newMem: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const memory: Memory = {
      ...newMem,
      id: 'mem-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      memories: [memory, ...prev.memories]
    }));
    commitLog('Memory Vault', 'Create', `Memory "${memory.title || 'Untitled Note'}" committed offline.`);
    notify(`Thought saved to Memory Vault.`);
  };

  const handleUpdateMemory = (id: string, updates: Partial<Memory>) => {
    setData(prev => ({
      ...prev,
      memories: prev.memories.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m)
    }));
    const target = data.memories.find(m => m.id === id);
    commitLog('Memory Vault', 'Update', `Modified memory properties for "${target?.title || id}".`);
  };

  const handleDeleteMemory = (id: string) => {
    const itemToDelete = data.memories.find(m => m.id === id);
    if (!itemToDelete) return;

    setLastDeletedItem({ module: 'memories', data: itemToDelete });
    setData(prev => ({
      ...prev,
      memories: prev.memories.filter(m => m.id !== id)
    }));
    commitLog('Memory Vault', 'Delete', `Memory "${itemToDelete.title || id}" deleted successfully.`);
    notify(`Deleted memory "${itemToDelete.title || 'Untitled'}". Click undo below to restore.`);
  };

  // Clients
  const handleAddClient = (newCli: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const client: Client = {
      ...newCli,
      id: 'cli-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      clients: [client, ...prev.clients]
    }));
    commitLog('Clients', 'Register', `Client profile [${client.name}] logged to directories.`);
    notify(`Client registered successfully.`);
  };

  const handleUpdateClient = (id: string, updates: Partial<Client>) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
    }));
    const target = data.clients.find(c => c.id === id);
    commitLog('Clients', 'Update', `Updated metrics for client [${target?.name}].`);
  };

  const handleDeleteClient = (id: string) => {
    const item = data.clients.find(c => c.id === id);
    if (!item) return;

    setLastDeletedItem({ module: 'clients', data: item });
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id)
    }));
    commitLog('Clients', 'Erase', `Client profile [${item.name}] removed.`);
    notify(`Removed client [${item.name}]. Click undo below to restore.`);
  };

  // Leads
  const handleAddLead = (newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const lead: Lead = {
      ...newLead,
      id: 'lead-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      leads: [lead, ...prev.leads]
    }));
    commitLog('Leads', 'Qualify', `Lead [${lead.name}] prioritized relative to source ${lead.source}.`);
    notify(`Captured sales lead opportunity option.`);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    setData(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)
    }));
    const target = data.leads.find(l => l.id === id);
    commitLog('Leads', 'Pipeline Update', `Lead [${target?.name}] status upgraded to "${updates.stage || target?.stage}".`);
  };

  const handleDeleteLead = (id: string) => {
    const item = data.leads.find(l => l.id === id);
    if (!item) return;

    setLastDeletedItem({ module: 'leads', data: item });
    setData(prev => ({
      ...prev,
      leads: prev.leads.filter(l => l.id !== id)
    }));
    commitLog('Leads', 'Delete', `Lead [${item.name}] deleted.`);
    notify(`Erased deal lead [${item.name}]. Click undo below to restore.`);
  };

  // Tasks
  const handleAddTask = (title: string, priority: 'low' | 'medium' | 'high') => {
    const task: LocalTask = {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      priority,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: ['dashboard'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      tasks: [task, ...prev.tasks]
    }));
    commitLog('Tasks', 'Create', `Active checklist task "${title}" added.`);
    notify(`Task added successfully.`);
  };

  const handleToggleTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t)
    }));
    const target = data.tasks.find(t => t.id === id);
    commitLog('Tasks', 'Toggle', `Task "${target?.title}" marked as ${!target?.completed ? 'Completed' : 'Active'}.`);
  };

  // Research
  const handleAddResearch = (newItem: Omit<ResearchItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: ResearchItem = {
      ...newItem,
      id: 'res-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      researchItems: [item, ...prev.researchItems]
    }));
    commitLog('Research', 'Archive', `Reference manual "${item.title}" stored to library.`);
    notify(`Research reference archived.`);
  };

  const handleUpdateResearch = (id: string, updates: Partial<ResearchItem>) => {
    setData(prev => ({
      ...prev,
      researchItems: prev.researchItems.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)
    }));
  };

  const handleDeleteResearch = (id: string) => {
    const item = data.researchItems.find(r => r.id === id);
    if (!item) return;

    setLastDeletedItem({ module: 'researchItems', data: item });
    setData(prev => ({
      ...prev,
      researchItems: prev.researchItems.filter(r => r.id !== id)
    }));
    commitLog('Research', 'Delete', `Reference manual "${item.title}" cleared.`);
    notify(`Reference manual deleted. Click undo to restore.`);
  };

  // Investments
  const handleAddInvestment = (newItem: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: Investment = {
      ...newItem,
      id: 'inv-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      investments: [item, ...prev.investments]
    }));
    commitLog('Investments', 'Expenditure', `Allocated capital overhead of $${item.amount} toward ${item.assetName}.`);
    notify(`Asset expenditure logged successfully.`);
  };

  const handleDeleteInvestment = (id: string) => {
    const item = data.investments.find(i => i.id === id);
    if (!item) return;

    setLastDeletedItem({ module: 'investments', data: item });
    setData(prev => ({
      ...prev,
      investments: prev.investments.filter(i => i.id !== id)
    }));
    commitLog('Investments', 'Erase', `Asset record or project allocation "${item.assetName}" deleted.`);
    notify(`Removed asset allocation "${item.assetName}". Click undo below to restore.`);
  };

  // Social ideas
  const handleAddSocialIdea = (newItem: Omit<SocialIdea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: SocialIdea = {
      ...newItem,
      id: 'soc-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      socialIdeas: [item, ...prev.socialIdeas]
    }));
    commitLog('Social Intel', 'Bake', `Strategy proposal "${item.title}" initialized in content lab.`);
    notify(`Content incubator draft created.`);
  };

  const handleUpdateSocialIdea = (id: string, updates: Partial<SocialIdea>) => {
    setData(prev => ({
      ...prev,
      socialIdeas: prev.socialIdeas.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)
    }));
    const target = data.socialIdeas.find(s => s.id === id);
    commitLog('Social Intel', 'Phase Change', `Promotion of social draft [${target?.title}] to ${updates.status || target?.status}.`);
  };

  const handleDeleteSocialIdea = (id: string) => {
    const item = data.socialIdeas.find(s => s.id === id);
    if (!item) return;

    setLastDeletedItem({ module: 'socialIdeas', data: item });
    setData(prev => ({
      ...prev,
      socialIdeas: prev.socialIdeas.filter(s => s.id !== id)
    }));
    commitLog('Social Intel', 'Remove', `Strategic social item [${item.title}] cleared.`);
    notify(`Erased content strategy board.`);
  };

  // Team
  const handleAddTeamMember = (newMem: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const member: TeamMember = {
      ...newMem,
      id: 'team-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      teamMembers: [member, ...prev.teamMembers]
    }));
    commitLog('Team Matrix', 'Onboard', `Operator [${member.name}] onboarded as ${member.role}.`);
    notify(`Onboarded shift supervisor metadata.`);
  };

  const handleUpdateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    }));
    const target = data.teamMembers.find(t => t.id === id);
    commitLog('Team Matrix', 'Shift Alteration', `Modified duty permissions or activity logs for [${target?.name}].`);
  };

  const handleDeleteTeamMember = (id: string) => {
    const item = data.teamMembers.find(t => t.id === id);
    if (!item) return;

    setLastDeletedItem({ module: 'teamMembers', data: item });
    setData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(t => t.id !== id)
    }));
    commitLog('Team Matrix', 'Delete', `Offboarded team member operator [${item.name}].`);
    notify(`Offboarded operator [${item.name}]. Click undo below to restore.`);
  };

  // RESTORE BACKUP SNAPSHOTS
  const handleRestoreBackup = (parsedBackup: WorkspaceBackup) => {
    setData({
      ...parsedBackup,
      activityLogs: [
        {
          id: 'log-' + Math.random().toString(36).substr(2, 9),
          module: 'System',
          action: 'Restore Parse',
          description: 'Client JSON upload completed successfully. All modules refreshed offline.',
          timestamp: new Date().toISOString()
        },
        ...parsedBackup.activityLogs
      ].slice(0, 100)
    });
    notify("Database restored successfully.");
  };

  // FULL STORAGE CLEAR (RESET SEED)
  const handleClearDatabase = () => {
    setData(INITIAL_SEED_DATA);
    notify("Offline database reset completed successfully.");
  };

  // UNDO LAST ERASURE ACTION
  const triggerUndoDelete = () => {
    if (!lastDeletedItem) return;

    const { module, data: deletedData } = lastDeletedItem;
    setData(prev => ({
      ...prev,
      [module]: [deletedData, ...prev[module]]
    }));

    commitLog('System', 'Undo Action', `Reverted absolute erasure. Restored ID "${deletedData.id}" to module "${module}".`);
    setLastDeletedItem(null);
    notify("Restoration completed successfully.");
  };

  // Nav mapping config
  const navItems = [
    { name: 'Home Dashboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Memory Vault', icon: <Pin className="w-4 h-4" /> },
    { name: 'Social Intel', icon: <Share2 className="w-4 h-4" /> },
    { name: 'Investments', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Clients', icon: <Users className="w-4 h-4" /> },
    { name: 'Leads', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Research', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Team', icon: <Users className="w-4 h-4 text-slate-500" /> },
    { name: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#F8F9FA] text-slate-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-950" id="mahesiworkplace-chassis">
      
      {/* Top Header with Warm Gradient */}
      <header className="h-16 w-full flex items-center justify-between px-6 bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md z-20 shrink-0" id="main-header">
        <div className="flex items-center gap-3">
          {/* Toggle Sidebar Button */}
          <button
            id="btn-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 px-1.5 hover:bg-white/10 text-white rounded-lg transition shrink-0 cursor-pointer"
            title={sidebarOpen ? 'Collapse layout' : 'Expand layout'}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-inner">M</div>
          <h1 className="text-xl font-semibold tracking-tight text-white hidden sm:block">Mahediworkplace</h1>
          <span className="hidden md:inline-block ml-4 px-2 py-0.5 bg-white/20 text-[10px] uppercase font-bold rounded tracking-wider border border-white/30 text-white font-mono">Local Engine Active</span>
        </div>

        {/* Quick action bar search */}
        <div className="flex-1 max-w-xl px-12 hidden md:block">
          <div className="relative flex items-center">
            <div className="absolute left-4 opacity-70 text-white">
              <Search className="w-4 h-4" />
            </div>
            <button
              id="btn-trigger-search-palette"
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-left focus:outline-none focus:bg-white/20 cursor-pointer transition flex items-center justify-between"
            >
              <span className="text-white/70">Search anything (Ctrl + K)</span>
              <kbd className="px-1.5 py-0.5 bg-white/15 border border-white/25 rounded text-[9px] font-mono shadow-sm text-white/80">⌘ K</kbd>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Secure Display */}
          <div className="hidden lg:flex items-center gap-2 text-xs mr-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[10px] tracking-wider text-white/90 bg-white/10 px-2.5 py-0.5 rounded border border-white/25 font-mono">
              Secure Sandbox
            </span>
          </div>

          <div className="text-right text-white">
            <p className="text-xs font-medium opacity-90">Mahedi Rahman</p>
            <p className="text-[10px] opacity-70 flex items-center gap-1 justify-end">
              <Clock className="w-2.5 h-2.5 text-amber-300" />
              01:30 UTC
            </p>
          </div>
          <div className="w-9 h-9 bg-slate-800 rounded-full border-2 border-white/30 flex items-center justify-center text-white font-mono text-sm font-bold shadow-inner shrink-0">
            M
          </div>
        </div>
      </header>

      {/* Under-header Content Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Search / Global Command Palette trigger dialog (Ctrl + K) */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          memories={data.memories}
          tasks={data.tasks}
          clients={data.clients}
          leads={data.leads}
          researchItems={data.researchItems}
          investments={data.investments}
          onSelectItem={(mod) => {
            setActiveModule(mod);
            setCommandPaletteOpen(false);
          }}
        />

        {/* Responsive Left Navigation Sidebar - Sleek White Style */}
        <aside 
          className={`bg-white text-slate-700 w-56 border-r border-slate-200 flex flex-col justify-between transition-all duration-300 shrink-0 shadow-sm z-10 ${
            sidebarOpen ? 'translate-x-0 ml-0' : '-translate-x-56 -ml-56'
          }`}
          id="sidebar-navigation"
        >
          <div className="flex flex-col flex-1 p-3">
            <nav className="space-y-1" id="sidebar-navigation-links">
              <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Workplace modules</div>
              
              {navItems.map((item) => {
                const active = activeModule === item.name;
                return (
                  <button
                    id={`btn-nav-sidebar-${item.name.replace(/\s+/g, '-')}`}
                    key={item.name}
                    onClick={() => {
                      setActiveModule(item.name);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition duration-150 select-none cursor-pointer ${
                      active 
                        ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className={`${active ? 'text-orange-600' : 'text-slate-400'}`}>{item.icon}</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-orange-600 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer operator info */}
          <div className="p-4 border-t border-slate-150 bg-slate-50/50 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white font-extrabold text-button tracking-wider flex items-center justify-center font-mono border border-slate-200">
                M
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-800 font-semibold truncate text-[11px]">Mahedi Rahman</div>
                <div className="text-[10px] text-slate-400 truncate">System Operator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main View Area Container */}
        <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#F8F9FA]" id="main-content-window">
          
          {/* Global Action Banner Notification & Undo capability */}
          <AnimatePresence>
            {(toastMessage || lastDeletedItem) && (
              <div className="px-6 pt-5" id="floating-notification-bar">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900 border border-slate-700 text-white rounded-2xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xl"
                >
                  <div className="flex items-center gap-3 font-medium text-xs">
                    {lastDeletedItem ? (
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                    )}
                    <span>{toastMessage || "Item erased successfully from persistent sandbox."}</span>
                  </div>

                  {lastDeletedItem && (
                    <button
                      id="btn-trigger-undo"
                      onClick={triggerUndoDelete}
                      className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1 hover:scale-98 active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Revert Change (Undo)
                    </button>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Main View Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8" id="module-display-pane">
            <React.Fragment>
              {activeModule === 'Home Dashboard' && (
                <HomeDashboard
                  memories={data.memories}
                  tasks={data.tasks}
                  clients={data.clients}
                  leads={data.leads}
                  investments={data.investments}
                  activityLogs={data.activityLogs}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onQuickAddMemory={(text) => handleAddMemory({ title: '', content: text, tags: ['thought-dump'], pinned: false, archived: false, priority: 'medium' })}
                  onNavigateToModule={setActiveModule}
                />
              )}

              {activeModule === 'Memory Vault' && (
                <MemoryVault
                  memories={data.memories}
                  onAddMemory={handleAddMemory}
                  onUpdateMemory={handleUpdateMemory}
                  onDeleteMemory={handleDeleteMemory}
                />
              )}

              {activeModule === 'Social Intel' && (
                <SocialIntel
                  ideas={data.socialIdeas}
                  onAddIdea={handleAddSocialIdea}
                  onUpdateIdea={handleUpdateSocialIdea}
                  onDeleteIdea={handleDeleteSocialIdea}
                />
              )}

              {activeModule === 'Investments' && (
                <Investments
                  investments={data.investments}
                  onAddInvestment={handleAddInvestment}
                  onDeleteInvestment={handleDeleteInvestment}
                />
              )}

              {activeModule === 'Clients' && (
                <Clients
                  clients={data.clients}
                  onAddClient={handleAddClient}
                  onUpdateClient={handleUpdateClient}
                  onDeleteClient={handleDeleteClient}
                />
              )}

              {activeModule === 'Leads' && (
                <Leads
                  leads={data.leads}
                  onAddLead={handleAddLead}
                  onUpdateLead={handleUpdateLead}
                  onDeleteLead={handleDeleteLead}
                />
              )}

              {activeModule === 'Research' && (
                <Research
                  researchItems={data.researchItems}
                  onAddResearch={handleAddResearch}
                  onUpdateResearch={handleUpdateResearch}
                  onDeleteResearch={handleDeleteResearch}
                />
              )}

              {activeModule === 'Team' && (
                <Team
                  teamMembers={data.teamMembers}
                  onAddTeamMember={handleAddTeamMember}
                  onUpdateTeamMember={handleUpdateTeamMember}
                  onDeleteTeamMember={handleDeleteTeamMember}
                />
              )}

              {activeModule === 'Settings' && (
                <SettingsPage
                  entireData={data}
                  onRestoreBackup={handleRestoreBackup}
                  onClearDatabase={handleClearDatabase}
                />
              )}
            </React.Fragment>
          </div>

        </main>
      </div>
    </div>
  );
}
