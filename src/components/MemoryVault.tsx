import React, { useState } from 'react';
import { Memory } from '../types';
import { 
  Pin, 
  Trash2, 
  Archive, 
  Plus, 
  Search, 
  Tag, 
  Check, 
  FolderPlus,
  AlertCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryVaultProps {
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMemory: (id: string, updates: Partial<Memory>) => void;
  onDeleteMemory: (id: string) => void;
}

export default function MemoryVault({
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
}: MemoryVaultProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'pin'>('pin');
  const [filterArchived, setFilterArchived] = useState<boolean>(false);

  // New Memory state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // All tags pool
  const allTags = Array.from(
    new Set(memories.flatMap(m => m.tags))
  ).filter(Boolean);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onAddMemory({
      title: title.trim(),
      content: content.trim(),
      tags,
      pinned: false,
      archived: false,
      priority,
    });

    // Reset Form
    setTitle('');
    setContent('');
    setPriority('medium');
    setTagsInput('');
    setIsAdding(false);
  };

  // Filter & Search Logic
  const filteredMemories = memories
    .filter(mem => {
      // Archive filter
      if (filterArchived) {
        return mem.archived;
      } else {
        return !mem.archived;
      }
    })
    .filter(mem => {
      // Search query
      const matchText = (mem.title + ' ' + mem.content).toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    })
    .filter(mem => {
      // Tag filter
      if (!selectedTag) return true;
      return mem.tags.includes(selectedTag);
    });

  // Sorting
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (sortBy === 'pin') {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
    }
    if (sortBy === 'priority') {
      const weight = { high: 3, medium: 2, low: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    // Default or date sorting: newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6" id="memory-vault-root">
      
      {/* Header operations bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
            Memory Vault & Core Thoughts
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Immutably capture business rules, daily logs, notes, and operations.
          </p>
        </div>

        <button
          id="btn-trigger-add-memory"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Entry Form' : 'Capture New Memory'}
        </button>
      </div>

      {/* Add Memory Panel (Dark card theme as requested!) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800"
            id="add-memory-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-orange-500" />
              Write To Permanent Vault
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="memory-form-title">Memory Title (Optional)</label>
                  <input
                    id="memory-form-title"
                    type="text"
                    placeholder="e.g. Invoicing routing parameters..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="memory-form-tags">Comma Separated Tags</label>
                  <input
                    id="memory-form-tags"
                    type="text"
                    placeholder="finance, invoice, instructions"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="memory-form-content">Core Content / Thought Dump *</label>
                <textarea
                  id="memory-form-content"
                  rows={4}
                  required
                  placeholder="Draft your operational findings, formula guides, phone notes, or strategic steps..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500"
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">Set Priority:</span>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((prio) => (
                      <button
                        id={`btn-form-prio-${prio}`}
                        key={prio}
                        type="button"
                        onClick={() => setPriority(prio)}
                        className={`px-3 py-1 text-xs select-none uppercase font-bold tracking-wider rounded-lg border transition cursor-pointer ${
                          priority === prio
                            ? prio === 'high' ? 'bg-rose-500/20 border-rose-500 text-rose-300' : prio === 'medium' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-700 border-slate-500 text-slate-300'
                            : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {prio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    id="btn-cancel-create-memory"
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-create-memory"
                    type="submit"
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-650 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Commit to Vault
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        
        {/* Search Input and Sort Selectors */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              id="memory-search-field"
              type="text"
              placeholder="Search across keywords, formulas, and memo tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 border-none rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                id="select-memory-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-slate-600 border-none focus:outline-none focus:ring-0 cursor-pointer pr-1"
              >
                <option value="pin">Sort: Pinned First</option>
                <option value="date">Sort: Recent First</option>
                <option value="priority">Sort: By Priority</option>
              </select>
            </div>

            <button
              id="btn-filter-toggle-archive"
              onClick={() => setFilterArchived(!filterArchived)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition flex items-center gap-1.5 border cursor-pointer ${
                filterArchived 
                  ? 'bg-orange-50 border-orange-200 text-orange-800' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              {filterArchived ? 'Viewing Archived' : 'Show Archived'}
            </button>
          </div>
        </div>

        {/* Tags cloud filtering */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-50">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono mr-1">Filter Tag:</span>
            <button
              id="btn-tag-filter-all"
              onClick={() => setSelectedTag(null)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-mono transition border cursor-pointer ${
                selectedTag === null 
                  ? 'bg-slate-900 border-slate-900 text-white font-semibold' 
                  : 'bg-slate-100/60 border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                id={`btn-tag-filter-${tag}`}
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-mono transition border cursor-pointer ${
                  selectedTag === tag 
                    ? 'bg-orange-600 border-orange-600 text-white font-semibold' 
                    : 'bg-slate-100/60 border-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Note Cards */}
      {sortedMemories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm leading-relaxed">
          <div className="max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No items match your criteria</h3>
            <p className="text-xs text-slate-400">
              {filterArchived 
                ? 'Your archived vault represents a clean slate. No archived memories found.' 
                : 'Your operational index is complete, but no active matches were flagged. Double check spelling or tag filters!'}
            </p>
            {selectedTag || searchQuery ? (
              <button
                id="btn-reset-filters"
                onClick={() => { setSelectedTag(null); setSearchQuery(''); }}
                className="text-xs text-orange-600 font-semibold hover:underline mt-2 cursor-pointer"
              >
                Reset Search and Filters
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="memories-grid">
          {sortedMemories.map((mem) => (
            <div 
              key={mem.id} 
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-md transition duration-200 relative group flex flex-col justify-between"
            >
              <div>
                {/* Micro operational metrics (Priority tag & Pin action) */}
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                  <span className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                    mem.priority === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' : mem.priority === 'medium' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {mem.priority} priority
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-pin-memory-${mem.id}`}
                      onClick={() => onUpdateMemory(mem.id, { pinned: !mem.pinned })}
                      title={mem.pinned ? 'Unpin guideline' : 'Pin to top of Dashboard'}
                      className={`p-1 rounded-md transition cursor-pointer ${mem.pinned ? 'text-orange-500 hover:text-slate-400' : 'text-slate-300 hover:text-orange-500'}`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${mem.pinned ? 'fill-orange-500 text-orange-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-1">
                  {mem.title || 'Untitled Thought Entry'}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4 whitespace-pre-wrap">
                  {mem.content}
                </p>
              </div>

              {/* Card Footer tags and Actions */}
              <div className="pt-3 border-t border-slate-50 mt-4 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1 min-w-0">
                  {mem.tags.map(tag => (
                    <span 
                      key={tag} 
                      onClick={() => setSelectedTag(tag)}
                      className="text-[10px] px-2 py-0.5 bg-slate-50 hover:bg-orange-50 text-slate-500 hover:text-orange-850 cursor-pointer rounded-md font-mono border border-slate-100 transition whitespace-nowrap"
                    >
                      #{tag}
                    </span>
                  ))}
                  {mem.tags.length === 0 && <span className="text-[10px] text-slate-300 font-mono">no tags</span>}
                </div>

                <div className="flex items-center shrink-0 gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition">
                  <button
                    id={`btn-archive-memory-${mem.id}`}
                    onClick={() => onUpdateMemory(mem.id, { archived: !mem.archived })}
                    title={mem.archived ? 'Restore from Archive' : 'Archive Memory'}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`btn-delete-memory-${mem.id}`}
                    onClick={() => {
                      if (confirm('Delete this memory permanently? Permanent deletions can be reverted instantly using undo if supported.')) {
                        onDeleteMemory(mem.id);
                      }
                    }}
                    title="Delete Permanently"
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timestamp Indicator */}
              <div className="text-[9px] font-mono text-slate-300 text-right mt-1.5 shrink-0 select-none">
                <Clock className="w-2.5 h-2.5 inline-block mr-1" />
                {new Date(mem.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
