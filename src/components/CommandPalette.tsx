import React, { useState, useEffect, useRef } from 'react';
import { Memory, LocalTask, Client, Lead, ResearchItem, Investment } from '../types';
import { 
  Search, 
  X, 
  CornerDownLeft, 
  Pin, 
  Briefcase, 
  Users, 
  BookOpen, 
  TrendingUp,
  Activity
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  tasks: LocalTask[];
  clients: Client[];
  leads: Lead[];
  researchItems: ResearchItem[];
  investments: Investment[];
  onSelectItem: (module: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  memories,
  tasks,
  clients,
  leads,
  researchItems,
  investments,
  onSelectItem,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when palette triggers open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Global search match arrays
  const matchedMemories = query ? memories.filter(m => (m.title + ' ' + m.content).toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];
  const matchedTasks = query ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];
  const matchedClients = query ? clients.filter(c => (c.name + ' ' + c.company).toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];
  const matchedLeads = query ? leads.filter(l => (l.name + ' ' + l.notes).toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];
  const matchedResearch = query ? researchItems.filter(r => (r.title + ' ' + r.summary).toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];
  const matchedInvestments = query ? investments.filter(i => i.assetName.toLowerCase().includes(query.toLowerCase())).slice(0, 3) : [];

  const totalMatches = matchedMemories.length + matchedTasks.length + matchedClients.length + matchedLeads.length + matchedResearch.length + matchedInvestments.length;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[12vh] p-4" 
      onClick={onClose}
      id="global-command-palette-overlay"
    >
      <div 
        className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
        id="command-palette-card"
      >
        {/* Search header box */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              id="palette-search-input"
              type="text"
              placeholder="Search anything: 'Apex', 'container', 'audit', 'formulas', 'rent'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 border-none focus:ring-0"
            />
          </div>
          <button 
            id="btn-close-palette"
            onClick={onClose} 
            className="p-1 px-2 text-xs font-semibold bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-lg shadow-sm transition"
          >
            ESC
          </button>
        </div>

        {/* Search results catalog */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query ? (
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Jump Section Coordinates</div>
              <div className="grid grid-cols-2 gap-2" id="palette-jumps">
                {[
                  { name: 'Home Dashboard', desc: 'Overview performance KPIs', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
                  { name: 'Memory Vault', desc: 'Secure operational note dumps', icon: <Pin className="w-4 h-4 text-orange-500" /> },
                  { name: 'Clients', desc: 'B2B profiles review ledger', icon: <Users className="w-4 h-4 text-blue-550" /> },
                  { name: 'Leads', desc: 'Deal pipeline negotiation status', icon: <Briefcase className="w-4 h-4 text-purple-550" /> },
                  { name: 'Research', desc: 'Regulatory and standard checklists', icon: <BookOpen className="w-4 h-4 text-rose-500" /> },
                  { name: 'Investments', desc: 'Hardware asset allocation caps', icon: <TrendingUp className="w-4 h-4 text-emerald-600" /> },
                ].map((item) => (
                  <button
                    key={item.name}
                    id={`btn-palette-goto-${item.name.replace(/\s+/g, '-')}`}
                    onClick={() => {
                      onSelectItem(item.name);
                      onClose();
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 border border-transparent hover:border-slate-101 rounded-2xl transition flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-white transition shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-850 group-hover:text-indigo-650 flex items-center gap-1">
                        {item.name} <CornerDownLeft className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60" />
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4" id="palette-search-results">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex justify-between">
                <span>Active Database Matches</span>
                <span className="font-mono">{totalMatches} hit entries found</span>
              </div>

              {totalMatches === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No records matching &apos;{query}&apos; found.
                </div>
              )}

              {/* Grouped results layout */}
              {matchedMemories.length > 0 && (
                <div className="space-y-1.5" id="group-matched-memories">
                  <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest font-mono">Memory Vault</div>
                  {matchedMemories.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => { onSelectItem('Memory Vault'); onClose(); }}
                      className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer transition text-xs flex justify-between items-center"
                    >
                      <span className="font-semibold text-slate-800 truncate mr-3">{m.title || 'Untitled note'} - {m.content}</span>
                      <span className="text-[9px] font-mono select-none text-slate-400">JUMP ↵</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedClients.length > 0 && (
                <div className="space-y-1.5" id="group-matched-clients">
                  <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Clients Ledger</div>
                  {matchedClients.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => { onSelectItem('Clients'); onClose(); }}
                      className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer transition text-xs flex justify-between items-center"
                    >
                      <span className="font-semibold text-slate-800 truncate mr-3">{c.name} ({c.company})</span>
                      <span className="text-[9px] font-mono select-none text-slate-400">JUMP ↵</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedLeads.length > 0 && (
                <div className="space-y-1.5" id="group-matched-leads">
                  <div className="text-[10px] font-bold text-purple-500 uppercase tracking-widest font-mono">Leads Funnel</div>
                  {matchedLeads.map(l => (
                    <div 
                      key={l.id} 
                      onClick={() => { onSelectItem('Leads'); onClose(); }}
                      className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer transition text-xs flex justify-between items-center"
                    >
                      <span className="font-semibold text-slate-800 truncate mr-3">{l.name} - Stage: {l.stage}</span>
                      <span className="text-[9px] font-mono select-none text-slate-400">JUMP ↵</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedResearch.length > 0 && (
                <div className="space-y-1.5" id="group-matched-research">
                  <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono">Research Archives</div>
                  {matchedResearch.map(r => (
                    <div 
                      key={r.id} 
                      onClick={() => { onSelectItem('Research'); onClose(); }}
                      className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer transition text-xs flex justify-between items-center"
                    >
                      <span className="font-semibold text-slate-800 truncate mr-3">{r.title} - {r.summary}</span>
                      <span className="text-[9px] font-mono select-none text-slate-400">JUMP ↵</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedTasks.length > 0 && (
                <div className="space-y-1.5" id="group-matched-tasks">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">Tasks Agenda</div>
                  {matchedTasks.map(t => (
                    <div 
                      key={t.id} 
                      onClick={() => { onSelectItem('Home Dashboard'); onClose(); }}
                      className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer transition text-xs flex justify-between items-center"
                    >
                      <span className="font-semibold text-slate-800 truncate mr-3">{t.title}</span>
                      <span className="text-[9px] font-mono select-none text-slate-400">JUMP ↵</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedInvestments.length > 0 && (
                <div className="space-y-1.5" id="group-matched-investments">
                  <div className="text-[10px] font-bold text-violet-500 uppercase tracking-widest font-mono">Capital Upgrade</div>
                  {matchedInvestments.map(i => (
                    <div 
                      key={i.id} 
                      onClick={() => { onSelectItem('Investments'); onClose(); }}
                      className="p-2.5 hover:bg-slate-50 border border-slate-100 rounded-xl cursor-pointer transition text-xs flex justify-between items-center"
                    >
                      <span className="font-semibold text-slate-800 truncate mr-3">{i.assetName} - ${i.amount.toLocaleString()}</span>
                      <span className="text-[9px] font-mono select-none text-slate-400">JUMP ↵</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 flex justify-between items-center">
          <div className="flex gap-4">
            <span><kbd className="px-1 bg-white border border-slate-205 rounded">↑↓</kbd> Move</span>
            <span><kbd className="px-1 bg-white border border-slate-205 rounded">Enter</kbd> Select</span>
            <span><kbd className="px-1 bg-white border border-slate-205 rounded">Esc</kbd> Close</span>
          </div>
          <span className="font-bold uppercase tracking-wider text-orange-600 font-mono">Farhan's Warehouse OS</span>
        </div>
      </div>
    </div>
  );
}
