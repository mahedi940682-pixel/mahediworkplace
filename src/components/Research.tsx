import React, { useState } from 'react';
import { ResearchItem } from '../types';
import { 
  Plus, 
  Trash2, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Tag, 
  AlertCircle,
  Pin,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResearchProps {
  researchItems: ResearchItem[];
  onAddResearch: (research: Omit<ResearchItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateResearch: (id: string, updates: Partial<ResearchItem>) => void;
  onDeleteResearch: (id: string) => void;
}

export default function Research({
  researchItems,
  onAddResearch,
  onUpdateResearch,
  onDeleteResearch,
}: ResearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onAddResearch({
      title: title.trim(),
      sourceUrl: sourceUrl.trim() || '#',
      summary: summary.trim(),
      notes: notes.trim(),
      tags,
      pinned: false,
    });

    setTitle('');
    setSourceUrl('');
    setSummary('');
    setNotes('');
    setTagsInput('');
    setIsAdding(false);
  };

  const allTags = Array.from(
    new Set(researchItems.flatMap(r => r.tags))
  ).filter(Boolean);

  const filteredItems = researchItems
    .filter(r => {
      const matchText = (r.title + ' ' + r.summary + ' ' + r.notes).toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    })
    .filter(r => !selectedTag || r.tags.includes(selectedTag));

  return (
    <div className="space-y-6" id="research-root">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
            Research Manuals & Market Intel
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Archive regulatory compliances, temperature calibration checklists, IoT architecture reports, and layout research notes.
          </p>
        </div>

        <button
          id="btn-trigger-add-research"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Research Draft' : 'Archive Structured Reference'}
        </button>
      </div>

      {/* Creation panel (Dark card theme!) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800"
            id="add-research-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Structured Reference Entry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="research-form-title">Article/Report Title *</label>
                  <input
                    id="research-form-title"
                    type="text"
                    required
                    placeholder="e.g. OSHA climate stability compliance standard..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="research-form-tags">Topic Keywords / Tags</label>
                  <input
                    id="research-form-tags"
                    type="text"
                    placeholder="osha, compliance, cold-chain"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="research-form-url">Source URL (if any)</label>
                  <input
                    id="research-form-url"
                    type="text"
                    placeholder="https://fda.gov/cold-chain-info"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Attachments Preview (simulated)</label>
                  <div className="w-full bg-slate-950 text-slate-500 border border-dashed border-slate-800 rounded-xl px-4 py-2.5 text-xs select-none">
                    Drag files or select to attach PDF/Logs fully offline
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="research-form-summary">Key Takeaway Summary * (Short abstract)</label>
                <textarea
                  id="research-form-summary"
                  rows={2}
                  required
                  placeholder="The absolute core results, e.g. Humidity cannot pass 65% for pharmaceutical inventory..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="research-form-notes">Extended Structured Research Notes (Supports text outlines)</label>
                <textarea
                  id="research-form-notes"
                  rows={3}
                  placeholder="Section 4 rules: \n- Weekly sensor test\n- Safety buffer checklist parameters..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  id="btn-cancel-create-research"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-create-research"
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Archive Reference
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter boards */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            id="research-search-field"
            type="text"
            placeholder="Search within report titles, summaries, or structured regulatory notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 border-none rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1">Topic:</span>
            <button
              id="btn-res-tag-all"
              onClick={() => setSelectedTag(null)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-mono transition border ${
                selectedTag === null ? 'bg-slate-900 border-slate-900 text-white font-semibold' : 'bg-slate-150/60 border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Topics
            </button>
            {allTags.map((tag) => (
              <button
                id={`btn-res-tag-${tag}`}
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-mono transition border cursor-pointer ${
                  selectedTag === tag ? 'bg-orange-600 border-orange-600 text-white font-semibold' : 'bg-slate-105/60 border-transparent text-slate-605 hover:bg-slate-100'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Research Grid list */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm leading-relaxed">
          <div className="max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No references match search</h3>
            <p className="text-xs text-slate-400">
              Clear filters or quickly document some research concerning automated shelves, sensors, safety tools, or logistics formulas.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="research-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/50 uppercase">
                    Ref ID: {item.id}
                  </span>

                  <button
                    id={`btn-pin-research-${item.id}`}
                    onClick={() => onUpdateResearch(item.id, { pinned: !item.pinned })}
                    className="p-1 rounded-lg hover:bg-slate-50 transition text-slate-300 hover:text-orange-500 cursor-pointer"
                  >
                    <Pin className={`w-3.5 h-3.5 ${item.pinned ? 'fill-orange-500 text-orange-500' : ''}`} />
                  </button>
                </div>

                <div className="space-y-1 mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    {item.title}
                  </h3>
                  {item.sourceUrl && item.sourceUrl !== '#' && (
                    <a 
                      href={item.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-orange-600 hover:underline font-semibold"
                    >
                      View Source Reference <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Key Takeaway</span>
                    <p className="text-slate-700 text-xs font-semibold leading-relaxed bg-orange-50/30 p-3 rounded-2xl border border-orange-500/10">
                      {item.summary}
                    </p>
                  </div>

                  {item.notes && (
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Extended Outlines</span>
                      <pre className="text-slate-600 text-xs font-mono whitespace-pre-wrap leading-normal bg-slate-50/50 p-3 rounded-2xl border border-slate-50 max-h-40 overflow-y-auto">
                        {item.notes}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-5 gap-4">
                <div className="flex flex-wrap gap-1 min-w-0">
                  {item.tags.map(t => (
                    <span 
                      key={t} 
                      onClick={() => setSelectedTag(t)}
                      className="text-[9px] px-2 py-0.5 bg-slate-100 hover:bg-orange-100 text-slate-500 hover:text-orange-850 rounded font-mono border border-slate-50 cursor-pointer transition"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  id={`btn-delete-research-${item.id}`}
                  onClick={() => {
                    if (confirm('Delete this research reference permanently?')) {
                      onDeleteResearch(item.id);
                    }
                  }}
                  className="p-1.5 hover:bg-rose-50 text-slate-350 hover:text-rose-600 rounded-lg transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
