import React, { useState } from 'react';
import { SocialIdea } from '../types';
import { 
  Plus, 
  Trash2, 
  Eye, 
  PenTool, 
  Share2, 
  Hash, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialIntelProps {
  ideas: SocialIdea[];
  onAddIdea: (idea: Omit<SocialIdea, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateIdea: (id: string, updates: Partial<SocialIdea>) => void;
  onDeleteIdea: (id: string) => void;
}

const PLATFORM_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  twitter: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' },
  linkedin: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  youtube: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  facebook: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  instagram: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' },
  tiktok: { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200' },
  other: { bg: 'bg-purple-50', text: 'text-purple-750', border: 'border-purple-100' },
};

export default function SocialIntel({
  ideas,
  onAddIdea,
  onUpdateIdea,
  onDeleteIdea,
}: SocialIntelProps) {
  const [platform, setPlatform] = useState<SocialIdea['platform']>('linkedin');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<SocialIdea['status']>('draft');
  const [isAdding, setIsAdding] = useState(false);
  
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    onAddIdea({
      platform,
      title: title.trim(),
      content: content.trim(),
      status,
      tags,
    });

    setTitle('');
    setContent('');
    setTagsInput('');
    setStatus('draft');
    setIsAdding(false);
  };

  const getPlatformIcon = (plat: SocialIdea['platform']) => {
    switch (plat) {
      case 'twitter':
        return <Twitter className="w-4 h-5 text-sky-500" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-5 text-blue-600" />;
      case 'youtube':
        return <Youtube className="w-4 h-5 text-rose-600" />;
      default:
        return <Globe className="w-4 h-4 text-slate-500" />;
    }
  };

  const filteredIdeas = ideas
    .filter(idea => !filterPlatform || idea.platform === filterPlatform)
    .filter(idea => !filterStatus || idea.status === filterStatus);

  return (
    <div className="space-y-6" id="social-intel-root">
      
      {/* Module Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full shrink-0"></span>
            Social Intel & Content Lab
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Store content strategies, draft LinkedIn posts, Twitter threads, and track viral trend takeaways offline.
          </p>
        </div>

        <button
          id="btn-trigger-add-idea"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 font-bold" /> {isAdding ? 'Close Lab Draft' : 'Draft New Strategy'}
        </button>
      </div>

      {/* Editor Panel (Dark card theme!) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800"
            id="add-idea-panel"
          >
            <h3 className="text-base font-bold text-orange-400 mb-4 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-orange-500" />
              Content Strategy Incubator
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="idea-form-platform">Target Channel Platform</label>
                  <select
                    id="idea-form-platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="linkedin">LinkedIn Professional Post</option>
                    <option value="twitter">X / Twitter Thread</option>
                    <option value="youtube">YouTube Video Strategy</option>
                    <option value="facebook">Facebook General</option>
                    <option value="instagram">Instagram Highlights</option>
                    <option value="tiktok">TikTok Video Script</option>
                    <option value="other">Other Brand Output</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="idea-form-title">Strategy / Draft Title</label>
                  <input
                    id="idea-form-title"
                    type="text"
                    required
                    placeholder="e.g. Scalability metrics thread..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400" htmlFor="idea-form-tags">Topic Keywords / Tags</label>
                  <input
                    id="idea-form-tags"
                    type="text"
                    placeholder="efficiency, workflow, tech"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="idea-form-content">Post Draft Description / Script *</label>
                <textarea
                  id="idea-form-content"
                  rows={4}
                  required
                  placeholder="Hook: Start with a heavy question... Body: Write three key points. Ending: Request feedback..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-850 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 placeholder-slate-500 font-sans"
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">Status State:</span>
                  <div className="flex gap-2">
                    {(['draft', 'scheduled', 'published'] as const).map((st) => (
                      <button
                        id={`btn-form-status-${st}`}
                        key={st}
                        type="button"
                        onClick={() => setStatus(st)}
                        className={`px-3 py-1 text-xs select-none uppercase font-bold tracking-wider rounded-lg border transition cursor-pointer ${
                          status === st
                            ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                            : 'bg-transparent border-slate-850 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    id="btn-cancel-create-idea"
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-create-idea"
                    type="submit"
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Bake Post Draft
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid search filters */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          
          {/* Target platform selection button filter */}
          <button
            id={`btn-filter-plat-all`}
            onClick={() => setFilterPlatform(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              !filterPlatform ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-100/60 border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Platforms
          </button>
          {['linkedin', 'twitter', 'youtube'].map((p) => (
            <button
              id={`btn-filter-plat-${p}`}
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filterPlatform === p ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-100/60 border-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="capitalize">{p}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            id="select-filter-status"
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="bg-slate-50 text-xs font-medium text-slate-600 border border-slate-100 rounded-2xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="">Status: All Levels</option>
            <option value="draft">Drafts Only</option>
            <option value="scheduled">Scheduled Only</option>
            <option value="published">Published Only</option>
          </select>
        </div>
      </div>

      {/* Strategy Listings */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm leading-relaxed">
          <div className="max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No strategic post matches</h3>
            <p className="text-xs text-slate-400">
              Draft clean outlines regarding logistics, automated tools, tech arrays, or storage safety formulas.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="ideas-grid">
          {filteredIdeas.map((idea) => {
            const colors = PLATFORM_COLORS[idea.platform] || PLATFORM_COLORS.other;
            return (
              <div 
                key={idea.id} 
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {getPlatformIcon(idea.platform)}
                      <span className="capitalize font-mono">{idea.platform}</span>
                    </span>

                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                      idea.status === 'published' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : idea.status === 'scheduled' ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {idea.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-2">{idea.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-slate-50/50 p-3 rounded-2xl border border-slate-50 mb-4 h-32 overflow-y-auto">
                    {idea.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100/50 rounded text-slate-500 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      id={`btn-cycle-status-${idea.id}`}
                      onClick={() => {
                        const states: SocialIdea['status'][] = ['draft', 'scheduled', 'published'];
                        const priorityIndex = states.indexOf(idea.status);
                        const nextLevel = states[(priorityIndex + 1) % states.length];
                        onUpdateIdea(idea.id, { status: nextLevel });
                      }}
                      title="Promote status"
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-social-${idea.id}`}
                      onClick={() => {
                        if (confirm('Delete this social post idea permanently?')) {
                          onDeleteIdea(idea.id);
                        }
                      }}
                      className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
